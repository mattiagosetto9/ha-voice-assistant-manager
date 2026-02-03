"""Input validation utilities for Voice Assistant Manager integration."""
from __future__ import annotations

import re
from pathlib import Path
from typing import Any

from .const import (
    ALLOWED_OUTPUT_DIRS,
    FILTER_MODE_EXCLUDE,
    MAX_ADVANCED_YAML_LENGTH,
    MAX_ALIAS_LENGTH,
    MAX_BULK_ENTITIES,
    MAX_ENTITY_ID_LENGTH,
    MAX_PATH_LENGTH,
    MAX_PIN_LENGTH,
    MAX_PROJECT_ID_LENGTH,
    VALID_ASSISTANTS,
    VALID_FILTER_MODES,
    VALID_MODES,
)
from .exceptions import SecurityError, ValidationError

# Regex patterns
# Entity IDs: domain.object_id - object_id can contain lowercase letters, numbers, underscore
ENTITY_ID_PATTERN = re.compile(r"^[a-z_]+\.[a-z0-9_]+$")
DOMAIN_PATTERN = re.compile(r"^[a-z_]+$")
# Device IDs in Home Assistant can contain alphanumeric chars, underscores, and hyphens
DEVICE_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]+$")
PROJECT_ID_PATTERN = re.compile(r"^[a-z][a-z0-9-]{4,28}[a-z0-9]$")
# Safe characters for aliases (alphanumeric, spaces, common punctuation)
SAFE_ALIAS_PATTERN = re.compile(r"^[\w\s\-\'\".,!?()]+$", re.UNICODE)


def validate_entity_id(entity_id: str) -> str:
    """Validate and sanitize an entity ID.

    Args:
        entity_id: The entity ID to validate.

    Returns:
        The validated entity ID.

    Raises:
        ValidationError: If the entity ID is invalid.
    """
    if not entity_id or not isinstance(entity_id, str):
        raise ValidationError("Entity ID is required")

    entity_id = entity_id.strip().lower()

    if len(entity_id) > MAX_ENTITY_ID_LENGTH:
        raise ValidationError(f"Entity ID too long (max {MAX_ENTITY_ID_LENGTH})")

    if not ENTITY_ID_PATTERN.match(entity_id):
        raise ValidationError(f"Invalid entity ID format: {entity_id}")

    return entity_id


def validate_entity_ids(entity_ids: list[str]) -> list[str]:
    """Validate a list of entity IDs.

    Args:
        entity_ids: List of entity IDs to validate.

    Returns:
        List of validated entity IDs.

    Raises:
        ValidationError: If any entity ID is invalid or list is too long.
    """
    if not isinstance(entity_ids, list):
        raise ValidationError("Entity IDs must be a list")

    if len(entity_ids) > MAX_BULK_ENTITIES:
        raise ValidationError(f"Too many entities (max {MAX_BULK_ENTITIES})")

    return [validate_entity_id(eid) for eid in entity_ids]


def validate_domain(domain: str) -> str:
    """Validate a domain name.

    Args:
        domain: The domain to validate.

    Returns:
        The validated domain.

    Raises:
        ValidationError: If the domain is invalid.
    """
    if not domain or not isinstance(domain, str):
        raise ValidationError("Domain is required")

    domain = domain.strip().lower()

    if not DOMAIN_PATTERN.match(domain):
        raise ValidationError(f"Invalid domain format: {domain}")

    return domain


def validate_device_id(device_id: str) -> str:
    """Validate a device ID.

    Args:
        device_id: The device ID to validate.

    Returns:
        The validated device ID.

    Raises:
        ValidationError: If the device ID is invalid.
    """
    if not device_id or not isinstance(device_id, str):
        raise ValidationError("Device ID is required")

    device_id = device_id.strip().lower()

    if not DEVICE_ID_PATTERN.match(device_id):
        raise ValidationError(f"Invalid device ID format: {device_id}")

    return device_id


def validate_alias(alias: str) -> str:
    """Validate and sanitize a voice alias.

    Args:
        alias: The alias to validate.

    Returns:
        The validated and sanitized alias.

    Raises:
        ValidationError: If the alias is invalid.
    """
    if alias is None:
        return ""

    if not isinstance(alias, str):
        raise ValidationError("Alias must be a string")

    alias = alias.strip()

    if not alias:
        return ""

    if len(alias) > MAX_ALIAS_LENGTH:
        raise ValidationError(f"Alias too long (max {MAX_ALIAS_LENGTH})")

    # Allow empty alias (to clear it)
    if alias and not SAFE_ALIAS_PATTERN.match(alias):
        raise ValidationError("Alias contains invalid characters")

    return alias


