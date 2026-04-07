import React, { useEffect, useMemo, useRef, useState } from "react";
import "./AiPatientInteractionTab.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_USER_ID = "default";

function getCaseApiBase() {
  const fromEnv = (import.meta.env.VITE_CASE_API_BASE_URL || "").trim();
  return (fromEnv || "http://localhost:5000/api").replace(/\/$/, "");
}

function getAiApiBase() {
  const fromEnv = (import.meta.env.VITE_AI_API_BASE_URL || "").trim();
  return (fromEnv || "http://127.0.0.1:5001").replace(/\/$/, "");
}

const CASE_API_BASE = getCaseApiBase();
const AI_API_BASE = getAiApiBase();
const CHAT_ENDPOINT = `${AI_API_BASE}/chat`;
const STT_ENDPOINT = `${AI_API_BASE}/stt`;
const TTS_ENDPOINT = `${AI_API_BASE}/tts`;
const SESSION_ENDPOINT = `${AI_API_BASE}/session`;
const FEMALE_VOICE = "vi-VN-Wavenet-A";
const MALE_VOICE = "vi-VN-Wavenet-B";

function normalizeMongoId(idValue) {
  if (!idValue) return "";
  if (typeof idValue === "string") return idValue;
  if (typeof idValue === "object" && idValue.$oid) return String(idValue.$oid);
  return String(idValue);
}

function resolveCaseId(caseData, stationId) {
  return (
    normalizeMongoId(caseData?._id) ||
    String(caseData?.id || "").trim() ||
    String(caseData?.rag_case_id || "").trim() ||
    String(caseData?.python_case_id || "").trim() ||
    String(caseData?.case_id || "").trim() ||
    String(caseData?.slug || "").trim() ||
    String(stationId || "").trim() ||
    "unknown_case"
  );
}

const pad2 = (n) => String(n).padStart(2, "0");

function formatMMSS(totalSeconds) {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${pad2(m)}:${pad2(s)}`;
}

function IconButton({ title, onClick, children, disabled }) {
  return (
    <button
      type="button"
      className="vp-iconBtn"
      title={title}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function Collapsible({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className={`vp-collapsible ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="vp-collapsible__header"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="vp-collapsible__title">{title}</span>
        <span className="vp-collapsible__chev" aria-hidden="true">
          ▾
        </span>
      </button>
      <div className="vp-collapsible__body">{children}</div>
    </section>
  );
}

function MessageBubble({ role, text, time }) {
  const mine = role === "user";
  return (
    <div className={`vp-msg ${mine ? "is-user" : "is-ai"}`}>
      <div className="vp-msg__bubble">
        <div className="vp-msg__text">{text}</div>
        <div className="vp-msg__meta">{time}</div>
      </div>
    </div>
  );
}

