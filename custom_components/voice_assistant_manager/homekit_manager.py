"""HomeKit Bridge manager for Voice Assistant Manager integration.

This module handles reading and writing HomeKit Bridge configuration
through Home Assistant's config_entries system.
"""
from __future__ import annotations

import logging
from typing import TYPE_CHECKING, Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er

from .const import (
    FILTER_MODE_EXCLUDE,
    FILTER_MODE_INCLUDE,
    HOMEKIT_SUPPORTED_DOMAINS,
)
from .exceptions import HomeKitError

if TYPE_CHECKING:
    from .storage import VoiceManagerStorage

_LOGGER = logging.getLogger(__name__)

# HomeKit integration domain
HOMEKIT_DOMAIN = "homekit"


class HomeKitManager:
    """Manage HomeKit Bridge configuration through config_entries.

    This class handles:
    - Finding HomeKit bridge entries
    - Reading bridge configuration
    - Updating bridge configuration
    - Reloading the integration after changes

    Attributes:
        hass: Home Assistant instance.
        storage: Voice Assistant Manager storage instance.
    """

    def __init__(self, hass: HomeAssistant, storage: VoiceManagerStorage) -> None:
        """Initialize the HomeKit manager.

        Args:
            hass: Home Assistant instance.
            storage: Voice Assistant Manager storage instance.
        """
        self.hass = hass
        self.storage = storage

    def get_homekit_bridges(self) -> list[dict[str, Any]]:
        """Get all HomeKit bridge entries (mode=bridge, not accessory).

        Only returns entries from the 'homekit' integration that are configured
        as bridges (not accessory mode). This excludes Apple TV and other
        HomeKit-related integrations.

        Returns:
            List of bridge info dicts with entry_id, title, port, and config.
        """
        bridges = []

        for entry in self.hass.config_entries.async_entries(HOMEKIT_DOMAIN):
            options = entry.options or {}
            data = entry.data or {}

            # Get mode - check options first (where HA stores it after config flow)
            # Default to "bridge" if not specified (HA's default)
            mode = options.get("mode", "bridge")

            # Only include bridge mode entries
            if mode != "bridge":
                continue

            port = data.get("port")
            bridges.append({
                "entry_id": entry.entry_id,
                "title": entry.title,
                "port": port,
                "name": data.get("name", entry.title),
                "include_domains": options.get("filter", {}).get("include_domains", []),
                "exclude_entities": options.get("filter", {}).get("exclude_entities", []),
            })

        return bridges

    def get_bridge_config(self, entry_id: str) -> dict[str, Any] | None:
        """Get configuration for a specific HomeKit bridge.

        Args:
            entry_id: The config entry ID.

        Returns:
            Dict with bridge configuration or None if not found.
        """
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None or entry.domain != HOMEKIT_DOMAIN:
            return None

        options = entry.options or {}
        filter_config = options.get("filter", {})

        return {
            "entry_id": entry.entry_id,
            "title": entry.title,
            "port": entry.data.get("port"),
            "name": entry.data.get("name", entry.title),
            "mode": options.get("mode", "bridge"),
            "include_domains": filter_config.get("include_domains", []),
            "include_entities": filter_config.get("include_entities", []),
            "exclude_domains": filter_config.get("exclude_domains", []),
            "exclude_entities": filter_config.get("exclude_entities", []),
            "devices": options.get("devices", []),
        }

    async def async_update_bridge_config(
        self,
        entry_id: str,
        include_domains: list[str] | None = None,
        exclude_entities: list[str] | None = None,
    ) -> None:
        """Update HomeKit bridge configuration and reload.

        Args:
            entry_id: The config entry ID.
            include_domains: Domains to expose (HomeKit whitelist).
            exclude_entities: Entities to exclude from exposed domains.

        Raises:
            HomeKitError: If the entry is not found or update fails.
        """
        entry = self.hass.config_entries.async_get_entry(entry_id)
        if entry is None:
            raise HomeKitError(f"HomeKit entry not found: {entry_id}")

        if entry.domain != HOMEKIT_DOMAIN:
            raise HomeKitError(f"Entry {entry_id} is not a HomeKit entry")

        # Get current options
        current_options = dict(entry.options) if entry.options else {}
        current_filter = dict(current_options.get("filter", {}))

        # Update filter
        if include_domains is not None:
            current_filter["include_domains"] = include_domains
        if exclude_entities is not None:
            current_filter["exclude_entities"] = exclude_entities

        # Preserve include_entities and exclude_domains (we only manage domains and entity exclusions)
        new_options = {
            **current_options,
            "filter": current_filter,
        }

        # Update the entry
        try:
            self.hass.config_entries.async_update_entry(
                entry,
                options=new_options,
            )
            _LOGGER.info("Updated HomeKit bridge %s configuration", entry.title)
        except Exception as err:
            raise HomeKitError(f"Failed to update HomeKit entry: {err}") from err

        # Schedule reload in background so callers don't block waiting for HomeKit
        # to restart (which can hang if the port is temporarily in use)
        self.hass.async_create_task(
            self.hass.config_entries.async_reload(entry_id),
            "voice_assistant_manager_homekit_reload",
        )
        _LOGGER.info("HomeKit bridge %s reload scheduled", entry.title)
            # Don't raise - config was saved, reload might fail temporarily

    async def async_sync_from_voice_assistant_manager(self) -> dict[str, Any]:
        """Sync Voice Assistant Manager filter config to HomeKit bridge.

        Reads the Voice Assistant Manager homekit_filter_config and applies it
        to the selected HomeKit bridge.

        Returns:
            Dict with sync result (success, message, details).

        Raises:
            HomeKitError: If no bridge is configured or sync fails.
        """
        entry_id = self.storage.get_homekit_entry_id()
        if not entry_id:
            raise HomeKitError("No HomeKit bridge configured in Voice Assistant Manager")

        # Get current bridge config
        bridge_config = self.get_bridge_config(entry_id)
        if bridge_config is None:
            raise HomeKitError(f"HomeKit bridge {entry_id} not found")

        # Get Voice Assistant Manager filter config
        assistant_key = "homekit" if self.storage.mode != "linked" else None
        filter_config = self.storage.get_filter_config(assistant_key)

        filter_mode = filter_config.get("filter_mode", FILTER_MODE_EXCLUDE)
        vm_domains = set(filter_config.get("domains", []))
        vm_entities = set(filter_config.get("entities", []))
        vm_devices = filter_config.get("devices", [])
        vm_overrides = set(filter_config.get("overrides", []))

        # Expand devices to entities
        ent_reg = er.async_get(self.hass)
        device_entities = set()
        for device_id in vm_devices:
            for entity in ent_reg.entities.values():
                if entity.device_id == device_id and not entity.disabled:
                    device_entities.add(entity.entity_id)

        # HomeKit uses a whitelist model:
        # - include_domains: domains to expose
        # - exclude_entities: specific entities to hide from those domains

        if filter_mode == FILTER_MODE_EXCLUDE:
            # Exclude mode in VM -> HomeKit uses all supported domains minus excluded
            # include_domains = HOMEKIT_SUPPORTED_DOMAINS - vm_domains
            include_domains = list(HOMEKIT_SUPPORTED_DOMAINS - vm_domains)

            # exclude_entities = vm_entities + device_entities - overrides
            exclude_entities = (vm_entities | device_entities) - vm_overrides
            exclude_entities = list(exclude_entities)
        else:
            # Include mode in VM -> HomeKit uses exactly the selected domains
            # But only domains that HomeKit supports
            include_domains = list(vm_domains & HOMEKIT_SUPPORTED_DOMAINS)

            # In include mode, overrides are entities to EXCLUDE from included domains
            # exclude_entities = overrides
            exclude_entities = list(vm_overrides)

            # Note: vm_entities in include mode are explicit inclusions,
            # but HomeKit doesn't support include_entities well with include_domains
            # So we just use the domains and let entity-level exclusions work

        # Update HomeKit
        await self.async_update_bridge_config(
            entry_id,
            include_domains=sorted(include_domains),
            exclude_entities=sorted(exclude_entities),
        )

        return {
            "success": True,
            "message": f"Synced to HomeKit bridge: {bridge_config['title']}",
            "include_domains": sorted(include_domains),
            "exclude_entities": sorted(exclude_entities),
        }

    async def async_import_from_homekit(self) -> dict[str, Any]:
        """Import current HomeKit configuration into Voice Assistant Manager.

        Reads the HomeKit bridge config and imports it into
        Voice Assistant Manager's homekit_filter_config.

        Returns:
            Dict with import result.

        Raises:
            HomeKitError: If no bridge is configured.
        """
        entry_id = self.storage.get_homekit_entry_id()
        if not entry_id:
            raise HomeKitError("No HomeKit bridge configured in Voice Assistant Manager")

        bridge_config = self.get_bridge_config(entry_id)
        if bridge_config is None:
            raise HomeKitError(f"HomeKit bridge {entry_id} not found")

        hk_include_domains = set(bridge_config.get("include_domains", []))
        hk_exclude_entities = set(bridge_config.get("exclude_entities", []))

        # Determine filter mode based on HomeKit config
        # If include_domains contains most supported domains, it's likely exclude mode
        if len(hk_include_domains) >= len(HOMEKIT_SUPPORTED_DOMAINS) - 3:
            # Looks like exclude mode (most domains included)
            filter_mode = FILTER_MODE_EXCLUDE
            # Excluded domains = SUPPORTED - included
            vm_domains = list(HOMEKIT_SUPPORTED_DOMAINS - hk_include_domains)
            vm_entities = list(hk_exclude_entities)
            vm_overrides = []  # Can't determine overrides from HK config
        else:
            # Looks like include mode (selective domains)
            filter_mode = FILTER_MODE_INCLUDE
            vm_domains = list(hk_include_domains)
            vm_entities = []
            vm_overrides = list(hk_exclude_entities)  # Exclusions become overrides

        # Build filter config
        filter_config = {
            "filter_mode": filter_mode,
            "domains": vm_domains,
            "entities": vm_entities,
            "devices": [],
            "overrides": vm_overrides,
        }

        # Save to storage
        assistant_key = "homekit" if self.storage.mode != "linked" else None
        await self.storage.async_set_filter_config(filter_config, assistant_key)

        return {
            "success": True,
            "message": f"Imported from HomeKit bridge: {bridge_config['title']}",
            "filter_config": filter_config,
        }

    async def async_auto_detect_bridge(self) -> str | None:
        """Auto-detect the primary HomeKit bridge.

        Looks for a bridge with mode='bridge' (not accessory).
        If multiple bridges exist, returns the first one.

        Returns:
            Entry ID of detected bridge, or None.
        """
        bridges = self.get_homekit_bridges()

        if not bridges:
            _LOGGER.debug("No HomeKit bridges found")
            return None

        if len(bridges) == 1:
            _LOGGER.info("Auto-detected HomeKit bridge: %s", bridges[0]["title"])
            return bridges[0]["entry_id"]

        # Multiple bridges - return the first one (user can change later)
        _LOGGER.info(
            "Multiple HomeKit bridges found, using first: %s",
            bridges[0]["title"]
        )
        return bridges[0]["entry_id"]
