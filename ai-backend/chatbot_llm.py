"""
Virtual Patient Chatbot - Flask Backend API
Phase 1: LangChain Integration + Auto-Fallback System

OVERVIEW:
=========
RESTful API for virtual patient conversations with:
- Session management (RAM-based caching)
- Multi-case support (9 medical scenarios)
- Auto-fallback model switching
- Production-grade error handling

ENDPOINTS:
==========
POST   /chat   - Main conversation endpoint
POST   /clear  - Clear conversation history
GET    /stats  - Get active session statistics
GET    /       - Health check

ARCHITECTURE:
============
Flask API → VirtualPatientService → Gemini API (with fallback)
     ↓              ↓                       ↓
  REST API    LangChain Memory      Auto-fallback models

Author: AI Assistant
Date: March 2026
"""

import os
import time
import base64
import json
import logging
from dotenv import load_dotenv
from flask import Flask, request, jsonify, g
from flask_cors import CORS
from services import VirtualPatientService, GoogleCloudTTS, GoogleCloudSTT

# ============================================================================
# SECTION 1: APPLICATION SETUP & CONFIGURATION
# ============================================================================

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Reduce default Flask access log noise (full query strings can be huge).
logging.getLogger("werkzeug").setLevel(logging.WARNING)


def _compact(value, max_len: int = 48) -> str:
    """Return compact printable value for logs."""
    text = str(value) if value is not None else "-"
    return text if len(text) <= max_len else f"{text[:max_len]}..."


def _build_request_log_context() -> str:
    """Build concise request context without dumping full payloads."""
    ctx = []
    method = request.method
    path = request.path

    # JSON-style endpoints
    if method in {"POST", "PUT", "PATCH"} and path in {"/chat", "/tts", "/clear"}:
        data = request.get_json(silent=True) or {}
        if "case_id" in data:
            ctx.append(f"case={_compact(data.get('case_id'))}")
        if "user_id" in data:
            ctx.append(f"user={_compact(data.get('user_id'))}")
        if "case_payload" in data:
            payload_size = len(json.dumps(data.get("case_payload"), ensure_ascii=False))
            ctx.append(f"payload=yes({payload_size} chars)")
        if "message" in data:
            ctx.append(f"msg_len={len(str(data.get('message') or ''))}")
        if "text" in data and path == "/tts":
            ctx.append(f"text_len={len(str(data.get('text') or ''))}")

    # Query-style session endpoint
    if method == "GET" and path == "/session":
        case_id = request.args.get("case_id")
        user_id = request.args.get("user_id")
        payload_raw = request.args.get("case_payload")
        if case_id:
            ctx.append(f"case={_compact(case_id)}")
        if user_id:
            ctx.append(f"user={_compact(user_id)}")
        if payload_raw:
            ctx.append(f"payload=yes({len(payload_raw)} chars)")

    # Multipart voice endpoints
    if path in {"/stt", "/chat-voice"}:
        content_length = request.content_length or 0
        ctx.append(f"bytes={content_length}")
        if path == "/chat-voice":
            case_id = request.form.get("case_id")
            user_id = request.form.get("user_id")
            if case_id:
                ctx.append(f"case={_compact(case_id)}")
            if user_id:
                ctx.append(f"user={_compact(user_id)}")

    return " ".join(ctx)


@app.before_request
def log_request_start():
    """Capture request start time for concise latency logging."""
    g._req_started_at = time.perf_counter()


@app.after_request
def log_request_end(response):
    """Emit one concise request summary line."""
    started = getattr(g, "_req_started_at", None)
    duration_ms = (time.perf_counter() - started) * 1000 if started else 0.0
    context = _build_request_log_context()
    suffix = f" {context}" if context else ""
    print(
        f"[REQ] {request.method} {request.path} status={response.status_code} "
        f"dur={duration_ms:.1f}ms{suffix}"
    )
    return response

# Load environment variables
load_dotenv()
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def configure_google_credentials() -> str:
    """Resolve and export GOOGLE_APPLICATION_CREDENTIALS for Google Cloud clients."""
    credentials_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")

    if credentials_path and not os.path.isabs(credentials_path):
        credentials_path = os.path.abspath(os.path.join(BASE_DIR, credentials_path))

    if not credentials_path:
        default_path = os.path.join(BASE_DIR, "google-credentials.json")
        if os.path.exists(default_path):
            credentials_path = default_path

    if credentials_path and os.path.exists(credentials_path):
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = credentials_path
        return credentials_path

    return ""


GOOGLE_CREDENTIALS_PATH = configure_google_credentials()
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')

# ============================================================================
# SECTION 2: GLOBAL STATE (RAM-BASED SESSION CACHE)
# ============================================================================

# RAM Cache: Store active VirtualPatientService instances
# Key format: "{user_id}_{case_id}"
# Purpose: Persist conversation history across multiple requests
# Lifecycle: Lives until server restart
_services = {}

