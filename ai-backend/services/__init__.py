"""
Services package for Virtual Patient application
"""
from .vp_service import VirtualPatientService
from .tts_service import GoogleCloudTTS
from .stt_service import GoogleCloudSTT

__all__ = ['VirtualPatientService', 'GoogleCloudTTS', 'GoogleCloudSTT']
