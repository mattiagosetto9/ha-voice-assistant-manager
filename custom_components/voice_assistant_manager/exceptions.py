"""Exceptions for Voice Assistant Manager integration."""
from homeassistant.exceptions import HomeAssistantError


class VoiceManagerError(HomeAssistantError):
    """Base exception for Voice Assistant Manager."""


class ValidationError(VoiceManagerError):
    """Validation error."""


class SecurityError(VoiceManagerError):
    """Security violation error."""


class StorageError(VoiceManagerError):
    """Storage operation error."""


class YAMLGenerationError(VoiceManagerError):
    """YAML generation error."""


class HomeKitError(VoiceManagerError):
    """HomeKit integration error."""