# Voice services are initialized lazily to keep startup resilient.
_tts_service = None
_stt_service = None

# ============================================================================
# SECTION 3: CASE CONFIGURATION (9 MEDICAL SCENARIOS)
# ============================================================================

def _normalize_case_payload(case_payload):
    """Normalize payload shape to a single case object."""
    if isinstance(case_payload, list):
        return case_payload[0] if case_payload else {}
    return case_payload or {}


def _extract_case_identifier(case_id, case_payload) -> str:
    """Resolve stable case identifier from payload with explicit fallbacks."""
    if case_id:
        return str(case_id)

    obj = _normalize_case_payload(case_payload)
    raw_id = obj.get("_id")
    if isinstance(raw_id, dict) and "$oid" in raw_id:
        raw_id = raw_id.get("$oid")

    for candidate in [
        raw_id,
        obj.get("id"),
        obj.get("rag_case_id"),
        obj.get("python_case_id"),
        obj.get("case_id"),
        obj.get("slug"),
        obj.get("title"),
    ]:
        if candidate:
            return str(candidate)

    return "unknown_case"

WELCOME_MESSAGE = "Chào bác sĩ, tôi là bệnh nhân ảo. Xin hãy bắt đầu hỏi bệnh."

# ============================================================================
# SECTION 4: HELPER FUNCTIONS
# ============================================================================

def _compute_payload_signature(case_payload) -> str:
    """Compute stable hash for one case payload."""
    if not case_payload:
        return ""
    obj = _normalize_case_payload(case_payload)
    text = json.dumps(obj or {}, ensure_ascii=False, sort_keys=True)
    import hashlib
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def get_or_create_service(user_id: str, case_id: str, case_payload=None) -> VirtualPatientService:
    """
    Get existing service from cache or create new one
    
    PURPOSE:
    --------
    Implements RAM-based session management to persist conversation history.
    Each user+case combination gets its own service instance.
    
    CACHING STRATEGY:
    -----------------
    - Key: "{user_id}_{case_id}"
    - Cache hit: Reuse existing service (preserves conversation history)
    - Cache miss: Create new service (starts fresh conversation)
    
    Args:
        user_id: User identifier (e.g., "student123")
        case_id: Medical case identifier (e.g., "case_than_noi_tiet")
        
    Returns:
        VirtualPatientService instance with conversation history
        
    Example:
        >>> service = get_or_create_service("student123", "case_than_noi_tiet")
        >>> service.chat("Chào bạn")  # Continues existing conversation
    """
    key = f"{user_id}_{case_id}"
    
    if key not in _services:
        print(f"[Cache] Creating new service for {key}")
        _services[key] = VirtualPatientService(case_id=case_id, user_id=user_id, case_payload=case_payload)
    else:
        service = _services[key]

        # Upgrade existing Python-backed service to Mongo JSON source when payload appears.
        if case_payload:
            incoming_signature = _compute_payload_signature(case_payload)
            existing_signature = getattr(service, "case_payload_signature", None)
            if service.case_source != "mongo_json" or incoming_signature != existing_signature:
                print(f"[Cache] Replacing service for {key} with Mongo JSON source")
                _services[key] = VirtualPatientService(case_id=case_id, user_id=user_id, case_payload=case_payload)
            else:
                print(f"[Cache] Reusing existing Mongo JSON service for {key}")
        else:
            print(f"[Cache] Reusing existing service for {key}")

    # Seed a persistent welcome message into backend history if this session is empty.
    service = _services[key]
    if len(service.chat_history.messages) == 0:
        service.chat_history.add_ai_message(WELCOME_MESSAGE)
    
    return service


def get_tts_service() -> GoogleCloudTTS:
    """Lazily initialize and cache Text-to-Speech service."""
    global _tts_service
    if _tts_service is None:
        _tts_service = GoogleCloudTTS()
    return _tts_service


def get_stt_service() -> GoogleCloudSTT:
    """Lazily initialize and cache Speech-to-Text service."""
    global _stt_service
    if _stt_service is None:
        _stt_service = GoogleCloudSTT()
    return _stt_service

# ============================================================================
# SECTION 5: API ENDPOINTS
# ============================================================================

