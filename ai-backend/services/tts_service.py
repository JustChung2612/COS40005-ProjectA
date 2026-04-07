"""
Google Cloud Text-to-Speech Service

OVERVIEW:
=========
Production-ready TTS service for Virtual Patient:
- Vietnamese WaveNet voice synthesis
- MP3 audio output for easy frontend playback
- Graceful error handling with helpful messages
"""

from typing import Optional
from google.cloud import texttospeech


class GoogleCloudTTS:
    """Google Cloud Text-to-Speech wrapper."""

    def __init__(self, language_code: str = "vi-VN", voice_name: str = "vi-VN-Wavenet-A"):
        self.language_code = language_code
        self.voice_name = voice_name
        self.client = texttospeech.TextToSpeechClient()

    def text_to_speech(self, text: str, voice_name: Optional[str] = None) -> bytes:
        """
        Convert text to MP3 audio bytes.

        Args:
            text: Input text to synthesize
            voice_name: Optional override voice name

        Returns:
            MP3 audio bytes
        """
        if not text or not text.strip():
            raise ValueError("Input text is empty")

        selected_voice = voice_name or self.voice_name

        synthesis_input = texttospeech.SynthesisInput(text=text)
        voice = texttospeech.VoiceSelectionParams(
            language_code=self.language_code,
            name=selected_voice,
        )
        audio_config = texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3,
            speaking_rate=1.0,
        )

        response = self.client.synthesize_speech(
            input=synthesis_input,
            voice=voice,
            audio_config=audio_config,
        )

        return response.audio_content
