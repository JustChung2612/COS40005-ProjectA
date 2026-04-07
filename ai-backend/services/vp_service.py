"""Virtual patient conversation service.

Combines Gemini chat, LangChain in-memory history, and RAG section retrieval
with model fallback for transient API errors.
"""

import os
import json
import hashlib
from typing import Dict, Any, List, Optional
import google.generativeai as genai
from langchain_core.chat_history import InMemoryChatMessageHistory
from langchain_core.messages import HumanMessage, AIMessage
from services.rag_service import RAGService


class VirtualPatientService:
    """Chat service wrapper for one user-case session."""

    MODEL_FALLBACKS = [
        'models/gemini-2.5-flash',
        'models/gemini-2.5-flash-lite',
        'models/gemini-3-flash-preview',
    ]
    
    def __init__(self, case_id: str, user_id: str = "default", case_payload: Optional[Dict[str, Any]] = None):
        """Initialize model, case prompt/knowledge, memory, and RAG helper."""
        self.case_id = case_id
        self.user_id = user_id
        self.case_source = "mongo_json"
        self.case_payload_signature = None

        if not case_payload:
            raise ValueError("JSON-only mode requires 'case_payload' for service initialization")

        self.system_prompt, self.case_knowledge = self._build_case_from_json(case_payload)
        self.case_payload_signature = self._compute_payload_signature(case_payload)
        
        # Gemini model with fallback list
        self.model = self._create_gemini_model()
        
        # In-memory conversation history
        self.chat_history = InMemoryChatMessageHistory()
        
        # RAG retrieval helper
        self.rag = RAGService(use_embeddings=True)
        # Precompute section embeddings once per case to reduce per-turn latency.
        self.rag.prepare_case_sections(self.case_knowledge)
        
        print(f"[VPService] Hybrid initialized: case_id={case_id}, user_id={user_id}, source={self.case_source}")

    def _compute_payload_signature(self, case_payload: Dict[str, Any]) -> str:
        """Return stable fingerprint for one case payload."""
        normalized = self._normalize_case_payload(case_payload)
        text = json.dumps(normalized, ensure_ascii=False, sort_keys=True)
        return hashlib.sha1(text.encode("utf-8")).hexdigest()

    def _normalize_case_payload(self, case_payload: Dict[str, Any]) -> Dict[str, Any]:
        """Normalize payload shape to one case object."""
        if isinstance(case_payload, list):
            return case_payload[0] if case_payload else {}
        return case_payload or {}

    def _lines_from_value(self, value: Any) -> List[str]:
        """Flatten mixed JSON values to plain text lines."""
        if value is None:
            return []
        if isinstance(value, str):
            text = value.strip()
            return [text] if text else []
        if isinstance(value, (int, float, bool)):
            return [str(value)]
        if isinstance(value, list):
            lines: List[str] = []
            for item in value:
                lines.extend(self._lines_from_value(item))
            return [line for line in lines if line]
        if isinstance(value, dict):
            lines = []
            for k, v in value.items():
                nested = self._lines_from_value(v)
                if nested:
                    if len(nested) == 1:
                        lines.append(f"{k}: {nested[0]}")
                    else:
                        lines.append(f"{k}:")
                        lines.extend([f"- {x}" for x in nested])
            return lines
        return [str(value)]

    def _format_section(self, title: str, lines: List[str]) -> str:
        """Format one RAG-recognizable section block."""
        if not lines:
            return f"{title}: Chưa ghi nhận thông tin."
        body = "\n".join(f"- {line}" for line in lines)
        return f"{title}:\n{body}"

    def _build_context_lines(self, title: str, brief: Dict[str, Any]) -> List[str]:
        """Build high-level context lines used by the 'Bối cảnh' section."""
        return [
            f"Tiêu đề ca: {title}",
            f"Triệu chứng chính: {brief.get('name_symptom', 'Chưa rõ')}",
            f"Mô tả tóm tắt: {brief.get('desc', 'Chưa có mô tả')}",
            f"Chuyên khoa: {brief.get('topic', 'Chưa phân loại')}",
        ]

    def _collect_section_lines(self, case_obj: Dict[str, Any]) -> Dict[str, List[str]]:
        """Collect normalized lines for each target knowledge section from JSON payload."""
        title = str(case_obj.get("title") or self.case_id or "Ca bệnh").strip()
        script = case_obj.get("ai_patient_script_model") or {}
        brief = script.get("brief_info") or {}
        assess = case_obj.get("ai_assess_schema") or {}

        sections: Dict[str, List[str]] = {
            "Bối cảnh": self._build_context_lines(title, brief),
            "Lý do vào viện": self._lines_from_value(script.get("presenting_complaint")),
            "Bệnh sử": self._lines_from_value(script.get("history_of_presenting_complaint")),
            "Tiền căn": self._lines_from_value(script.get("past_medical_and_surgical_history")),
            "Lược qua các cơ quan": self._lines_from_value(script.get("key_details")),
            "Chẩn đoán": self._lines_from_value(script.get("diagnosis")),
            "Điều trị": self._lines_from_value((assess.get("management") or {}).get("covered")),
        }

        # Extend grouped sections with additional related JSON fields.
        sections["Bệnh sử"].extend(self._lines_from_value(script.get("ice")))
        sections["Tiền căn"].extend(self._lines_from_value(script.get("drug_history")))
        sections["Tiền căn"].extend(self._lines_from_value(script.get("family_history")))
        sections["Điều trị"].extend(
            self._lines_from_value((assess.get("management") or {}).get("partially_covered"))
        )

        return sections

    def _build_knowledge_sections(self, section_lines: Dict[str, List[str]]) -> List[str]:
        """Render ordered section blocks for CASE_KNOWLEDGE."""
        ordered_titles = [
            "Bối cảnh",
            "Lý do vào viện",
            "Bệnh sử",
            "Tiền căn",
            "Lược qua các cơ quan",
            "Chẩn đoán",
            "Điều trị",
        ]
        return [self._format_section(title, section_lines.get(title, [])) for title in ordered_titles]

    def _build_case_from_json(self, case_payload: Dict[str, Any]) -> tuple[str, str]:
        """Build system prompt and CASE_KNOWLEDGE text from Mongo-style JSON payload."""
        case_obj = self._normalize_case_payload(case_payload)
        section_lines = self._collect_section_lines(case_obj)
        knowledge_sections = self._build_knowledge_sections(section_lines)

        case_knowledge = "\n\n".join(knowledge_sections)

        candidate_instruction = self._lines_from_value(case_obj.get("candidate_instruction"))
        instruction_text = "\n".join(f"- {line}" for line in candidate_instruction) if candidate_instruction else "- Không có hướng dẫn thí sinh."

        system_prompt = f"""
Bạn là một bệnh nhân ảo trong kỳ thi OSCE.
Vai trò của bạn là trả lời câu hỏi theo đúng dữ liệu ca bệnh đã cung cấp.

*** QUY TẮC TUYỆT ĐỐI ***
1. Chỉ trả lời dựa trên thông tin trong KỊCH BẢN CA BỆNH.
2. Không tự bịa dữ liệu y khoa không có trong kịch bản.
3. Trả lời ngắn gọn, tự nhiên như bệnh nhân thật.
4. Nếu thông tin không có trong hồ sơ: trả lời lịch sự, tự nhiên như hội thoại thật, không bịa thêm chi tiết.
     - Không lặp một mẫu câu cố định qua nhiều lượt.
     - Có thể nói ngắn gọn theo ngữ cảnh câu hỏi, ví dụ:
         + "Dạ chỗ này em không rõ lắm ạ."
         + "Phần này em chưa được dặn kỹ nên không nhớ rõ."
         + "Em không chắc thông tin này, bác sĩ hỏi giúp em phần khác trước được không ạ?"
     - Nếu phù hợp, mời bác sĩ hỏi tiếp triệu chứng hoặc diễn tiến thay vì dừng cụt.
5. Với thông tin nhận dạng cá nhân (ví dụ tên, địa chỉ, số điện thoại) nếu hồ sơ không có: nói rõ là hồ sơ không ghi nhận, có thể mời bác sĩ xưng hô bằng anh/chị.
6. Không dùng ký hiệu meta, không ghi chú trong ngoặc vuông, không tự mô tả quy tắc hoặc dữ liệu nguồn.

*** HƯỚNG DẪN THÍ SINH ***
{instruction_text}

*** KỊCH BẢN CA BỆNH ***
{case_knowledge}
""".strip()

        return system_prompt, case_knowledge
    
    def _create_gemini_model(self) -> genai.GenerativeModel:
        """Create Gemini model and configure fallback candidates."""
        api_key = os.getenv('GOOGLE_API_KEY')
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment")
        
        genai.configure(api_key=api_key)
        
        # Fallback priority order.
        self.model_fallbacks = list(self.MODEL_FALLBACKS)
        
        self.current_model = self.model_fallbacks[0]
        
        # Keep prompt in chat history for compatibility.
        return genai.GenerativeModel(
            model_name=self.current_model
        )
    
    def _langchain_to_gemini_history(self) -> List[Dict[str, Any]]:
        """Convert LangChain history to Gemini history and inject system prompt."""
        gemini_history = []
        
        # Inject prompt reminder at the start of each request.
        if len(self.chat_history.messages) == 0:
            gemini_history.append({
                'role': 'user',
                'parts': [{'text': self.system_prompt}]
            })
            gemini_history.append({
                'role': 'model',
                'parts': [{'text': 'Tôi hiểu. Tôi sẽ đóng vai bệnh nhân ảo theo hướng dẫn.'}]
            })
        else:
            gemini_history.append({
                'role': 'user',
                'parts': [{'text': self.system_prompt}]
            })
            gemini_history.append({
                'role': 'model',
                'parts': [{'text': 'Tôi hiểu. Tôi sẽ tiếp tục đóng vai.'}]
            })
        
        for msg in self.chat_history.messages:
            if isinstance(msg, HumanMessage):
                role = 'user'
            elif isinstance(msg, AIMessage):
                role = 'model'
            else:
                continue

            gemini_history.append({
                'role': role,
                'parts': [{'text': msg.content}]
            })
        
        return gemini_history
    
    def _build_rag_enhanced_prompt(self, relevant_context: str) -> str:
        """Insert retrieved context into the case script area of system prompt."""
        parts = self.system_prompt.split("*** KỊCH BẢN CA BỆNH ***")
        
        if len(parts) == 2:
            prefix = parts[0]
            suffix = parts[1]
            
            enhanced_prompt = (
                f"{prefix}"
                f"*** KỊCH BẢN CA BỆNH (Smart Sections RAG) ***\n"
                f"{relevant_context}\n"
                f"{suffix}"
            )
            return enhanced_prompt
        else:
            return self.system_prompt
    
    def chat(self, message: str) -> Dict[str, Any]:
        """Generate a reply with RAG context and model fallback handling."""
        try:
            # Build query-specific context.
            relevant_context = self.rag.retrieve_smart_sections(
                case_knowledge=self.case_knowledge,
                query=message,
                threshold=0.7,
                top_k=4
            )

            original_system_prompt = self.system_prompt
            self.system_prompt = self._build_rag_enhanced_prompt(relevant_context)

            gemini_history = self._langchain_to_gemini_history()

            chat_session = self.model.start_chat(history=gemini_history)

            ai_response = None
            last_error = None

            for i, fallback_model in enumerate(self.model_fallbacks):
                try:
                    if i > 0:
                        print(f"  └─ ⚠️  Trying fallback model: {fallback_model}")
                        self.model = genai.GenerativeModel(model_name=fallback_model)
                        self.current_model = fallback_model
                        chat_session = self.model.start_chat(history=gemini_history)

                    response = chat_session.send_message(message)
                    ai_response = response.text

                    if i > 0:
                        print(f"  └─ ✅ Success with fallback model: {fallback_model}")
                    break

                except Exception as e:
                    last_error = e
                    error_str = str(e)

                    is_quota_error = '429' in error_str or 'quota' in error_str.lower() or 'ResourceExhausted' in error_str
                    is_timeout = '504' in error_str or 'Deadline' in error_str or 'timeout' in error_str.lower()

                    if is_quota_error:
                        print(f"  └─ ⚠️  Model {fallback_model} quota exceeded")
                        if i < len(self.model_fallbacks) - 1:
                            continue
                        else:
                            print(f"  └─ ❌ All models exhausted")
                            raise Exception("All Gemini models quota exceeded. Please try again later or upgrade your API plan.")

                    elif is_timeout and i < len(self.model_fallbacks) - 1:
                        print(f"  └─ ⚠️  Model {fallback_model} timeout, trying fallback...")
                        continue

                    else:
                        raise
            
            if ai_response is None:
                raise last_error if last_error else Exception("Failed to get response from any model")
            
            # Persist turn in memory.
            self.chat_history.add_user_message(message)
            self.chat_history.add_ai_message(ai_response)

            metadata = {
                "case_id": self.case_id,
                "user_id": self.user_id,
                "history_length": len(self.chat_history.messages),
                "success": True
            }
            
            return {
                "reply": ai_response,
                "metadata": metadata
            }
            
        except Exception as e:
            print(f"[VPService] Error in chat: {e}")
            import traceback
            traceback.print_exc()
            
            return {
                "reply": "Xin lỗi, đã xảy ra lỗi khi xử lý tin nhắn của bạn.",
                "metadata": {
                    "case_id": self.case_id,
                    "user_id": self.user_id,
                    "success": False,
                    "error": str(e)
                }
            }
        finally:
            # Prompt enhancement is per query.
            if 'original_system_prompt' in locals():
                self.system_prompt = original_system_prompt

    def get_history(self) -> List:
        """Return raw LangChain message objects."""
        return self.chat_history.messages
    
    def get_serializable_history(self) -> List[Dict[str, Any]]:
        """Return chat history as JSON-serializable dicts for frontend."""
        history = []
        for msg in self.chat_history.messages:
            if isinstance(msg, HumanMessage):
                role = 'user'
            elif isinstance(msg, AIMessage):
                role = 'model'
            else:
                continue
            
            history.append({
                'role': role,
                'parts': [{'text': msg.content}]
            })
        
        return history
    
    def clear_history(self):
        """Clear conversation history for current session."""
        self.chat_history.clear()
        print(f"[VPService] History cleared for {self.case_id}/{self.user_id}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Return basic stats for current session."""
        messages = self.get_history()
        return {
            "case_id": self.case_id,
            "user_id": self.user_id,
            "message_count": len(messages),
            "has_history": len(messages) > 0,
            "current_model": self.current_model,  # Show which model is being used
            "available_fallbacks": len(self.model_fallbacks)
        }
    
    def __repr__(self) -> str:
        """Debug-friendly service summary."""
        return f"VirtualPatientService(case={self.case_id}, user={self.user_id}, messages={len(self.chat_history.messages)})"