@app.route("/chat", methods=["POST"])
def handle_chat():
    """
    Main conversation endpoint with auto-fallback support
    
    REQUEST FORMAT:
    ---------------
    POST /chat
    {
        "message": "Chào bạn",
        "case_id": "case_than_noi_tiet",
        "user_id": "student123"  // optional, defaults to "default"
    }
    
    RESPONSE FORMAT:
    ----------------
    {
        "reply": "Dạ chào anh/chị...",
        "history": [
            {"role": "user", "parts": [{"text": "Chào bạn"}]},
            {"role": "model", "parts": [{"text": "Dạ chào anh/chị..."}]}
        ],
        "metadata": {
            "case_id": "case_than_noi_tiet",
            "user_id": "student123",
            "history_length": 2,
            "success": true
        },
        "stats": {
            "message_count": 2,
            "current_model": "models/gemini-2.5-flash",
            "available_fallbacks": 3
        }
    }
    
    ERROR HANDLING:
    ---------------
    - Auto-fallback if primary model fails (quota/timeout)
    - Returns user-friendly error messages
    - Logs detailed errors for debugging
    """
    print("\n--- [Chat] Request received ---")
    
    try:
        data = request.json
        user_message = data.get("message")
        case_id = data.get("case_id")
        user_id = data.get("user_id", "default")  # Default user if not provided
        case_payload = data.get("case_payload")
        
        # Validate required fields
        if not user_message:
            print("❌ [Error] Missing 'message' field")
            return jsonify({"error": "Missing 'message' field"}), 400
        
        if not case_payload:
            print("❌ [Error] Missing 'case_payload' field (JSON-only mode)")
            return jsonify({"error": "Missing 'case_payload' field (JSON-only mode)"}), 400

        case_id = _extract_case_identifier(case_id, case_payload)
        
        # Get or create service (RAM cache)
        service = get_or_create_service(user_id, case_id, case_payload=case_payload)
        
        # Get AI response
        result = service.chat(user_message)
        
        # Prepare response compatible with frontend
        # Frontend needs history to render chat messages
        response_data = {
            "reply": result["reply"],
            "history": service.get_serializable_history(),  # Convert LangChain → Frontend format
            "metadata": result["metadata"],
            "stats": service.get_stats()
        }
        
        print(f"[Chat] Success - History: {result['metadata'].get('history_length')} messages\n")
        
        return jsonify(response_data)
        
    except Exception as e:
        print(f"❌ Error in /chat: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({
            "error": "Internal server error",
            "details": str(e)
        }), 500


@app.route("/tts", methods=["POST"])
def handle_tts():
    """
    Text-to-speech endpoint.

    REQUEST FORMAT:
    ---------------
    POST /tts
    {
        "text": "Xin chao, toi la benh nhan ao",
        "voice": "vi-VN-Wavenet-A"  // optional
    }

    RESPONSE FORMAT:
    ----------------
    {
        "audio_base64": "...",
        "voice": "vi-VN-Wavenet-A"
    }
    """
    try:
        data = request.json or {}
        text = data.get("text", "")
        voice = data.get("voice")

        if not text.strip():
            return jsonify({"error": "Missing or empty 'text' field"}), 400

        tts = get_tts_service()
        audio_bytes = tts.text_to_speech(text=text, voice_name=voice)

        return jsonify({
            "audio_base64": base64.b64encode(audio_bytes).decode("utf-8"),
            "voice": voice or tts.voice_name,
            "text": text,
        })
    except Exception as e:
        print(f"❌ Error in /tts: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/chat-voice", methods=["POST"])