def validate_mode(mode: str) -> str:
    """Validate the mode setting.

    Args:
        mode: The mode to validate.

    Returns:
        The validated mode.

    Raises:
        ValidationError: If the mode is invalid.
    """
    if mode not in VALID_MODES:
        raise ValidationError(f"Invalid mode: {mode}. Must be one of: {VALID_MODES}")
    return mode


def validate_assistant(assistant: str | None) -> str | None:
    """Validate the assistant type.

    Args:
        assistant: The assistant type to validate.

    Returns:
        The validated assistant type or None.

    Raises:
        ValidationError: If the assistant type is invalid.
    """
    if assistant is None:
        return None

    if assistant not in VALID_ASSISTANTS:
        raise ValidationError(f"Invalid assistant: {assistant}")

    return assistant


def validate_path(path: str, config_dir: Path) -> Path:
    """Validate a file path for security.

    Ensures the path:
    - Is within the config directory
    - Does not contain path traversal
    - Is in an allowed output directory

    Args:
        path: The relative path to validate.
        config_dir: The Home Assistant config directory.

    Returns:
        The validated absolute path.

    Raises:
        SecurityError: If the path is not safe.
    """
    if not path or not isinstance(path, str):
        raise SecurityError("Path is required")

    if len(path) > MAX_PATH_LENGTH:
        raise SecurityError(f"Path too long (max {MAX_PATH_LENGTH})")

    # Check for path traversal attempts
    if ".." in path or path.startswith("/") or path.startswith("~"):
        raise SecurityError("Invalid path: path traversal not allowed")

    # Resolve the full path
    full_path = (config_dir / path).resolve()

    # Ensure it's still within config directory
    try:
        full_path.relative_to(config_dir)
    except ValueError:
        raise SecurityError("Path must be within config directory") from None

    # Check if output directory is allowed
    parts = Path(path).parts
    if parts and parts[0] not in ALLOWED_OUTPUT_DIRS:
        raise SecurityError(f"Output directory not allowed: {parts[0]}")

    return full_path


def validate_service_account_path(path: str) -> str:
    """Validate service account path.

    For security, service account paths must be within the Home Assistant
    config directory. Absolute paths starting with /config/ are allowed,
    as well as relative paths.

    Args:
        path: The service account path to validate.

    Returns:
        The validated path.

    Raises:
        ValidationError: If the path is invalid.
    """
    if not path or not isinstance(path, str):
        return ""

    path = path.strip()

    if len(path) > MAX_PATH_LENGTH:
        raise ValidationError(f"Path too long (max {MAX_PATH_LENGTH})")

    # Check for suspicious patterns
    if ".." in path:
        raise ValidationError("Invalid path: path traversal not allowed")

    # Allow paths within /config/ (Docker) or relative paths
    if path.startswith("/"):
        # Absolute paths must be within /config/ (standard HA Docker path)
        if not path.startswith("/config/"):
            raise ValidationError(
                "Service account path must be within /config/ directory "
                "(e.g., /config/service_account.json)"
            )
    elif not path.startswith("./") and "/" in path:
        # Relative paths with subdirectories should start with ./
        path = "./" + path

    return path


def validate_project_id(project_id: str) -> str:
    """Validate Google project ID.

    Args:
        project_id: The project ID to validate.

    Returns:
        The validated project ID.

    Raises:
        ValidationError: If the project ID is invalid.
    """
    if not project_id or not isinstance(project_id, str):
        return ""

    project_id = project_id.strip().lower()

    if len(project_id) > MAX_PROJECT_ID_LENGTH:
        raise ValidationError(f"Project ID too long (max {MAX_PROJECT_ID_LENGTH})")

    # Google project ID format validation (very relaxed - just basic sanity check)
    # Allow any alphanumeric with hyphens, as Google's actual format may vary
    if project_id and not re.match(r"^[a-z0-9][a-z0-9-]*$", project_id):
        raise ValidationError("Invalid project ID format")

    return project_id


def validate_pin(pin: str) -> str:
    """Validate secure devices PIN.

    Args:
        pin: The PIN to validate.

    Returns:
        The validated PIN.

    Raises:
        ValidationError: If the PIN is invalid.
    """
    if not pin or not isinstance(pin, str):
        return ""

    pin = pin.strip()

    if len(pin) > MAX_PIN_LENGTH:
        raise ValidationError(f"PIN too long (max {MAX_PIN_LENGTH})")

    # PIN should be alphanumeric
    if pin and not pin.isalnum():
        raise ValidationError("PIN must be alphanumeric")

    return pin


