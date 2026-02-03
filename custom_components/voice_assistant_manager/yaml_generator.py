"""YAML generator for Voice Assistant Manager integration.

This module handles the generation of YAML configuration files for
Google Assistant and Alexa Smart Home integrations.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING, Any

import yaml
from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import (
    ALEXA_YAML_PATH,
    ASSISTANT_ALEXA,
    ASSISTANT_GOOGLE,
    FILTER_MODE_EXCLUDE,
    GOOGLE_YAML_PATH,
    VERSION,
)
from .exceptions import YAMLGenerationError
from .validators import validate_path

if TYPE_CHECKING:
    from .storage import VoiceManagerStorage

_LOGGER = logging.getLogger(__name__)


class YAMLGenerator:
    """Generate YAML files for voice assistants.

    This class handles the generation and writing of YAML configuration
    files for Google Assistant and Alexa integrations.

    Attributes:
        hass: Home Assistant instance.
        storage: Voice Assistant Manager storage instance.
    """

    def __init__(self, hass: HomeAssistant, storage: VoiceManagerStorage) -> None:
        """Initialize the YAML generator.

        Args:
            hass: Home Assistant instance.
            storage: Voice Assistant Manager storage instance.
        """
        self.hass = hass
        self.storage = storage

    def _expand_device_to_entities(self, device_ids: list[str]) -> list[str]:
        """Expand device IDs to their entity IDs.

        Args:
            device_ids: List of device IDs to expand.

        Returns:
            List of entity IDs belonging to the devices.
        """
        ent_reg = er.async_get(self.hass)
        entity_ids = []

        for device_id in device_ids:
            for entity in ent_reg.entities.values():
                if entity.device_id == device_id and not entity.disabled:
                    entity_ids.append(entity.entity_id)

        return entity_ids

    def _get_all_entity_ids(self) -> list[str]:
        """Get all non-disabled entity IDs from the registry.

        Returns:
            List of all entity IDs.
        """
        ent_reg = er.async_get(self.hass)
        return [
            entity.entity_id
            for entity in ent_reg.entities.values()
            if not entity.disabled
        ]

    def _get_entities_for_domains(self, domains: list[str]) -> list[str]:
        """Get all entity IDs belonging to specified domains.

        Args:
            domains: List of domain names.

        Returns:
            List of entity IDs in those domains.
        """
        ent_reg = er.async_get(self.hass)
        entity_ids = []

        for entity in ent_reg.entities.values():
            if not entity.disabled:
                entity_domain = entity.entity_id.split(".")[0]
                if entity_domain in domains:
                    entity_ids.append(entity.entity_id)

        return entity_ids

    def _get_non_exposed_entities(self, assistant: str) -> list[str]:
        """Get all entity IDs that should NOT be exposed for an assistant.

        This handles both include and exclude modes, with overrides.

        Args:
            assistant: The assistant type.

        Returns:
            List of entity IDs that should be hidden (expose: false).
        """
        assistant_key = assistant if self.storage.mode != "linked" else None
        config = self.storage.get_filter_config(assistant_key)

        filter_mode = config.get("filter_mode", FILTER_MODE_EXCLUDE)
        domains = set(config.get("domains", []))
        entities = set(config.get("entities", []))
        devices = config.get("devices", [])
        overrides = set(config.get("overrides", []))

        # Expand devices to entities
        device_entities = set(self._expand_device_to_entities(devices))

        all_entities = set(self._get_all_entity_ids())
        non_exposed = set()

        if filter_mode == FILTER_MODE_EXCLUDE:
            # Exclude mode: everything exposed EXCEPT what's in the lists
            # Get entities from excluded domains
            domain_entities = set(self._get_entities_for_domains(list(domains)))
            # Non-exposed = domain entities + explicit entities + device entities
            non_exposed = domain_entities | entities | device_entities
            # But overrides RE-INCLUDE, so remove them
            non_exposed -= overrides
        else:
            # Include mode: nothing exposed EXCEPT what's in the lists
            # Get entities from included domains
            domain_entities = set(self._get_entities_for_domains(list(domains)))
            # Exposed = domain entities + explicit entities + device entities
            exposed = domain_entities | entities | device_entities
            # Non-exposed = everything else
            non_exposed = all_entities - exposed
            # Overrides EXCLUDE from included, so add them back to non_exposed
            non_exposed |= overrides

        return sorted(non_exposed)

    def _get_effective_aliases(self, assistant: str) -> dict[str, str]:
        """Get effective aliases for the assistant.

        Args:
            assistant: The assistant type.

        Returns:
            Dictionary mapping entity IDs to aliases.
        """
        return self.storage.get_aliases(
            assistant if self.storage.mode != "linked" else None
        )

    def _parse_advanced_yaml(
        self, yaml_text: str
    ) -> tuple[dict[str, Any], list[str]]:
        """Parse advanced YAML text, handling !secret tags.

        Args:
            yaml_text: The YAML text to parse.

        Returns:
            Tuple of (parsed_dict, warnings).
        """
        warnings = []

        if not yaml_text or not yaml_text.strip():
            return {}, warnings

        # Custom loader to handle !secret tags
        class SecretLoader(yaml.SafeLoader):
            """YAML loader that preserves !secret tags."""

        def secret_constructor(loader: yaml.Loader, node: yaml.Node) -> str:
            """Construct a !secret placeholder."""
            return f"!secret {node.value}"

        SecretLoader.add_constructor("!secret", secret_constructor)

        try:
            # Try to parse as YAML
            parsed = yaml.load(yaml_text, Loader=SecretLoader)
            if parsed is None:
                return {}, warnings
            if not isinstance(parsed, dict):
                warnings.append("Advanced YAML must be a mapping (key: value pairs)")
                return {}, warnings
            return parsed, warnings
        except yaml.YAMLError as err:
            warnings.append(f"Invalid YAML in advanced settings: {err}")
            return {}, warnings

    def _dict_to_yaml_with_secrets(self, data: dict) -> str:
        """Convert dict to YAML string, properly handling !secret values.

        Args:
            data: Dictionary to convert.

        Returns:
            YAML string representation.
        """

        class SecretDumper(yaml.SafeDumper):
            """YAML dumper that properly outputs !secret tags."""

        def str_representer(dumper: yaml.Dumper, data: str) -> yaml.Node:
            """Represent strings, handling !secret and !include specially."""
            if isinstance(data, str) and data.startswith("!secret "):
                # Return the raw !secret tag
                secret_name = data[8:]  # Remove "!secret " prefix
                return dumper.represent_scalar("!secret", secret_name, style=None)
            if isinstance(data, str) and data.startswith("!include "):
                # Return the raw !include tag
                include_path = data[9:]  # Remove "!include " prefix
                return dumper.represent_scalar("!include", include_path, style=None)
            return dumper.represent_scalar("tag:yaml.org,2002:str", data)

        SecretDumper.add_representer(str, str_representer)

        return yaml.dump(
            data,
            Dumper=SecretDumper,
            default_flow_style=False,
            allow_unicode=True,
            sort_keys=False,
        )

    def generate_google_yaml(self) -> tuple[str, list[str]]:
        """Generate Google Assistant YAML configuration.

        Google Assistant uses entity_config with expose: false for exclusions,
        NOT filter like Alexa does. This works for both include and exclude modes.

        Returns:
            Tuple of (yaml_content, warnings).
        """
        warnings = []
        settings = self.storage.get_google_settings()

        if not settings.get("enabled"):
            return "", ["Google Assistant is disabled"]

        if not settings.get("project_id"):
            warnings.append("Missing project_id")
        if not settings.get("service_account_path"):
            warnings.append("Missing service_account_path")

        if warnings:
            return "", warnings

        # Build the configuration
        service_account_path = settings["service_account_path"]
        # Convert path to !include format with correct relative path
        if service_account_path.startswith("/config/"):
            filename = service_account_path[8:]  # Remove "/config/" prefix
            include_file = f"../{filename}"
        elif service_account_path.startswith("./"):
            filename = service_account_path[2:]  # Remove "./" prefix
            include_file = f"../{filename}"
        else:
            include_file = f"../{service_account_path}"

        config: dict[str, Any] = {
            "google_assistant": {
                "project_id": settings["project_id"],
                "service_account": f"!include {include_file}",
            }
        }

        ga_config = config["google_assistant"]

        # Add optional settings
        if settings.get("report_state") is not None:
            ga_config["report_state"] = settings["report_state"]

        if settings.get("secure_devices_pin"):
            ga_config["secure_devices_pin"] = settings["secure_devices_pin"]

        # Parse and merge advanced YAML
        advanced_yaml = settings.get("advanced_yaml", "")
        if advanced_yaml:
            advanced_config, adv_warnings = self._parse_advanced_yaml(advanced_yaml)
            warnings.extend(adv_warnings)

            # Merge advanced config (but don't override our entity_config)
            for key, value in advanced_config.items():
                if key != "entity_config":
                    ga_config[key] = value

        # Get non-exposed entities (handles both include/exclude modes)
        non_exposed = self._get_non_exposed_entities(ASSISTANT_GOOGLE)
        aliases = self._get_effective_aliases(ASSISTANT_GOOGLE)

        # Build entity_config with expose: false for non-exposed and name for aliases
        entity_config: dict[str, dict[str, Any]] = {}

        # Add non-exposed entities (expose: false)
        for entity_id in non_exposed:
            if entity_id not in entity_config:
                entity_config[entity_id] = {}
            entity_config[entity_id]["expose"] = False

        # Add aliases (name)
        for entity_id, alias in sorted(aliases.items()):
            if alias:
                if entity_id not in entity_config:
                    entity_config[entity_id] = {}
                entity_config[entity_id]["name"] = alias

        if entity_config:
            ga_config["entity_config"] = entity_config

        # Generate YAML
        yaml_output = self._dict_to_yaml_with_secrets(config)

        return yaml_output, warnings

    def generate_alexa_yaml(self) -> tuple[str, list[str]]:
        """Generate Alexa YAML configuration.

        Alexa supports both include and exclude filters natively.

        Returns:
            Tuple of (yaml_content, warnings).
        """
        warnings = []
        settings = self.storage.get_alexa_settings()

        if not settings.get("enabled"):
            return "", ["Alexa is disabled"]

        advanced_yaml = settings.get("advanced_yaml", "")
        if not advanced_yaml:
            warnings.append("Missing advanced_yaml configuration for Alexa")
            return "", warnings

        # Parse advanced YAML
        advanced_config, adv_warnings = self._parse_advanced_yaml(advanced_yaml)
        warnings.extend(adv_warnings)

        if adv_warnings:
            return "", warnings

        # Build the configuration
        config: dict[str, Any] = {"alexa": {"smart_home": {}}}

        smart_home = config["alexa"]["smart_home"]

        # Merge advanced config into smart_home
        for key, value in advanced_config.items():
            if key not in ["filter", "entity_config"]:
                smart_home[key] = value

        # Get filter config
        assistant_key = ASSISTANT_ALEXA if self.storage.mode != "linked" else None
        filter_config = self.storage.get_filter_config(assistant_key)

        filter_mode = filter_config.get("filter_mode", FILTER_MODE_EXCLUDE)
        domains = filter_config.get("domains", [])
        entities = filter_config.get("entities", [])
        devices = filter_config.get("devices", [])
        overrides = filter_config.get("overrides", [])

        # Expand devices to entities
        device_entities = self._expand_device_to_entities(devices)
        all_entities = list(set(entities + device_entities))

        # Build filter based on mode
        # Alexa supports both include and exclude natively
        if filter_mode == FILTER_MODE_EXCLUDE:
            # Exclude mode - use exclude_domains and exclude_entities
            filter_dict: dict[str, Any] = {}

            if domains:
                filter_dict["exclude_domains"] = sorted(domains)

            # Exclude entities, but remove overrides (they're re-included)
            exclude_entities = set(all_entities) - set(overrides)
            if exclude_entities:
                filter_dict["exclude_entities"] = sorted(exclude_entities)

            # If there are overrides (re-included entities from excluded domains),
            # we need to explicitly include them
            if overrides and domains:
                # Only include overrides that would otherwise be excluded by domain
                domain_entities = set(self._get_entities_for_domains(domains))
                reincluded = set(overrides) & domain_entities
                if reincluded:
                    filter_dict["include_entities"] = sorted(reincluded)

            if filter_dict:
                smart_home["filter"] = filter_dict
        else:
            # Include mode - use include_domains and include_entities
            filter_dict = {}

            if domains:
                filter_dict["include_domains"] = sorted(domains)

            # Include entities, but remove overrides (they're excluded)
            include_entities = set(all_entities) - set(overrides)
            if include_entities:
                filter_dict["include_entities"] = sorted(include_entities)

            # Overrides in include mode are excluded
            if overrides:
                filter_dict["exclude_entities"] = sorted(overrides)

            if filter_dict:
                smart_home["filter"] = filter_dict

        # Add entity_config for aliases
        aliases = self._get_effective_aliases(ASSISTANT_ALEXA)
        if aliases:
            smart_home["entity_config"] = {}
            for entity_id, alias in sorted(aliases.items()):
                if alias:
                    smart_home["entity_config"][entity_id] = {"name": alias}

        # Generate YAML
        yaml_output = self._dict_to_yaml_with_secrets(config)

        return yaml_output, warnings

    async def async_write_google_yaml(self) -> None:
        """Write Google Assistant YAML to file.

        Raises:
            YAMLGenerationError: If YAML cannot be generated.
            SecurityError: If the output path is not safe.
        """
        yaml_content, warnings = self.generate_google_yaml()

        if warnings:
            raise YAMLGenerationError(
                f"Cannot write Google YAML: {', '.join(warnings)}"
            )

        await self._async_write_file(GOOGLE_YAML_PATH, yaml_content)

    async def async_write_alexa_yaml(self) -> None:
        """Write Alexa YAML to file.

        Raises:
            YAMLGenerationError: If YAML cannot be generated.
            SecurityError: If the output path is not safe.
        """
        yaml_content, warnings = self.generate_alexa_yaml()

        if warnings:
            raise YAMLGenerationError(
                f"Cannot write Alexa YAML: {', '.join(warnings)}"
            )

        await self._async_write_file(ALEXA_YAML_PATH, yaml_content)

    async def _async_write_file(self, relative_path: str, content: str) -> None:
        """Write content to a file in the config directory.

        Args:
            relative_path: Path relative to config directory.
            content: Content to write.

        Raises:
            SecurityError: If the path is not safe.
            YAMLGenerationError: If writing fails.
        """
        config_dir = Path(self.hass.config.path())

        # Validate path for security (prevents path traversal)
        file_path = validate_path(relative_path, config_dir)

        # Ensure directory exists
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # Write file (always overwrite, no backups per spec)
        def write() -> None:
            """Write file synchronously."""
            with open(file_path, "w", encoding="utf-8") as f:
                # Add header comment
                f.write(
                    f"# Generated by Voice Assistant Manager v{VERSION} - DO NOT EDIT MANUALLY\n"
                )
                f.write(
                    "# This file will be overwritten when you save changes in Voice Assistant Manager\n\n"
                )
                f.write(content)

        try:
            await self.hass.async_add_executor_job(write)
            _LOGGER.info("Written YAML to %s", file_path)
        except OSError as err:
            raise YAMLGenerationError(f"Failed to write file: {err}") from err
