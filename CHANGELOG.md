# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.7] - 2026-02-19

### Fixed

- **Mobile: HA topbar disappearing on scroll**: Added `overflow-x: hidden` to the panel host element so table content no longer causes page-level horizontal overflow. Mobile browsers hide the fixed HA header when the page scrolls horizontally; clipping at the host boundary prevents this while the inner table container still scrolls normally
- **Mobile: entities table going off-screen**: Footer buttons, bulk-action bar, and filter toggles now wrap (`flex-wrap: wrap`) on narrow screens instead of overflowing

## [1.2.6] - 2026-02-19

### Added

- Integration logo and icon (`icon.png` 256×256, `logo.png` full-size) for display in Home Assistant UI and HACS

## [1.2.5] - 2026-02-19

### Fixed

- **YAML preview shows stale data**: Preview now sends the current pending configuration to the backend, which applies it in-memory to generate the YAML without persisting anything to storage. Changes are only saved when the user explicitly clicks "Save" or "Save & Generate"

## [1.2.4] - 2026-02-19

### Fixed

- **YAML preview shows stale data**: (reverted - incorrect approach that saved to storage before previewing)

## [1.2.3] - 2026-02-19

### Fixed

- **"Save & Generate" button stays disabled indefinitely**: HomeKit bridge reload is now scheduled as a background task instead of blocking the WebSocket handler. Previously, if the HomeKit bridge was in an error state (e.g. port in use), `async_reload` would hang and the WS call would never return, freezing the UI

## [1.2.2] - 2026-02-19

### Fixed

- **Browser cache**: Frontend JS URL now includes version number (`?v=1.2.2`), ensuring the browser always loads the correct bundle after an update without requiring a manual cache clear

## [1.2.1] - 2026-02-19

### Fixed

- **Critical**: Fixed configuration being wiped (whitened) when saving in linked mode
  - `save_all` was sending all per-assistant filter configs even in linked mode, causing them to overwrite the shared `filter_config`
  - Frontend now sends only `filter_config`/`aliases` in linked mode, and only per-assistant configs in separate mode
- **Critical**: Fixed alias deletion not persisting via `save_all`
  - `async_set_aliases_bulk` used `.update()` (merge), so deleted aliases were never removed
  - `save_all` now uses `async_replace_aliases` which replaces the alias dict entirely
- Extracted `_buildSavePayload()` helper to eliminate duplicated payload logic between "Save" and "Generate Files"

## [1.2.0] - 2026-02-03

### Added

- **Smart contextual bulk actions menu**: Shows only relevant actions based on selected entities
- Visual indicators showing count of affected entities (e.g., "✓ Expose (3)")
- Emoji icons for quick visual identification of action types
- Input field now only appears when needed (for set alias action)

### Changed

- **Simplified bulk actions**: Removed confusing prefix/suffix alias options
- **Set Alias** now sets a complete alias name instead of concatenating with entity name
- Action labels more intuitive: "Expose/Hide" instead of "Add to/Remove from exclusions"
- Menu intelligently shows:
  - "Expose" only for hidden entities
  - "Hide" only for exposed entities  
  - "Remove override" only for entities with overrides
  - "Clear alias" only for entities with aliases

### Removed

- Removed "Add alias prefix" action (confusing and rarely useful)
- Removed "Add alias suffix" action (confusing and rarely useful)

## [1.1.1] - 2026-02-03

### Fixed

- **Critical**: Fixed 403 Forbidden error when reloading the panel page
- Changed static path from `/voice-assistant-manager` to `/api/voice_assistant_manager`
- Panel now uses standard API authentication path preventing access errors
- Updated VERSION constant to 1.1.0 in const.py

## [1.1.0] - 2026-02-03

### Added

- **Draft Mode**: All changes are now saved locally in memory before committing
- **Unsaved Changes Indicator**: Visual warning in footer when changes are pending
- **Discard Changes Button**: Quick revert to last saved state
- **Confirmation Dialog**: Warns when switching tabs with unsaved changes
- **Batch Save Endpoint**: New `save_all` API endpoint saves all configs at once

### Changed

- Entity modifications (domains, overrides, aliases) no longer auto-save
- Settings changes no longer trigger immediate API calls
- "Save & Generate" button now saves pending changes before generating files
- Improved UX: users have explicit control over when changes are persisted

### Fixed

- Prevents accidental data loss from immediate auto-save behavior
- Reduces unnecessary API calls during bulk editing sessions

## [1.0.0] - 2026-02-03

### Added

- Initial release
- Sidebar panel for managing voice assistant entity exposure
- Support for **Google Assistant**, **Amazon Alexa**, and **Apple HomeKit**
- Flexible filter modes: **Exclude** (default) or **Include** workflow
- **Linked mode**: Share settings between all assistants
- **Separate mode**: Manage each assistant independently
- Domain-level control with per-entity overrides
- Voice alias support for custom entity names
- Bulk operations (exclude, include, prefix, suffix, clear alias)
- YAML package generation for Google Assistant and Alexa
- Direct HomeKit Bridge configuration sync
- Preview YAML before writing
- Configuration check and restart buttons
- Admin-only panel access
- Multi-language support (English, Italian)

### Technical

- Frontend built with TypeScript and Lit 3.x (bundled, no CDN)
- Modular code structure (styles, locales, types separated)
- Automated CI/CD pipelines:
  - HACS and Hassfest validation
  - Python linting with Ruff
  - TypeScript validation and build
  - Automatic bundle rebuild on source changes
  - Release automation with versioned zip files

### Security

- All WebSocket endpoints require admin privileges
- Input validation and sanitization on all fields
- Path traversal prevention for file operations
- Dangerous YAML patterns blocked
- Service account path restricted to `/config/` directory
