"""
Google Cloud Speech-to-Text Service

OVERVIEW:
=========
Production-ready STT service for Virtual Patient:
- Vietnamese speech recognition
- Automatic punctuation
- Supports common web audio encodings
"""

from google.cloud import speech


class GoogleCloudSTT:
    """Google Cloud Speech-to-Text wrapper."""

    def __init__(self, language_code: str = "vi-VN"):
        self.language_code = language_code
        self.client = speech.SpeechClient()

    def speech_to_text(self, audio_bytes: bytes, mime_type: str = "audio/webm") -> str:
        """
        Convert audio bytes to text.

        Args:
            audio_bytes: Raw audio content
            mime_type: MIME type sent by client

        Returns:
            Transcribed text (best alternative)
        """
        if not audio_bytes:
            raise ValueError("Audio payload is empty")

        # Map MIME type to likely encoding used by browser clients.
        if mime_type in ("audio/wav", "audio/x-wav"):
            encoding = speech.RecognitionConfig.AudioEncoding.LINEAR16
        elif mime_type in ("audio/flac",):
            encoding = speech.RecognitionConfig.AudioEncoding.FLAC
        elif mime_type in ("audio/ogg", "audio/ogg; codecs=opus"):
            encoding = speech.RecognitionConfig.AudioEncoding.OGG_OPUS
        else:
            # Browser MediaRecorder often uses webm/opus.
            encoding = speech.RecognitionConfig.AudioEncoding.WEBM_OPUS

        config = speech.RecognitionConfig(
            encoding=encoding,
            language_code=self.language_code,
            enable_automatic_punctuation=True,
            model="latest_short",
        )

        audio = speech.RecognitionAudio(content=audio_bytes)
        response = self.client.recognize(config=config, audio=audio)

        transcripts = []
        for result in response.results:
            if result.alternatives:
                transcripts.append(result.alternatives[0].transcript)

        final_text = " ".join(transcripts).strip()
        if not final_text:
            raise ValueError("No speech recognized from audio")

        return final_text
