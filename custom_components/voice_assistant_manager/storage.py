"""Storage handling for Voice Assistant Manager integration.

This module handles persistent storage of Voice Assistant Manager configuration
using Home Assistant's storage helper.
"""
from __future__ import annotations

import copy
import logging
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import (
    DEFAULT_DATA,
    DEFAULT_FILTER_CONFIG,
    FILTER_MODE_EXCLUDE,
    MODE_LINKED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .exceptions import StorageError

_LOGGER = logging.getLogger(__name__)


class VoiceAssistantManagerStorage:
    """Class to handle Voice Assistant Manager storage.

    This class manages all persistent data for the Voice Assistant Manager integration,
    including filter configs, aliases, and assistant settings.

    Attributes:
        hass: Home Assistant instance.
    """

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the storage.

        Args:
            hass: Home Assistant instance.
        """
        self.hass = hass
        self._store: Store = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        self._data: dict[str, Any] = copy.deepcopy(DEFAULT_DATA)
        self._loaded: bool = False

    async def async_load(self) -> dict[str, Any]:
        """Load data from storage.

        Returns:
            The loaded data dictionary.
        """
        try:
            stored = await self._store.async_load()
            if stored:
                # Check if migration is needed (v1 -> v2)
                if self._needs_migration(stored):
                    _LOGGER.info("Migrating Voice Assistant Manager data from v1 to v2")
                    stored = self._migrate_v1_to_v2(stored)
                    # Save migrated data
                    await self._store.async_save(stored)

                # Merge with defaults to handle missing keys
                self._data = self._merge_with_defaults(stored)
                _LOGGER.debug("Loaded Voice Assistant Manager data from storage")
            else:
                self._data = copy.deepcopy(DEFAULT_DATA)
                _LOGGER.debug("Initialized Voice Assistant Manager with default data")
            self._loaded = True
        except Exception as err:
            _LOGGER.error("Failed to load Voice Assistant Manager data: %s", err)
            self._data = copy.deepcopy(DEFAULT_DATA)
            self._loaded = True
            raise StorageError(f"Failed to load data: {err}") from err

        return self._data

    def _needs_migration(self, stored: dict[str, Any]) -> bool:
        """Check if stored data needs migration from v1 to v2.

        Args:
            stored: The stored data dictionary.

        Returns:
            True if migration is needed.
        """
        # v1 has "exclusions" key, v2 has "filter_config" key
        return "exclusions" in stored and "filter_config" not in stored

    def _migrate_v1_to_v2(self, stored: dict[str, Any]) -> dict[str, Any]:
        """Migrate data from v1 structure to v2.

        v1 structure:
            - exclusions: {domains: [], entities: [], devices: []}
            - google_exclusions, alexa_exclusions: same

        v2 structure:
            - filter_config: {filter_mode, domains, entities, devices, overrides}
            - google_filter_config, alexa_filter_config, homekit_filter_config: same

        Args:
            stored: The v1 data dictionary.

        Returns:
            Migrated v2 data dictionary.
        """
        migrated = copy.deepcopy(DEFAULT_DATA)

        # Preserve mode
        migrated["mode"] = stored.get("mode", MODE_LINKED)

        # Migrate linked mode exclusions to filter_config
        if "exclusions" in stored:
            old_excl = stored["exclusions"]
            migrated["filter_config"] = {
                "filter_mode": FILTER_MODE_EXCLUDE,
                "domains": old_excl.get("domains", []),
                "entities": old_excl.get("entities", []),
                "devices": old_excl.get("devices", []),
                "overrides": [],
            }

        # Migrate aliases
        migrated["aliases"] = stored.get("aliases", {})

        # Migrate google exclusions
        if "google_exclusions" in stored:
            old_excl = stored["google_exclusions"]
            migrated["google_filter_config"] = {
                "filter_mode": FILTER_MODE_EXCLUDE,
                "domains": old_excl.get("domains", []),
                "entities": old_excl.get("entities", []),
                "devices": old_excl.get("devices", []),
                "overrides": [],
            }
        migrated["google_aliases"] = stored.get("google_aliases", {})

        # Migrate alexa exclusions
        if "alexa_exclusions" in stored:
            old_excl = stored["alexa_exclusions"]
            migrated["alexa_filter_config"] = {
                "filter_mode": FILTER_MODE_EXCLUDE,
                "domains": old_excl.get("domains", []),
                "entities": old_excl.get("entities", []),
                "devices": old_excl.get("devices", []),
                "overrides": [],
            }
        migrated["alexa_aliases"] = stored.get("alexa_aliases", {})

        # Preserve settings
        if "google_settings" in stored:
            migrated["google_settings"] = stored["google_settings"]
        if "alexa_settings" in stored:
            migrated["alexa_settings"] = stored["alexa_settings"]
        if "last_generated" in stored:
            migrated["last_generated"] = stored["last_generated"]
            # Add homekit timestamp if not present
            if "homekit" not in migrated["last_generated"]:
                migrated["last_generated"]["homekit"] = None

        _LOGGER.info("Migration complete: v1 -> v2")
        return migrated

    async def async_save(self) -> None:
        """Save data to storage."""
        try:
            await self._store.async_save(self._data)
            _LOGGER.debug("Saved Voice Assistant Manager data to storage")
        except Exception as err:
            _LOGGER.error("Failed to save Voice Assistant Manager data: %s", err)
            raise StorageError(f"Failed to save data: {err}") from err

    def _merge_with_defaults(self, stored: dict[str, Any]) -> dict[str, Any]:
        """Merge stored data with defaults to ensure all keys exist.

        Args:
            stored: The stored data dictionary.

        Returns:
            Merged data dictionary with all required keys.
        """
        result = copy.deepcopy(DEFAULT_DATA)

        def deep_merge(base: dict, update: dict) -> dict:
            """Recursively merge update into base."""
            for key, value in update.items():
                if key in base and isinstance(base[key], dict) and isinstance(value, dict):
                    deep_merge(base[key], value)
                else:
                    base[key] = value
            return base

        return deep_merge(result, stored)

    @property
    def data(self) -> dict[str, Any]:
        """Return the current data."""
        return self._data

    @property
    def mode(self) -> str:
        """Return the current mode (linked or separate)."""
        return self._data.get("mode", MODE_LINKED)

    async def async_set_mode(self, mode: str) -> None:
        """Set the mode.

        Args:
            mode: The mode to set ('linked' or 'separate').

        Raises:
            ValidationError: If the mode is invalid.
        """
        from .validators import validate_mode
        validated_mode = validate_mode(mode)
        self._data["mode"] = validated_mode
        await self.async_save()
        _LOGGER.debug("Mode set to: %s", validated_mode)

    # ============ Filter Config Methods (v2) ============

    def get_filter_config(self, assistant: str | None = None) -> dict[str, Any]:
        """Get filter config for the specified assistant or linked mode.

        Args:
            assistant: The assistant type or None for linked mode.

        Returns:
            Dictionary with filter_mode, domains, entities, devices, overrides.
        """
        if self.mode == MODE_LINKED or assistant is None:
            return copy.deepcopy(
                self._data.get("filter_config", DEFAULT_FILTER_CONFIG)
            )

        key = f"{assistant}_filter_config"
        return copy.deepcopy(
            self._data.get(key, DEFAULT_FILTER_CONFIG)
        )

    async def async_set_filter_config(
        self,
        filter_config: dict[str, Any],
        assistant: str | None = None,
    ) -> None:
        """Set filter config for the specified assistant or linked mode.

        Args:
            filter_config: Dictionary with filter configuration.
            assistant: The assistant type or None for linked mode.
        """
        from .validators import validate_assistant, validate_filter_config

        validated_assistant = validate_assistant(assistant)
        validated_config = validate_filter_config(filter_config)

        if self.mode == MODE_LINKED or validated_assistant is None:
            self._data["filter_config"] = validated_config
        else:
            key = f"{validated_assistant}_filter_config"
            self._data[key] = validated_config

        await self.async_save()

    async def async_set_filter_mode(
        self,
        filter_mode: str,
        assistant: str | None = None,
    ) -> None:
        """Set the filter mode (include/exclude) for an assistant.

        Args:
            filter_mode: The filter mode ('include' or 'exclude').
            assistant: The assistant type or None for linked mode.
        """
        from .validators import validate_assistant, validate_filter_mode

        validated_mode = validate_filter_mode(filter_mode)
        validated_assistant = validate_assistant(assistant)

        config = self.get_filter_config(validated_assistant)
        config["filter_mode"] = validated_mode

        if self.mode == MODE_LINKED or validated_assistant is None:
            self._data["filter_config"] = config
        else:
            key = f"{validated_assistant}_filter_config"
            self._data[key] = config

        await self.async_save()
        _LOGGER.debug("Filter mode set to %s for %s", validated_mode, validated_assistant or "linked")

    async def async_set_domains(
        self,
        domains: list[str],
        assistant: str | None = None,
    ) -> None:
        """Set domains to include/exclude for an assistant.

        Args:
            domains: List of domain names.
            assistant: The assistant type or None for linked mode.
        """
        from .validators import validate_assistant

        validated_assistant = validate_assistant(assistant)
        config = self.get_filter_config(validated_assistant)
        config["domains"] = list(set(domains))  # Deduplicate

        if self.mode == MODE_LINKED or validated_assistant is None:
            self._data["filter_config"] = config
        else:
            key = f"{validated_assistant}_filter_config"
            self._data[key] = config

        await self.async_save()

    async def async_toggle_override(
        self,
        entity_id: str,
        assistant: str | None = None,
    ) -> bool:
        """Toggle an entity in the overrides list.

        Args:
            entity_id: The entity ID to toggle.
            assistant: The assistant type or None for linked mode.

        Returns:
            True if entity was added to overrides, False if removed.
        """
        from .validators import validate_assistant, validate_entity_id

        validated_entity_id = validate_entity_id(entity_id)
        validated_assistant = validate_assistant(assistant)

        config = self.get_filter_config(validated_assistant)
        overrides = set(config.get("overrides", []))

        if validated_entity_id in overrides:
            overrides.discard(validated_entity_id)
            added = False
        else:
            overrides.add(validated_entity_id)
            added = True

        config["overrides"] = list(overrides)

        if self.mode == MODE_LINKED or validated_assistant is None:
            self._data["filter_config"] = config
        else:
            key = f"{validated_assistant}_filter_config"
            self._data[key] = config

        await self.async_save()
        return added

    def is_entity_exposed(
        self,
        entity_id: str,
        assistant: str | None = None,
    ) -> tuple[bool, str]:
        """Check if an entity is exposed for an assistant.

        Args:
            entity_id: The entity ID to check.
            assistant: The assistant type or None for linked mode.

        Returns:
            Tuple of (is_exposed, reason).
            Reason can be: "", "domain", "entity", "device", "override"
        """
        config = self.get_filter_config(assistant)
        domain = entity_id.split(".")[0]

        filter_mode = config.get("filter_mode", FILTER_MODE_EXCLUDE)
        domains = config.get("domains", [])
        entities = config.get("entities", [])
        overrides = config.get("overrides", [])

        is_override = entity_id in overrides
        is_domain_match = domain in domains
        is_entity_match = entity_id in entities

        if filter_mode == FILTER_MODE_EXCLUDE:
            # Default: exposed
            # Excluded if: domain in list OR entity in list
            # Override re-includes
            if is_override:
                return True, "override"
            if is_domain_match:
                return False, "domain"
            if is_entity_match:
                return False, "entity"
            return True, ""
        else:  # include mode
            # Default: not exposed
            # Included if: domain in list OR entity in list
            # Override excludes
            if is_override:
                return False, "override"
            if is_domain_match:
                return True, "domain"
            if is_entity_match:
                return True, "entity"
            return False, ""

    # ============ Alias Methods ============

    def get_aliases(self, assistant: str | None = None) -> dict[str, str]:
        """Get aliases for the specified assistant or linked mode.

        Args:
            assistant: The assistant type or None for linked mode.

        Returns:
            Dictionary mapping entity IDs to aliases.
        """
        if self.mode == MODE_LINKED or assistant is None:
            return copy.deepcopy(self._data.get("aliases", {}))

        key = f"{assistant}_aliases"
        return copy.deepcopy(self._data.get(key, {}))

    async def async_set_alias(
        self,
        entity_id: str,
        alias: str,
        assistant: str | None = None,
    ) -> None:
        """Set alias for an entity.

        Args:
            entity_id: The entity ID to set alias for.
            alias: The alias to set (empty string to remove).
            assistant: The assistant type or None for linked mode.
        """
        from .validators import validate_alias, validate_assistant, validate_entity_id

        validated_entity_id = validate_entity_id(entity_id)
        validated_alias = validate_alias(alias)
        validated_assistant = validate_assistant(assistant)

        if self.mode == MODE_LINKED or validated_assistant is None:
            if validated_alias:
                self._data["aliases"][validated_entity_id] = validated_alias
            else:
                self._data["aliases"].pop(validated_entity_id, None)
        else:
            key = f"{validated_assistant}_aliases"
            if key not in self._data:
                self._data[key] = {}
            if validated_alias:
                self._data[key][validated_entity_id] = validated_alias
            else:
                self._data[key].pop(validated_entity_id, None)

        await self.async_save()

    async def async_set_aliases_bulk(
        self,
        aliases: dict[str, str],
        assistant: str | None = None,
    ) -> None:
        """Set multiple aliases at once.

        Args:
            aliases: Dictionary mapping entity IDs to aliases.
            assistant: The assistant type or None for linked mode.
        """
        from .validators import validate_alias, validate_assistant, validate_entity_id

        validated_assistant = validate_assistant(assistant)

        # Validate all aliases
        validated_aliases = {}
        for entity_id, alias in aliases.items():
            validated_entity_id = validate_entity_id(entity_id)
            validated_alias = validate_alias(alias)
            validated_aliases[validated_entity_id] = validated_alias

        if self.mode == MODE_LINKED or validated_assistant is None:
            self._data["aliases"].update(validated_aliases)
            # Remove empty aliases
            self._data["aliases"] = {
                k: v for k, v in self._data["aliases"].items() if v
            }
        else:
            key = f"{validated_assistant}_aliases"
            if key not in self._data:
                self._data[key] = {}
            self._data[key].update(validated_aliases)
            # Remove empty aliases
            self._data[key] = {k: v for k, v in self._data[key].items() if v}

        await self.async_save()

    # ============ Settings Methods ============

    def get_google_settings(self) -> dict[str, Any]:
        """Get Google Assistant settings."""
        from .const import DEFAULT_GOOGLE_SETTINGS
        return copy.deepcopy(
            self._data.get("google_settings", DEFAULT_GOOGLE_SETTINGS)
        )

    async def async_set_google_settings(self, settings: dict[str, Any]) -> None:
        """Set Google Assistant settings."""
        from .validators import validate_google_settings
        validated_settings = validate_google_settings(settings)
        current = self.get_google_settings()
        current.update(validated_settings)
        self._data["google_settings"] = current
        await self.async_save()
        _LOGGER.debug("Google settings updated")

    def get_alexa_settings(self) -> dict[str, Any]:
        """Get Alexa settings."""
        from .const import DEFAULT_ALEXA_SETTINGS
        return copy.deepcopy(
            self._data.get("alexa_settings", DEFAULT_ALEXA_SETTINGS)
        )

    async def async_set_alexa_settings(self, settings: dict[str, Any]) -> None:
        """Set Alexa settings."""
        from .validators import validate_alexa_settings
        validated_settings = validate_alexa_settings(settings)
        current = self.get_alexa_settings()
        current.update(validated_settings)
        self._data["alexa_settings"] = current
        await self.async_save()
        _LOGGER.debug("Alexa settings updated")

    # ============ HomeKit Methods ============

    def get_homekit_entry_id(self) -> str | None:
        """Get the selected HomeKit bridge entry ID."""
        return self._data.get("homekit_entry_id")

    async def async_set_homekit_entry_id(self, entry_id: str | None) -> None:
        """Set the HomeKit bridge entry ID to manage."""
        self._data["homekit_entry_id"] = entry_id
        await self.async_save()
        _LOGGER.debug("HomeKit entry ID set to: %s", entry_id)

    # ============ Timestamp Methods ============

    def get_last_generated(self, assistant: str) -> str | None:
        """Get last generated timestamp for assistant."""
        return self._data.get("last_generated", {}).get(assistant)

    async def async_set_last_generated(self, assistant: str, timestamp: str) -> None:
        """Set last generated timestamp for assistant."""
        from .validators import validate_assistant
        validated_assistant = validate_assistant(assistant)
        if "last_generated" not in self._data:
            self._data["last_generated"] = {}
        self._data["last_generated"][validated_assistant] = timestamp
        await self.async_save()

    # ============ Completion Checks ============

    def is_google_complete(self) -> bool:
        """Check if Google settings are complete enough to generate YAML."""
        settings = self.get_google_settings()
        if not settings.get("enabled"):
            return False
        return bool(settings.get("project_id")) and bool(
            settings.get("service_account_path")
        )

    def is_alexa_complete(self) -> bool:
        """Check if Alexa settings are complete enough to generate YAML."""
        settings = self.get_alexa_settings()
        if not settings.get("enabled"):
            return False
        return bool(settings.get("advanced_yaml"))

    def is_homekit_complete(self) -> bool:
        """Check if HomeKit is configured (has a bridge selected)."""
        return self.get_homekit_entry_id() is not None

    # ============ Full State for Frontend ============

    def get_full_state(self) -> dict[str, Any]:
        """Get the full state for the frontend.

        Returns:
            Complete state dictionary for frontend consumption.
        """
        return {
            "mode": self.mode,
            # New v2 structure
            "filter_config": self.get_filter_config(),
            "aliases": self.get_aliases(),
            "google_filter_config": self._data.get(
                "google_filter_config", DEFAULT_FILTER_CONFIG
            ),
            "google_aliases": self._data.get("google_aliases", {}),
            "alexa_filter_config": self._data.get(
                "alexa_filter_config", DEFAULT_FILTER_CONFIG
            ),
            "alexa_aliases": self._data.get("alexa_aliases", {}),
            "homekit_filter_config": self._data.get(
                "homekit_filter_config", DEFAULT_FILTER_CONFIG
            ),
            "homekit_entry_id": self.get_homekit_entry_id(),
            # Settings
            "google_settings": self.get_google_settings(),
            "alexa_settings": self.get_alexa_settings(),
            "last_generated": self._data.get(
                "last_generated", {"google": None, "alexa": None, "homekit": None}
            ),
            # Completion status
            "google_complete": self.is_google_complete(),
            "alexa_complete": self.is_alexa_complete(),
            "homekit_complete": self.is_homekit_complete(),
        }