def handle_chat_voice():
    """
    Voice conversation endpoint: STT -> Chat -> TTS.

    REQUEST FORMAT:
    ---------------
    multipart/form-data
    - audio: file (required)
    - case_id: string (required)
    - user_id: string (optional, default="default")
    - voice: string (optional, e.g. vi-VN-Wavenet-A)

    RESPONSE FORMAT:
    ----------------
    {
        "transcript": "Bac si hoi...",
        "reply": "Toi thay met...",
        "audio_base64": "...",
        "metadata": {...},
        "stats": {...}
    }
    """
    try:
        audio_file = request.files.get("audio")
        case_id = request.form.get("case_id")
        user_id = request.form.get("user_id", "default")
        voice = request.form.get("voice")
        case_payload_raw = request.form.get("case_payload")

        if audio_file is None:
            return jsonify({"error": "Missing 'audio' file"}), 400
        if not case_payload_raw:
            return jsonify({"error": "Missing 'case_payload' field (JSON-only mode)"}), 400
        try:
            case_payload = json.loads(case_payload_raw)
        except Exception:
            return jsonify({"error": "Invalid 'case_payload' JSON"}), 400

        case_id = _extract_case_identifier(case_id, case_payload)

        audio_bytes = audio_file.read()
        mime_type = audio_file.mimetype or "audio/webm"

        # Step 1: Speech-to-Text
        stt = get_stt_service()
        transcript = stt.speech_to_text(audio_bytes=audio_bytes, mime_type=mime_type)

        # Step 2: Existing chat pipeline
        service = get_or_create_service(user_id, case_id, case_payload=case_payload)
        result = service.chat(transcript)
        reply_text = result["reply"]

        # Step 3: Text-to-Speech
        tts = get_tts_service()
        reply_audio = tts.text_to_speech(text=reply_text, voice_name=voice)

        return jsonify({
            "transcript": transcript,
            "reply": reply_text,
            "audio_base64": base64.b64encode(reply_audio).decode("utf-8"),
            "history": service.get_serializable_history(),
            "metadata": result["metadata"],
            "stats": service.get_stats(),
        })
    except Exception as e:
        print(f"❌ Error in /chat-voice: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


@app.route("/stt", methods=["POST"])
def handle_stt():
    """
    Speech-to-text only endpoint.

    REQUEST FORMAT:
    ---------------
    multipart/form-data
    - audio: file (required)

    RESPONSE FORMAT:
    ----------------
    {
        "transcript": "..."
    }
    """
    try:
        audio_file = request.files.get("audio")
        if audio_file is None:
            return jsonify({"error": "Missing 'audio' file"}), 400

        audio_bytes = audio_file.read()
        mime_type = audio_file.mimetype or "audio/webm"

        stt = get_stt_service()
        transcript = stt.speech_to_text(audio_bytes=audio_bytes, mime_type=mime_type)

        return jsonify({
            "transcript": transcript,
            "mime_type": mime_type,
        })
    except Exception as e:
        print(f"❌ Error in /stt: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/clear", methods=["POST"])
def handle_clear():
    """
    Clear conversation history for a user/case
    """
    try:
        data = request.json
        case_id = data.get("case_id")
        user_id = data.get("user_id", "default")
        
        key = f"{user_id}_{case_id}"
        
        if key in _services:
            del _services[key]
            return jsonify({"message": "Session cleared", "key": key, "removed": True})
        else:
            return jsonify({"message": "No active session found", "key": key, "removed": False})
            
    except Exception as e:
        print(f"❌ Error in /clear: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/session", methods=["GET"])
def handle_session():
    """
    Get existing conversation session for a user/case.

    Query params:
    - case_id (required)
    - user_id (optional, default="default")
    """
    try:
        case_id = request.args.get("case_id")
        user_id = request.args.get("user_id", "default")
        case_payload_raw = request.args.get("case_payload")

        if not case_payload_raw:
            return jsonify({"error": "Missing 'case_payload' query param (JSON-only mode)"}), 400
        try:
            case_payload = json.loads(case_payload_raw)
        except Exception:
            return jsonify({"error": "Invalid 'case_payload' JSON in query param"}), 400

        case_id = _extract_case_identifier(case_id, case_payload)

        key = f"{user_id}_{case_id}"
        existed_before = key in _services and len(_services[key].chat_history.messages) > 0

        # Always return backend-backed history (including welcome message for new sessions).
        service = get_or_create_service(user_id, case_id, case_payload=case_payload)
        history = service.get_serializable_history()
        return jsonify({
            "exists": existed_before,
            "history": history,
            "metadata": {
                "case_id": case_id,
                "user_id": user_id,
                "history_length": len(history),
            },
            "stats": service.get_stats(),
        })

    except Exception as e:
        print(f"❌ Error in /session: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/stats", methods=["GET"])
def handle_stats():
    """
    Get statistics about active sessions
    """
    try:
        stats = {
            "active_sessions": len(_services),
            "sessions": []
        }
        
        for key, service in _services.items():
            stats["sessions"].append({
                "key": key,
                "stats": service.get_stats()
            })
        
        return jsonify(stats)
        
    except Exception as e:
        print(f"❌ Error in /stats: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def handle_health():
    """
    Health check endpoint
    """
    return jsonify({
        "status": "healthy",
        "phase": "1 - LangChain Integration",
        "active_sessions": len(_services)
    })



if __name__ == "__main__":
    port = int(os.getenv("PORT", "5000"))
    primary_model = VirtualPatientService.MODEL_FALLBACKS[0]
    fallback_models = ",".join(VirtualPatientService.MODEL_FALLBACKS[1:])
    credentials_state = "loaded" if GOOGLE_CREDENTIALS_PATH else "missing"
    api_key_state = "loaded" if GOOGLE_API_KEY else "missing"

    print("[BOOT] VirtualPatient backend")
    print(f"[BOOT] server=http://localhost:{port} debug=false")
    print(f"[BOOT] google_credentials={credentials_state} path={GOOGLE_CREDENTIALS_PATH or '-'}")
    print(f"[BOOT] google_api_key={api_key_state}")
    print(f"[BOOT] llm_primary={primary_model} fallbacks={fallback_models}")
    print("[BOOT] data_source_mode=mongo_json_only")

    if not GOOGLE_CREDENTIALS_PATH:
        print("[BOOT] warning=GOOGLE_APPLICATION_CREDENTIALS missing; STT/TTS may fail")
    if not GOOGLE_API_KEY:
        print("[BOOT] warning=GOOGLE_API_KEY missing; chat model calls will fail")

    app.run(port=port, debug=False)
