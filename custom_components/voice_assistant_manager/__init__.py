"""Voice Assistant Manager integration for Home Assistant.

This integration provides a sidebar panel to manage Google Assistant,
Amazon Alexa, and Apple HomeKit Smart Home exposure.
"""
from __future__ import annotations

import logging
from pathlib import Path
from typing import TYPE_CHECKING

from homeassistant.components import frontend
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .api import async_register_websocket_api
from .const import (
    DOMAIN,
    PANEL_ICON,
    PANEL_NAME,
    PANEL_TITLE,
    VERSION,
)
from .storage import VoiceAssistantManagerStorage

if TYPE_CHECKING:
    from homeassistant.helpers.typing import ConfigType

_LOGGER = logging.getLogger(__name__)

# Platforms this integration provides
PLATFORMS: list[Platform] = []


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Set up the Voice Assistant Manager component.

    Args:
        hass: Home Assistant instance.
        config: Configuration dictionary.

    Returns:
        True if setup was successful.
    """
    hass.data.setdefault(DOMAIN, {})
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Voice Assistant Manager from a config entry.

    Args:
        hass: Home Assistant instance.
        entry: Config entry being set up.

    Returns:
        True if setup was successful.
    """
    _LOGGER.debug("Setting up Voice Assistant Manager integration v%s", VERSION)

    # Store entry reference
    hass.data[DOMAIN]["entry"] = entry

    # Initialize storage
    storage = VoiceAssistantManagerStorage(hass)
    await storage.async_load()
    hass.data[DOMAIN]["storage"] = storage

    # Register static path for frontend
    await _async_register_panel(hass)

    # Register WebSocket API
    async_register_websocket_api(hass)

    # Register update listener for options
    entry.async_on_unload(entry.add_update_listener(async_update_options))

    _LOGGER.info("Voice Assistant Manager integration v%s setup complete", VERSION)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry.

    Args:
        hass: Home Assistant instance.
        entry: Config entry being unloaded.

    Returns:
        True if unload was successful.
    """
    _LOGGER.debug("Unloading Voice Assistant Manager integration")

    # Remove panel
    try:
        frontend.async_remove_panel(hass, PANEL_NAME)
    except Exception as err:
        _LOGGER.warning("Failed to remove panel: %s", err)

    # Clean up data
    if DOMAIN in hass.data:
        hass.data[DOMAIN].pop("storage", None)
        hass.data[DOMAIN].pop("entry", None)

    return True


async def async_update_options(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Handle options update.

    Args:
        hass: Home Assistant instance.
        entry: Config entry with updated options.
    """
    await hass.config_entries.async_reload(entry.entry_id)


async def _async_register_panel(hass: HomeAssistant) -> None:
    """Register the Voice Assistant Manager panel.

    Args:
        hass: Home Assistant instance.
    """
    # Frontend is bundled with the integration (compiled from src/ to dist/)
    frontend_path = Path(__file__).parent / "frontend" / "dist"

    if not frontend_path.exists():
        _LOGGER.error(
            "Voice Assistant Manager frontend not found at %s. "
            "Please reinstall the integration.",
            frontend_path,
        )
        return

    www_path = frontend_path
    _LOGGER.debug("Using frontend from: %s", www_path)

    # Register static path
    await hass.http.async_register_static_paths(
        [StaticPathConfig(f"/api/{DOMAIN}", str(www_path), cache_headers=False)]
    )

    # Register panel (admin only for security)
    frontend.async_register_built_in_panel(
        hass,
        component_name="custom",
        sidebar_title=PANEL_TITLE,
        sidebar_icon=PANEL_ICON,
        frontend_url_path=PANEL_NAME,
        config={
            "_panel_custom": {
                "name": "voice-assistant-manager-panel",
                "embed_iframe": False,
                "trust_external": False,
                "module_url": f"/api/{DOMAIN}/voice-assistant-manager-panel.js?v={VERSION}",
            }
        },
        require_admin=True,  # Security: Only admin users can access
    )

    _LOGGER.debug("Voice Assistant Manager panel registered")