function nowHHMM() {
  const d = new Date();
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function detectVoiceFromCase(caseData) {
  const instructionText = Array.isArray(caseData?.candidate_instruction)
    ? caseData.candidate_instruction.join(" ")
    : String(caseData?.candidate_instruction || "");
  const briefDesc = String(caseData?.ai_patient_script_model?.brief_info?.desc || "");
  const source = normalizeText(`${instructionText} ${briefDesc}`);

  if (source.includes(" nu ") || source.startsWith("nu ") || source.endsWith(" nu") || source.includes(" female ")) {
    return FEMALE_VOICE;
  }
  if (source.includes(" nam ") || source.startsWith("nam ") || source.endsWith(" nam") || source.includes(" male ")) {
    return MALE_VOICE;
  }

  return FEMALE_VOICE;
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}

function getCaseKeywordSet(caseData) {
  const script = caseData?.ai_patient_script_model;
  const source = [
    caseData?.title,
    caseData?.candidate_instruction,
    script?.history_of_presenting_complaint,
    script?.past_medical_history,
    script?.family_history,
    script?.social_history,
    script?.diagnosis,
  ]
    .filter(Boolean)
    .map(normalizeText)
    .join(" ");

  return new Set(
    source
      .split(" ")
      .filter((w) => w.length >= 4)
      .slice(0, 140)
  );
}

function getHintScore(text, hints) {
  const matched = hints.filter((hint) => text.includes(hint)).length;
  if (matched === 0) return 0;
  return clamp01(Math.max(0.55, matched / Math.min(4, hints.length)));
}

function getKeywordCoverageScore(userText, keywordSet) {
  if (!keywordSet || keywordSet.size === 0) return 0;
  const keywords = Array.from(keywordSet);
  const matchedCount = keywords.filter((kw) => userText.includes(kw)).length;
  const target = Math.min(10, keywords.length);
  if (target <= 0) return 0;
  const ratio = matchedCount / target;
  if (matchedCount > 0) return clamp01(Math.max(0.35, ratio));
  return 0;
}

function getInteractionScore(userCount) {
  return clamp01(userCount / 6);
}

function hasAnyHint(text, hints) {
  return hints.some((hint) => text.includes(hint));
}

function buildDataGatheringSummary({ userText, aiText, dataHintScore, caseCoverage, userCount }) {
  const covered = [];
  const partiallyCovered = [];
  const missed = [];

  const timelineHints = ["onset", "duration", "started", "when", "bao lau", "khi nao"];
  const historyHints = ["history", "past", "medical", "family", "social", "thuoc", "di ung"];

  if (dataHintScore >= 0.55) covered.push("Đã hỏi các triệu chứng chính và lý do vào khám.");
  else if (dataHintScore > 0) partiallyCovered.push("Có hỏi triệu chứng nhưng chưa đều và chưa sâu.");
  else missed.push("Phần khai thác triệu chứng cốt lõi còn hạn chế.");

  if (hasAnyHint(userText, timelineHints)) covered.push("Đã khai thác diễn tiến thời gian triệu chứng (khởi phát/thời lượng).");
  else if (hasAnyHint(aiText, timelineHints)) partiallyCovered.push("Có tín hiệu về thời gian triệu chứng nhưng chưa được hỏi chủ động.");
  else missed.push("Chưa hỏi rõ diễn tiến thời gian của triệu chứng.");

  if (hasAnyHint(userText, historyHints)) covered.push("Đã khai thác tiền sử liên quan (bệnh, gia đình, xã hội, thuốc).");
  else if (hasAnyHint(aiText, historyHints)) partiallyCovered.push("Tiền sử có được đề cập gián tiếp nhưng chưa rõ ràng.");
  else missed.push("Mức độ khai thác tiền sử còn ít.");

  if (caseCoverage >= 0.55) covered.push("Nội dung hội thoại bám sát thông tin của ca bệnh.");
  else if (caseCoverage > 0.25) partiallyCovered.push("Đã đề cập một phần thông tin đặc thù của ca bệnh.");
  else missed.push("Mức độ bám thông tin ca bệnh còn thấp.");

  if (userCount >= 5) covered.push("Có đủ câu hỏi follow-up để thu thập dữ liệu.");
  else if (userCount >= 3) partiallyCovered.push("Có follow-up ở mức trung bình.");
  else missed.push("Thời lượng tương tác còn ngắn để khai thác dữ liệu tốt.");

  return {
    covered: covered.slice(0, 5),
    partially_covered: partiallyCovered.slice(0, 4),
    missed: missed.slice(0, 4),
  };
}

function buildRuntimeEvaluation(messages, caseData) {
  const userMessages = messages.filter((m) => m.role === "user").map((m) => m.text || "");
  const aiMessages = messages.filter((m) => m.role === "ai").map((m) => m.text || "");

  const userText = normalizeText(userMessages.join(" \n "));
  const aiText = normalizeText(aiMessages.join(" \n "));
  const keywordSet = getCaseKeywordSet(caseData);

  const dataHints = ["pain", "dau", "onset", "duration", "history", "trieu", "symptom", "fever"];
  const mgmtHints = ["plan", "treatment", "test", "follow", "manage", "thuoc", "xet nghiem", "next"];
  const interHints = ["cam on", "thank", "sorry", "please", "understand", "chia se", "lo lang"];
  const safetyHints = ["emergency", "cap cuu", "quay lai", "worse", "xau di", "return"];

  const caseCoverage = getKeywordCoverageScore(userText, keywordSet);
  const interactionScore = getInteractionScore(userMessages.length);
  const conversationFlow = clamp01(Math.min(userMessages.length, aiMessages.length) / Math.max(1, userMessages.length));

  const dataHintScore = getHintScore(userText, dataHints);
  const mgmtHintScore = getHintScore(userText, mgmtHints);
  const interHintScore = getHintScore(userText, interHints);
  const safetyScore = getHintScore(userText, safetyHints);

  const dataRaw = clamp01(0.45 * dataHintScore + 0.35 * caseCoverage + 0.2 * interactionScore);
  const mgmtCoverage = clamp01(0.8 * caseCoverage + 0.2 * safetyScore);
  const mgmtRaw = clamp01(0.45 * mgmtHintScore + 0.35 * mgmtCoverage + 0.2 * interactionScore);
  const interRaw = clamp01(0.5 * interHintScore + 0.3 * conversationFlow + 0.2 * interactionScore);

  const toTen = (v) => Number((v * 10).toFixed(2));
  const data_gathering = toTen(dataRaw);
  const management = toTen(mgmtRaw);
  const interpersonal = toTen(interRaw);

  const interactionBonus = userMessages.length >= 6 ? 1 : userMessages.length >= 4 ? 0.5 : 0;
  const total = Number(Math.min(30, data_gathering + management + interpersonal + interactionBonus).toFixed(2));
  const score_needed = 16;
  const conclusion = total >= score_needed ? "Pass" : "Fail";

  const dataCoverage = buildDataGatheringSummary({
    userText,
    aiText,
    dataHintScore,
    caseCoverage,
    userCount: userMessages.length,
  });

  const managementCovered = [];
  const managementPartial = [];
  const managementMissed = [];

  if (mgmtHintScore >= 0.55) managementCovered.push("Đã hỏi định hướng kế hoạch/xét nghiệm/điều trị.");
  else if (mgmtHintScore > 0) managementPartial.push("Có đề cập hướng xử trí nhưng chưa rõ.");
  else managementMissed.push("Định hướng xử trí còn mơ hồ.");

  if (safetyScore >= 0.55) managementCovered.push("Đã có dặn dò an toàn cơ bản (safety-net).");
  else if (safetyScore > 0) managementPartial.push("Dặn dò an toàn có nhắc đến nhưng chưa rõ ràng.");
  else managementMissed.push("Chưa có dặn dò an toàn (safety-net).");

  const interpersonalCovered = [];
  const interpersonalPartial = [];
  const interpersonalMissed = [];

  if (interHintScore >= 0.55) interpersonalCovered.push("Cách giao tiếp thể hiện sự đồng cảm và lịch sự.");
  else if (interHintScore > 0) interpersonalPartial.push("Có dấu hiệu đồng cảm ở mức cơ bản.");
  else interpersonalMissed.push("Dấu hiệu đồng cảm còn hạn chế.");

  if (conversationFlow >= 0.6) interpersonalCovered.push("Mạch hội thoại ổn định và nhất quán.");
  else if (conversationFlow >= 0.35) interpersonalPartial.push("Mạch hội thoại tương đối ổn định.");
  else interpersonalMissed.push("Mạch hội thoại còn rời rạc.");

  return {
    quantitative: {
      data_gathering,
      management,
      interpersonal,
      total,
      score_needed,
      conclusion,
    },
    evaluation_results: {
      data_gathering: dataCoverage,
      management: {
        covered: managementCovered.slice(0, 4),
        partially_covered: managementPartial.slice(0, 3),
        missed: managementMissed.slice(0, 3),
      },
      interpersonal: {
        covered: interpersonalCovered.slice(0, 4),
        partially_covered: interpersonalPartial.slice(0, 3),
        missed: interpersonalMissed.slice(0, 3),
      },
    },
    qualitative_feedback: {
      needs_improvement: [
        ...(dataRaw < 0.55 ? ["Nên hỏi bệnh sử và triệu chứng theo cấu trúc rõ hơn để tăng độ bao phủ."] : []),
        ...(mgmtRaw < 0.55 ? ["Nên nêu rõ kế hoạch bước tiếp theo (xét nghiệm, điều trị, theo dõi)."] : []),
        ...(interRaw < 0.55 ? ["Nên dùng thêm câu thể hiện đồng cảm và trấn an người bệnh."] : []),
      ].slice(0, 3),
      good: [
        ...(userMessages.length >= 4 ? ["Duy trì tương tác chủ động với bệnh nhân ảo."] : []),
        ...(dataRaw >= 0.55 ? ["Đã bao quát được các ý quan trọng của ca bệnh ở mức tốt."] : []),
        ...(mgmtRaw >= 0.55 ? ["Đã thể hiện định hướng xử trí thực tế."] : []),
        ...(interRaw >= 0.55 ? ["Giao tiếp rõ ràng và thân thiện với người bệnh."] : []),
      ].slice(0, 3),
    },
  };
}

export default function AiPatientInteractionTab({ stationId, onBack }) {
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [caseLoading, setCaseLoading] = useState(true);
  const [caseError, setCaseError] = useState("");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const scrollRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const micStreamRef = useRef(null);
  const audioChunksRef = useRef([]);
  const playbackAudioRef = useRef(null);

  const [secondsLeft, setSecondsLeft] = useState(8 * 60);
  const [running, setRunning] = useState(false);
  const [diagnosisRevealed, setDiagnosisRevealed] = useState(false);

  const stationTitle = "Virtual patient";
  const stationSubtitle = caseData?.title || "Loading case...";
  const candidateInstruction = caseData?.candidate_instruction || "";
  const patientScript = caseData?.ai_patient_script_model || "";
  const diagnosisText = caseData?.ai_patient_script_model?.diagnosis || "No diagnosis provided";

  const aiCaseId = resolveCaseId(caseData, stationId);
  const selectedVoice = useMemo(() => detectVoiceFromCase(caseData), [caseData]);

  // Keep one persistent session per selected station to avoid cross-case history bleed.
  const sessionUserId = useMemo(() => {
    const sid = String(stationId || "unknown").trim();
    return `${BASE_USER_ID}-${sid}`;
  }, [stationId]);

  const timeLabel = useMemo(() => formatMMSS(secondsLeft), [secondsLeft]);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  useEffect(() => {
    if (!stationId) {
      setCaseError("Missing stationId. Please go back and choose a case again.");
      setCaseLoading(false);
      return;
    }

    const fetchCase = async () => {
      try {
        setCaseLoading(true);
        setCaseError("");

        const res = await fetch(`${CASE_API_BASE}/ai-cases/${encodeURIComponent(stationId)}`, {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setCaseData(json.data);
      } catch (err) {
        console.error("Failed to fetch AI case:", err);
        setCaseError("Failed to load case data. Please try again.");
      } finally {
        setCaseLoading(false);
      }
    };

    fetchCase();
  }, [stationId]);

  useEffect(() => {
    if (!aiCaseId || !caseData) return;

    const loadSession = async () => {
      try {
        const res = await axios.get(SESSION_ENDPOINT, {
          params: {
            case_id: aiCaseId,
            user_id: sessionUserId,
            case_payload: JSON.stringify(caseData),
          },
        });

        const history = Array.isArray(res.data?.history) ? res.data.history : [];
        if (history.length > 0) {
          const mapped = history.map((msg, idx) => ({
            id: `h-${idx}-${Date.now()}`,
            role: msg.role === "user" ? "user" : "ai",
            text: msg?.parts?.[0]?.text || "",
            time: nowHHMM(),
          }));
          setMessages(mapped);
          return;
        }
      } catch (err) {
        console.warn("Session load failed:", err);
      }

      setMessages([
        {
          id: "welcome-1",
          role: "ai",
          text: "Xin chao, toi la benh nhan ao. Ban co the bat dau hoi benh.",
          time: nowHHMM(),
        },
      ]);
    };

    loadSession();
  }, [aiCaseId, caseData, sessionUserId]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  useEffect(() => {
    return () => {
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  async function playCloudTTS(text) {
    if (!voiceEnabled || !text?.trim()) return;

    try {
      if (playbackAudioRef.current) {
        playbackAudioRef.current.pause();
      }

      const response = await axios.post(TTS_ENDPOINT, {
        text,
        voice: selectedVoice,
      });
      const base64 = response.data?.audio_base64;
      if (!base64) return;

      const audio = new Audio(`data:audio/mp3;base64,${base64}`);
      playbackAudioRef.current = audio;
      audio.onplay = () => setIsSpeaking(true);
      audio.onended = () => setIsSpeaking(false);
      audio.onerror = () => setIsSpeaking(false);
      await audio.play();
    } catch (err) {
      console.error("TTS playback failed:", err);
      setIsSpeaking(false);
    }
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || isChatLoading || !aiCaseId) return;

    const userMsg = {
      id: `u-${Date.now()}`,
      role: "user",
      text,
      time: nowHHMM(),
    };

    const historyForAPI = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsChatLoading(true);
    if (!running) setRunning(true);

    try {
      const response = await axios.post(CHAT_ENDPOINT, {
        message: text,
        case_id: aiCaseId,
        user_id: sessionUserId,
        case_payload: caseData,
        history: historyForAPI,
      });

      const history = Array.isArray(response.data?.history) ? response.data.history : [];
      if (history.length > 0) {
        const mapped = history.map((msg, idx) => ({
          id: `r-${idx}-${Date.now()}`,
          role: msg.role === "user" ? "user" : "ai",
          text: msg?.parts?.[0]?.text || "",
          time: nowHHMM(),
        }));
        setMessages(mapped);
      } else if (response.data?.reply) {
        const aiMsg = {
          id: `a-${Date.now()}`,
          role: "ai",
          text: response.data.reply,
          time: nowHHMM(),
        };
        setMessages((prev) => [...prev, aiMsg]);
      }

      if (response.data?.reply) {
        playCloudTTS(response.data.reply);
      }
    } catch (err) {
      console.error("Chat API failed:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: "ai",
          text: "Khong the ket noi backend AI. Vui long kiem tra server Flask.",
          time: nowHHMM(),
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleTranscribeVoiceMessage(audioBlob, mimeType) {
    if (!audioBlob || audioBlob.size === 0) return;
    setIsTranscribing(true);

    try {
      const ext = mimeType.includes("ogg") ? "ogg" : "webm";
      const audioFile = new File([audioBlob], `voice-input.${ext}`, { type: mimeType });
      const formData = new FormData();
      formData.append("audio", audioFile);

      const response = await axios.post(STT_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const transcript = (response.data?.transcript || "").trim();
      if (transcript) {
        setInput((prev) => `${prev} ${transcript}`.trim());
      }
    } catch (err) {
      console.error("STT failed:", err);
    } finally {
      setIsTranscribing(false);
    }
  }

  async function startListening() {
    if (!navigator.mediaDevices || typeof MediaRecorder === "undefined") return;
    if (isSpeaking) return;

    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        setIsListening(false);

        const mimeType = recorder.mimeType || "audio/webm";
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        audioChunksRef.current = [];

        if (micStreamRef.current) {
          micStreamRef.current.getTracks().forEach((track) => track.stop());
          micStreamRef.current = null;
        }

        await handleTranscribeVoiceMessage(audioBlob, mimeType);
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsListening(true);
    } catch (err) {
      console.error("Mic start failed:", err);
      setIsListening(false);
    }
  }

  function stopListening() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
  }

  function resetTimer() {
    setSecondsLeft(8 * 60);
    setRunning(false);
  }

  return (
    <div className="vp-page">
      <div className="vp-shell">
        <main className="vp-main">
          {onBack && (
            <button type="button" className="pillBtn" onClick={onBack}>
              ← Back
            </button>
          )}
          <header className="vp-topbar">
            <div className="vp-title">
              <span className="vp-title__main">{stationTitle}</span>
              <span className="vp-title__sep">|</span>
              <span className="vp-title__sub">{stationSubtitle}</span>
            </div>

            <div className="vp-topbar__icons" aria-label="Chat tools">
              <IconButton title="Language">
                <span aria-hidden="true">🌐</span>
              </IconButton>
              <IconButton
                title={voiceEnabled ? "Voice ON" : "Voice OFF"}
                onClick={() => setVoiceEnabled((v) => !v)}
              >
                <span aria-hidden="true">{voiceEnabled ? "🔈" : "🔇"}</span>
              </IconButton>
            </div>
          </header>

          <section className="vp-chatCard" aria-label="Chat panel">
            <div className="vp-chatCard__messages" ref={scrollRef}>
              {messages.map((m) => (
                <MessageBubble key={m.id} role={m.role} text={m.text} time={m.time} />
              ))}
              {isChatLoading && (
                <MessageBubble role="ai" text="AI dang phan hoi..." time={nowHHMM()} />
              )}
            </div>

            <div className="vp-composer">
              <div className="vp-composer__inputWrap">
                <textarea
                  className="vp-composer__input"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message or use the microphone. You can also use Alt/Option + T for voice input."
                  rows={1}
                />
                <button
                  type="button"
                  className="vp-composer__mic"
                  title={isListening ? "Stop recording" : "Voice input"}
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? "⏹" : "🎤"}
                </button>
              </div>

              <button
                type="button"
                className="vp-composer__send"
                onClick={handleSend}
                disabled={!input.trim() || isChatLoading || isTranscribing}
                title="Send"
              >
                ➤
              </button>
            </div>
          </section>

          <section className="vp-below">
            <Collapsible title="Instructions" defaultOpen={false}>
              {caseLoading ? (
                <p className="vp-muted">Loading instructions...</p>
              ) : caseError ? (
                <p className="vp-muted">{caseError}</p>
              ) : (
                <p className="vp-muted" style={{ whiteSpace: "pre-line" }}>
                  {candidateInstruction || "No candidate instruction provided."}
                </p>
              )}
            </Collapsible>

            <Collapsible title="Scenario script" defaultOpen={false}>
              {caseLoading ? (
                <p className="vp-muted">Loading patient script...</p>
              ) : caseError ? (
                <p className="vp-muted">{caseError}</p>
              ) : typeof patientScript === "string" ? (
                <p className="vp-muted" style={{ whiteSpace: "pre-line" }}>
                  {patientScript || "No patient script provided."}
                </p>
              ) : (
                <pre className="vp-muted" style={{ whiteSpace: "pre-wrap" }}>
                  {JSON.stringify(patientScript, null, 2)}
                </pre>
              )}
            </Collapsible>
          </section>
        </main>

        <aside className="vp-side" aria-label="Sidebar">
          <section className="vp-panel vp-timer">
            <div className="vp-timer__time">{timeLabel}</div>
            <div className="vp-timer__controls">
              <IconButton
                title={running ? "Pause" : "Start"}
                onClick={() => setRunning((v) => !v)}
                disabled={secondsLeft === 0}
              >
                {running ? "⏸" : "▶"}
              </IconButton>
              <IconButton title="Reset" onClick={resetTimer}>
                ↻
              </IconButton>
              <IconButton title="Add 1 min" onClick={() => setSecondsLeft((s) => s + 60)}>
                ＋
              </IconButton>
            </div>
          </section>
          <section className="vp-panel">
            <div className="vp-panel__title">Chuẩn Đoán</div>
            <div className="vp-panel__body">
              {!diagnosisRevealed ? (
                <button
                  type="button"
                  className="vp-btn vp-btn--dark"
                  onClick={() => setDiagnosisRevealed(true)}
                >
                  Hiện Chuẩn Đoán
                </button>
              ) : (
                <div className="vp-revealBox">{diagnosisText}</div>
              )}
            </div>
          </section>

          <section>
            <button
              type="button"
              className="Ai_submit_btn"
              onClick={() => {
                const runtimeAssess = buildRuntimeEvaluation(messages, caseData);
                navigate(`/Ai_ket_qua/${stationId}`, {
                  state: {
                    aiAssess: runtimeAssess,
                    caseTitle: caseData?.title || "",
                  },
                });
              }}
              disabled={!stationId}
            >
              Kết Thúc &#38; Đánh Giá
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}
