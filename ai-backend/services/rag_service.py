"""RAG retrieval service for medical case sections.

Flow:
1. Split case text into known section headers.
2. Score section relevance to the query (embedding or keyword fallback).
3. Return matching sections above threshold.
4. If nothing matches, return all sections as a safety fallback.
"""

import os
import re
import logging
import hashlib
from typing import Dict, List, Tuple, Optional
import numpy as np
from functools import lru_cache

# Try importing Google Generative AI for embeddings
try:
    import google.generativeai as genai
    HAS_GOOGLE_API = True
except ImportError:
    HAS_GOOGLE_API = False

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class RAGService:
    """Retrieve relevant case sections for a user query."""
    
    # Medical safety: ALWAYS include these sections regardless of similarity
    CRITICAL_SECTIONS = ["Chẩn đoán", "Tiên lượng", "Điều trị", 
                         "Diagnosis", "Prognosis", "Treatment"]
    
    # Define 10 semantic section patterns for medical case knowledge
    SEMANTIC_SECTIONS = [
        "Bối cảnh",           # Background
        "Lý do vào viện",     # Chief Complaint / Reason for visit
        "Bệnh sử",            # History of Present Illness
        "Tiền căn",           # Past Medical History
        "Lược qua các cơ quan",  # System Review
        "Khám lâm sàng",      # Physical Examination
        "Kết quả xét nghiệm", # Laboratory Results
        "Chẩn đoán",          # Diagnosis (CRITICAL)
        "Tiên lượng",         # Prognosis (CRITICAL)
        "Điều trị"            # Treatment (CRITICAL)
    ]
    
    def __init__(self, use_embeddings: bool = True):
        """
        Initialize RAG Service
        
        Args:
            use_embeddings: Use Google Embeddings API (True) or simple keyword-based (False)
        """
        self.use_embeddings = use_embeddings and HAS_GOOGLE_API
        self.embedding_model = None
        
        if self.use_embeddings:
            # Initialize Google Generative AI for embeddings
            api_key = os.getenv('GOOGLE_API_KEY')
            if api_key:
                genai.configure(api_key=api_key)
                self.embedding_model = self._resolve_embedding_model()
                logger.info("✓ RAG Service initialized with Google Embeddings")
            else:
                logger.warning("⚠ GOOGLE_API_KEY not found, falling back to keyword-based retrieval")
                self.use_embeddings = False
        else:
            logger.info("✓ RAG Service initialized with keyword-based retrieval")

        # Cache preprocessed sections and embeddings by case fingerprint.
        # Key is sha1(case_knowledge) to avoid recomputing section embeddings every turn.
        self._section_cache: Dict[str, List[Dict]] = {}

    def _resolve_embedding_model(self) -> Optional[str]:
        """Pick the best available embedding model for current API key/project."""
        preferred_models = [
            "models/gemini-embedding-001",
            "models/gemini-embedding-2-preview",
        ]

        try:
            models = list(genai.list_models())
            available = set()

            for model in models:
                methods = getattr(model, "supported_generation_methods", []) or []
                if "embedContent" in methods:
                    available.add(model.name)

            for candidate in preferred_models:
                if candidate in available:
                    logger.info(f"✓ Using embedding model: {candidate}")
                    return candidate

            if available:
                fallback = sorted(available)[0]
                logger.warning(f"⚠ No preferred embedding model found. Using: {fallback}")
                return fallback

            logger.warning("⚠ No embedding models available for this API key. Falling back to keyword retrieval")
            self.use_embeddings = False
            return None
        except Exception as e:
            logger.warning(f"⚠ Could not list embedding models ({e}). Falling back to keyword retrieval")
            self.use_embeddings = False
            return None
    
    def split_case_into_sections(self, case_knowledge: str) -> Dict[str, str]:
        """Split case text into known sections using header matching."""
        sections = {}
        
        # Find all section headers and their positions
        section_positions = []
        for section_name in self.SEMANTIC_SECTIONS:
            # Case-insensitive search for section headers (e.g., "Bệnh sử:", "Bệnh sử -", "BỆNH SỬ:")
            pattern = rf"{section_name}\s*[:─\-–]?"
            matches = list(re.finditer(pattern, case_knowledge, re.IGNORECASE))
            for match in matches:
                section_positions.append((match.start(), section_name, match.end()))
        
        # Sort by position
        section_positions.sort(key=lambda x: x[0])
        
        # Extract content for each section
        for i, (start_pos, section_name, header_end) in enumerate(section_positions):
            # Find end position (start of next section or end of string)
            if i + 1 < len(section_positions):
                end_pos = section_positions[i + 1][0]
            else:
                end_pos = len(case_knowledge)
            
            # Extract content (skip the header, trim whitespace)
            content = case_knowledge[header_end:end_pos].strip()
            
            # Normalize section name (handle case variations)
            normalized_name = self._normalize_section_name(section_name)
            
            if content:  # Only add non-empty sections
                sections[normalized_name] = content
        
        logger.debug(f"Split case into {len(sections)} sections: {list(sections.keys())}")
        return sections
    
    def _normalize_section_name(self, name: str) -> str:
        """Map Vietnamese section headers to stable internal names."""
        name_lower = name.lower().strip()
        
        # Map variations to standard names
        mapping = {
            "bối cảnh": "Background",
            "lý do vào viện": "Chief Complaint",
            "bệnh sử": "History",
            "tiền căn": "Past Medical History",
            "lược qua các cơ quan": "System Review",
            "khám lâm sàng": "Physical Examination",
            "kết quả xét nghiệm": "Laboratory Results",
            "chẩn đoán": "Diagnosis",
            "tiên lượng": "Prognosis",
            "điều trị": "Treatment",
        }
        
        return mapping.get(name_lower, name)
    
    def _embed_text(self, text: str) -> Optional[List[float]]:
        """Return embedding vector for text, or None on failure."""
        if not self.use_embeddings:
            return None
        
        if not self.embedding_model:
            return None

        try:
            result = genai.embed_content(
                model=self.embedding_model,
                content=text,
                task_type="SEMANTIC_SIMILARITY"
            )
            return result['embedding']
        except Exception as e:
            logger.warning(f"Embedding failed with {self.embedding_model}: {e}")
            return None

    def _build_case_cache_key(self, case_knowledge: str) -> str:
        """Return stable cache key for case content."""
        return hashlib.sha1(case_knowledge.encode("utf-8")).hexdigest()

    def prepare_case_sections(self, case_knowledge: str) -> None:
        """Precompute and cache section embeddings for one case."""
        cache_key = self._build_case_cache_key(case_knowledge)
        if cache_key in self._section_cache:
            return

        sections = self.split_case_into_sections(case_knowledge)
        if not sections:
            self._section_cache[cache_key] = []
            return

        prepared_sections = []
        for section_name, section_content in sections.items():
            is_critical = any(
                critical in section_name for critical in ["Diagnosis", "Prognosis", "Treatment"]
            )

            section_embedding = self._embed_text(section_content) if self.use_embeddings else None

            prepared_sections.append({
                "name": section_name,
                "content": section_content,
                "is_critical": is_critical,
                "embedding": section_embedding,
            })

        self._section_cache[cache_key] = prepared_sections
        logger.info(f"🧠 Cached embeddings for {len(prepared_sections)} sections")
    
    def _cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Compute cosine similarity in range [0, 1]."""
        if not vec1 or not vec2:
            return 0.0
        
        arr1 = np.array(vec1)
        arr2 = np.array(vec2)
        
        dot_product = np.dot(arr1, arr2)

        norm1 = np.linalg.norm(arr1)
        norm2 = np.linalg.norm(arr2)

        if norm1 == 0 or norm2 == 0:
            return 0.0

        return float(dot_product / (norm1 * norm2))
    
    def _keyword_similarity(self, query: str, text: str) -> float:
        """Fallback similarity using Jaccard overlap on filtered tokens."""

        query_words = set(query.lower().split())
        text_words = set(text.lower().split())

        stopwords = {"là", "của", "và", "với", "có", "cóm", "để", "từ", "đó", "như", "được", "trong", "này", "nào", "nên", "không", "bị", "những", "lại", "cùng", "hay", "nhưng", "thì", "hoặc", "cả", "vì"}

        query_words -= stopwords
        text_words -= stopwords

        if not query_words or not text_words:
            return 0.0
        
        intersection = len(query_words & text_words)
        union = len(query_words | text_words)
        
        return intersection / union if union > 0 else 0.0
    
    def retrieve_smart_sections(
        self,
        case_knowledge: str,
        query: str,
        threshold: float = 0.7,
        top_k: int = 4
    ) -> str:
        """Return relevant sections for query; fallback to all if no match."""

        cache_key = self._build_case_cache_key(case_knowledge)
        self.prepare_case_sections(case_knowledge)
        prepared_sections = self._section_cache.get(cache_key, [])

        if not prepared_sections:
            logger.warning("No sections found, returning original case knowledge")
            return case_knowledge
        
        logger.info(f"📋 Split case into {len(prepared_sections)} sections")
        logger.info(f"🧮 RAG params: threshold={threshold:.2f}, top_k={max(1, top_k)}")
        
        query_embedding = self._embed_text(query) if self.use_embeddings else None

        section_scores = []

        for section in prepared_sections:
            section_name = section["name"]
            section_content = section["content"]
            section_embedding = section.get("embedding")

            if query_embedding:
                if section_embedding:
                    similarity = self._cosine_similarity(query_embedding, section_embedding)
                else:
                    # Fallback to keyword score when section embedding is unavailable.
                    similarity = self._keyword_similarity(query, section_content)
            else:
                similarity = self._keyword_similarity(query, section_content)
            
            section_scores.append({
                'name': section_name,
                'content': section_content,
                'similarity': similarity,
                'is_critical': section["is_critical"]
            })
            
            logger.debug(
                f"  {section_name}: {similarity:.3f} "
                f"{'[CRITICAL]' if section['is_critical'] else ''}"
            )

        # Emit one-line scoreboard for easier debugging in INFO logs.
        score_board = ", ".join(
            [f"{item['name']}={item['similarity']:.3f}" for item in sorted(section_scores, key=lambda x: x['similarity'], reverse=True)]
        )
        logger.info(f"📈 Section scores: {score_board}")
        
        # Select by threshold, then cap by top_k.
        sorted_by_similarity = sorted(section_scores, key=lambda x: x['similarity'], reverse=True)

        selected = [s for s in sorted_by_similarity if s['similarity'] > threshold]

        selection_mode = "threshold"
        if selected:
            selected = selected[:max(1, top_k)]

        if not selected:
            selection_mode = "fallback_topk"
            logger.warning(f"⚠️  Query '{query[:50]}...' has no matches above threshold ({threshold})")
            logger.warning(f"   Fallback: Using top {max(1, top_k)} sections by similarity")
            selected = sorted_by_similarity[:max(1, top_k)]

        logger.info(f"✅ Selected {len(selected)}/{len(section_scores)} sections for query: {query[:50]}...")
        selected_board = ", ".join([f"{item['name']}={item['similarity']:.3f}" for item in selected])
        logger.info(f"🎯 Selection mode={selection_mode}; selected: {selected_board}")
        for i, section in enumerate(selected, 1):
            match_status = "✓ Match" if section['similarity'] > threshold else "⚠ Fallback"
            logger.debug(f"   {i}. {section['name']}: {section['similarity']:.3f} ({match_status})")

        result = self._format_sections(selected)

        token_estimate = len(result.split()) * 1.3  # Rough estimate
        logger.info(f"📊 Retrieved context: ~{token_estimate:.0f} tokens")
        
        return result
    
    def _format_sections(self, sections: List[Dict]) -> str:
        """Format selected sections as plain text context."""
        result = []
        
        for section in sections:
            result.append(f"{section['name']}:")
            result.append(section['content'])
            result.append("")  # Blank line between sections
        
        return "\n".join(result)
    
    def estimate_tokens(self, text: str) -> int:
        """Approximate token count for logs and diagnostics."""
        words = len(text.split())
        return int(words * 1.3)  # Rough estimate


# ============================================================================
# TESTING & DEMONSTRATION
# ============================================================================

if __name__ == "__main__":
    """Simple test of RAG functionality"""
    
    # Example case knowledge
    test_case = """
    Bối cảnh: Bệnh nhân Lê Văn Cường, 63 tuổi, nam, hưu trí.
    
    Lý do vào viện: Đau ngực trái dữ dội lan lên cổ và tay trái.
    
    Bệnh sử: Đau thắt ngực xuất hiện khi đang nghỉ, không gắng sức. Đau kéo dài hơn 30 phút, không giảm khi nghỉ ngơi.
    
    Tiền căn: Tăng huyết áp 10 năm, đái tháo đường type 2, hút thuốc lá 20 gói/năm.
    
    Khám lâm sàng: Huyết áp 150/90, mạch 110/phút, nhịp thở 22/phút, da lạnh ẩm.
    
    Chẩn đoán: Nhồi máu cơ tim cấp tính.
    
    Tiên lượng: Có nguy cơ hình sự cộng hưởng cao, cần theo dõi liên tục.
    
    Điều trị: Aspirin, Clopidogrel, Statin, ACE inhibitor. Xem xét can thiệp tim mạch.
    """
    
    # Initialize RAG service
    rag = RAGService(use_embeddings=False)  # Use keyword-based for testing
    
    # Test query 1
    print("\n" + "="*60)
    print("TEST 1: Query about diagnosis")
    print("="*60)
    query1 = "Bệnh nhân bị chẩn đoán là gì?"
    result1 = rag.retrieve_smart_sections(test_case, query1, threshold=0.5)
    print(f"Query: {query1}")
    print(f"Result:\n{result1}")
    print(f"Tokens: ~{rag.estimate_tokens(result1)}")
    
    # Test query 2
    print("\n" + "="*60)
    print("TEST 2: Query about treatment")
    print("="*60)
    query2 = "Điều trị như thế nào?"
    result2 = rag.retrieve_smart_sections(test_case, query2)
    print(f"Query: {query2}")
    print(f"Result:\n{result2}")
    print(f"Tokens: ~{rag.estimate_tokens(result2)}")
    
    # Test query 3
    print("\n" + "="*60)
    print("TEST 3: Query about patient history")
    print("="*60)
    query3 = "Bệnh nhân có tiền sử gì?"
    result3 = rag.retrieve_smart_sections(test_case, query3)
    print(f"Query: {query3}")
    print(f"Result:\n{result3}")
    print(f"Tokens: ~{rag.estimate_tokens(result3)}")
