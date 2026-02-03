# Voice Assistant Manager for Home Assistant

[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)
[![GitHub Release](https://img.shields.io/github/release/mattiagosetto9/ha-voice-assistant-manager.svg)](https://github.com/mattiagosetto9/ha-voice-assistant-manager/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Home Assistant custom integration that provides a sidebar panel to manage **Google Assistant**, **Amazon Alexa**, and **Apple HomeKit** Smart Home exposure with flexible include/exclude workflows.

## Features

- **Flexible Filter Modes**: Choose between exclude-first (default) or include-first workflow
- **HomeKit Bridge Support**: Manage HomeKit Bridge entity exposure directly from Voice Assistant Manager
- **Voice Aliases**: Set custom voice names for entities without renaming them in Home Assistant
- **Linked or Separate Modes**: Share settings between assistants or manage them independently
- **Domain-Level Control**: Include/exclude entire domains with per-entity overrides
- **YAML Package Generation**: Automatically generates configuration files for Google Assistant and Alexa
- **Bulk Operations**: Quickly manage multiple entities, set alias prefixes/suffixes
- **Admin Only**: Panel access restricted to admin users for security

## Installation

### HACS (Recommended)

1. Open HACS in Home Assistant
2. Click on **Integrations**
3. Click the **three dots** menu in the top right corner
4. Select **Custom repositories**
5. Add the repository URL: `https://github.com/mattiagosetto9/ha-voice-assistant-manager`
6. Select category: **Integration**
7. Click **Add**
8. Search for "Voice Assistant Manager" and install it
9. Restart Home Assistant
10. Go to **Settings** → **Devices & Services** → **Add Integration** → **Voice Assistant Manager**

### Manual Installation

1. Download the latest release from the [releases page](https://github.com/mattiagosetto9/ha-voice-assistant-manager/releases)
2. Extract and copy the `custom_components/voice_assistant_manager` folder to your `config/custom_components/` directory
3. Restart Home Assistant
4. Go to **Settings** → **Devices & Services** → **Add Integration** → **Voice Assistant Manager**

## Configuration

### Enable Packages (Required for Google/Alexa)

Voice Assistant Manager generates YAML package files. To use them, you must enable packages in your `configuration.yaml`:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Create the packages directory if it doesn't exist:

```bash
mkdir -p config/packages
```

### First-Time Setup

1. After adding the integration, a new **Voice Assistant Manager** item will appear in your sidebar
2. Click on it to open the Voice Assistant Manager panel
3. Configure your Google Assistant, Alexa, and/or HomeKit settings in the **Settings** tab
4. Choose your filter mode (Exclude or Include) and select domains
5. Manage entity-level settings in the **Entities** tab
6. Click **Save & Generate** to apply the configuration
7. Restart Home Assistant to apply Google/Alexa changes (HomeKit syncs automatically)

## Usage

### Filter Modes

Voice Assistant Manager supports two filter modes:

| Mode | Description |
|------|-------------|
| **Exclude** (default) | All entities are exposed by default. Select domains/entities to hide. |
| **Include** | No entities are exposed by default. Select domains/entities to expose. |

### Overrides

Overrides allow you to make exceptions to domain-level rules:

- **In Exclude mode**: Override re-includes an entity that would be excluded by its domain
- **In Include mode**: Override excludes an entity that would be included by its domain

### Mode Selection

| Mode | Description |
|------|-------------|
| **Linked** | Exclusions, aliases, and filter settings are shared between all assistants |
| **Separate** | Manage each assistant (Google, Alexa, HomeKit) independently |

### Entities Tab

The Entities tab displays all your Home Assistant entities with options to:

| Feature | Description |
|---------|-------------|
| **Search** | Filter by name or entity ID |
| **Filter by Domain** | Show only specific entity types |
| **Filter by Area** | Show entities in a specific area |
| **Quick Filters** | Show only hidden, exposed, with aliases, or overrides |
| **Voice Alias** | Set custom names for voice control |
| **Override** | Toggle entity-level exceptions to domain rules |

### Settings Tab

Configure your voice assistant integrations:

#### Google Assistant Settings

| Setting | Description |
|---------|-------------|
| **Enabled** | Toggle to enable/disable |
| **Project ID** | Your Google Actions project ID |
| **Service Account Path** | Path to your service account JSON file (must be in `/config/`) |
| **Report State** | Enable state reporting to Google |
| **Secure Devices PIN** | Optional PIN for secure device operations |
| **Advanced YAML** | Additional configuration to inject |

#### Alexa Settings

| Setting | Description |
|---------|-------------|
| **Enabled** | Toggle to enable/disable |
| **Base Configuration** | Required YAML configuration (supports `!secret` references) |

#### HomeKit Bridge

| Setting | Description |
|---------|-------------|
| **Bridge Selection** | Choose which HomeKit bridge to manage |

HomeKit configuration is synced directly to the bridge's config entry - no YAML files needed.

### Footer Actions

| Button | Description |
|--------|-------------|
| **Preview YAML** | View the generated YAML before writing |
| **Save & Generate** | Generate YAML files and sync HomeKit |
| **Check Config** | Validate your Home Assistant configuration |
| **Restart HA** | Restart Home Assistant (needed for Google/Alexa changes) |

## Generated Files

Voice Assistant Manager generates the following files in your `config/packages/` directory:

### Google Assistant (`generated_google_assistant.yaml`)

```yaml
google_assistant:
  project_id: "your-project-id"
  service_account: !include ../service_account.json
  report_state: true
  entity_config:
    light.excluded_light:
      expose: false
    light.kitchen:
      name: "Kitchen Light"
```

### Alexa (`generated_alexa.yaml`)

```yaml
alexa:
  smart_home:
    locale: en-US
    filter:
      exclude_domains:
        - camera
      exclude_entities:
        - light.excluded_light
    entity_config:
      light.kitchen:
        name: "Kitchen Light"
```

## Security

Voice Assistant Manager implements several security measures:

- **Admin Only Access**: Only admin users can access the Voice Assistant Manager panel
- **Input Validation**: All inputs are validated and sanitized
- **Path Traversal Prevention**: File paths are strictly validated
- **Safe YAML Handling**: Dangerous YAML patterns are blocked
- **Restricted Service Account Path**: Must be within `/config/` directory

## Known Limitations

- **HomeKit Reload**: After syncing HomeKit, the bridge reloads which may briefly disconnect existing pairings.

## Troubleshooting

### Panel Not Appearing

- Ensure the integration is added in Settings → Devices & Services
- Clear your browser cache and reload
- Check Home Assistant logs for errors

### YAML Not Loading

- Verify packages are enabled in `configuration.yaml`
- Check that the `packages` directory exists
- Run "Check Config" to validate your configuration
- Check Home Assistant logs for errors

### Exclusions Not Working

- Ensure you've clicked "Save & Generate" after making changes
- Restart Home Assistant after writing files (for Google/Alexa)
- For HomeKit, changes are applied immediately after sync

### HomeKit Bridge Not Found

- Ensure you have HomeKit Bridge (not just HomeKit Controller) configured
- Only bridge mode entries are shown (not accessory mode)

## Development

### Frontend Development

The frontend is built with TypeScript and Lit. Sources are in `custom_components/voice_assistant_manager/frontend/src/`.

```bash
cd custom_components/voice_assistant_manager/frontend

# Install dependencies
npm install

# Build the bundle
npm run build

# Watch mode for development
npm run watch
```

The build output (`dist/voice-assistant-manager-panel.js`) is committed to the repository so HACS users don't need to build.

**CI/CD pipelines automatically:**
- Validate TypeScript and build on every PR
- Rebuild and commit the bundle when `src/` changes on main
- Build fresh bundle for releases (excluding dev files from zip)

### Project Structure

```
custom_components/voice_assistant_manager/
├── frontend/
│   ├── src/                 # TypeScript sources
│   │   ├── locales/         # i18n translations
│   │   ├── styles/          # CSS-in-JS styles
│   │   ├── types/           # TypeScript interfaces
│   │   ├── utils/           # Utility functions
│   │   └── voice-assistant-manager-panel.ts  # Main component
│   ├── dist/                # Compiled bundle (committed)
│   ├── package.json
│   ├── tsconfig.json
│   └── rollup.config.mjs
├── __init__.py              # Integration entry point
├── api.py                   # WebSocket API
├── storage.py               # Persistent storage
├── yaml_generator.py        # YAML file generation
├── homekit_manager.py       # HomeKit integration
└── ...
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. If you modified frontend sources, run `npm run build` in the frontend directory
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- [Report a Bug](https://github.com/mattiagosetto9/ha-voice-assistant-manager/issues/new?template=bug_report.md)
- [Request a Feature](https://github.com/mattiagosetto9/ha-voice-assistant-manager/issues/new?template=feature_request.md)

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a list of changes.