def validate_advanced_yaml(yaml_text: str) -> str:
    """Validate advanced YAML text.

    Args:
        yaml_text: The YAML text to validate.

    Returns:
        The validated YAML text.

    Raises:
        ValidationError: If the YAML is invalid.
    """
    if not yaml_text or not isinstance(yaml_text, str):
        return ""

    if len(yaml_text) > MAX_ADVANCED_YAML_LENGTH:
        raise ValidationError(f"YAML too long (max {MAX_ADVANCED_YAML_LENGTH})")

    # Check for potentially dangerous patterns
    dangerous_patterns = [
        "!!python",
        "!!ruby",
        "!!perl",
        "!!java",
        "__import__",
        "eval(",
        "exec(",
        "subprocess",
        "os.system",
    ]

    yaml_lower = yaml_text.lower()
    for pattern in dangerous_patterns:
        if pattern in yaml_lower:
            raise SecurityError(f"Potentially dangerous pattern in YAML: {pattern}")

    return yaml_text


def validate_google_settings(settings: dict[str, Any]) -> dict[str, Any]:
    """Validate Google Assistant settings.

    Args:
        settings: The settings dictionary to validate.

    Returns:
        The validated settings.

    Raises:
        ValidationError: If any setting is invalid.
    """
    validated = {}

    if "enabled" in settings:
        validated["enabled"] = bool(settings["enabled"])

    if "project_id" in settings:
        validated["project_id"] = validate_project_id(settings["project_id"])

    if "service_account_path" in settings:
        validated["service_account_path"] = validate_service_account_path(
            settings["service_account_path"]
        )

    if "report_state" in settings:
        validated["report_state"] = bool(settings["report_state"])

    if "secure_devices_pin" in settings:
        validated["secure_devices_pin"] = validate_pin(settings["secure_devices_pin"])

    if "advanced_yaml" in settings:
        validated["advanced_yaml"] = validate_advanced_yaml(settings["advanced_yaml"])

    return validated


def validate_alexa_settings(settings: dict[str, Any]) -> dict[str, Any]:
    """Validate Alexa settings.

    Args:
        settings: The settings dictionary to validate.

    Returns:
        The validated settings.

    Raises:
        ValidationError: If any setting is invalid.
    """
    validated = {}

    if "enabled" in settings:
        validated["enabled"] = bool(settings["enabled"])

    if "advanced_yaml" in settings:
        validated["advanced_yaml"] = validate_advanced_yaml(settings["advanced_yaml"])

    return validated


def validate_filter_mode(filter_mode: str) -> str:
    """Validate the filter mode setting.

    Args:
        filter_mode: The filter mode to validate ('include' or 'exclude').

    Returns:
        The validated filter mode.

    Raises:
        ValidationError: If the filter mode is invalid.
    """
    if filter_mode not in VALID_FILTER_MODES:
        raise ValidationError(
            f"Invalid filter mode: {filter_mode}. Must be one of: {VALID_FILTER_MODES}"
        )
    return filter_mode


def validate_filter_config(config: dict[str, Any]) -> dict[str, Any]:
    """Validate a filter configuration dictionary.

    Args:
        config: The filter config dictionary to validate.

    Returns:
        The validated filter config.

    Raises:
        ValidationError: If any field is invalid.
    """
    validated = {
        "filter_mode": FILTER_MODE_EXCLUDE,
        "domains": [],
        "entities": [],
        "devices": [],
        "overrides": [],
    }

    if "filter_mode" in config:
        validated["filter_mode"] = validate_filter_mode(config["filter_mode"])

    if "domains" in config and isinstance(config["domains"], list):
        validated["domains"] = [validate_domain(d) for d in config["domains"]]

    if "entities" in config and isinstance(config["entities"], list):
        validated["entities"] = [validate_entity_id(e) for e in config["entities"]]

    if "devices" in config and isinstance(config["devices"], list):
        validated["devices"] = [validate_device_id(d) for d in config["devices"]]

    if "overrides" in config and isinstance(config["overrides"], list):
        validated["overrides"] = [validate_entity_id(e) for e in config["overrides"]]

    return validated


def validate_domains(domains: list[str]) -> list[str]:
    """Validate a list of domain names.

    Args:
        domains: List of domain names to validate.

    Returns:
        List of validated domain names.

    Raises:
        ValidationError: If any domain is invalid.
    """
    if not isinstance(domains, list):
        raise ValidationError("Domains must be a list")

    return [validate_domain(d) for d in domains]
