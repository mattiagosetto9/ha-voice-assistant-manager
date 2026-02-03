/**
 * Voice Manager specific types
 */

export type FilterMode = 'exclude' | 'include';
export type AssistantMode = 'linked' | 'separate';
export type Platform = 'google' | 'alexa' | 'homekit';

export interface FilterConfig {
  filter_mode: FilterMode;
  domains: string[];
  entities: string[];
  devices: string[];
  overrides: string[];
}

export interface GoogleSettings {
  enabled: boolean;
  project_id: string;
  service_account_path: string;
  report_state: boolean;
  secure_devices_pin: string;
  advanced_yaml: string;
}

export interface AlexaSettings {
  enabled: boolean;
  advanced_yaml: string;
}

export interface Entity {
  entity_id: string;
  name: string;
  domain: string;
  device_id: string | null;
  device_name: string | null;
  area_id: string | null;
  area_name: string | null;
  platform: string;
}

export interface Device {
  id: string;
  name: string;
  area_id: string | null;
  area_name: string | null;
  manufacturer: string | null;
  model: string | null;
}

export interface Area {
  id: string;
  name: string;
}

export interface HomeKitBridge {
  entry_id: string;
  title: string;
  port: number;
  name: string;
  include_domains: string[];
  exclude_entities: string[];
}

export interface VoiceManagerState {
  mode: AssistantMode;
  filter_config: FilterConfig;
  aliases: Record<string, string>;
  google_filter_config: FilterConfig;
  google_aliases: Record<string, string>;
  alexa_filter_config: FilterConfig;
  alexa_aliases: Record<string, string>;
  homekit_filter_config: FilterConfig;
  homekit_entry_id: string | null;
  google_settings: GoogleSettings;
  alexa_settings: AlexaSettings;
  last_generated: {
    google: string | null;
    alexa: string | null;
    homekit: string | null;
  };
  google_complete: boolean;
  alexa_complete: boolean;
  homekit_complete: boolean;
  entities: Entity[];
  devices: Device[];
  areas: Area[];
  domains: string[];
  homekit_bridges: HomeKitBridge[];
  homekit_supported_domains: string[];
}

export interface Filters {
  search: string;
  domains: string[];
  area: string;
  device: string;
  onlyExcluded: boolean;
  onlyNotExcluded: boolean;
  onlyWithAlias: boolean;
  onlyOverrides: boolean;
}

export interface ExposureResult {
  exposed: boolean;
  reason: '' | 'domain' | 'entity' | 'device' | 'override';
}

export interface PreviewContent {
  google?: {
    yaml: string;
    warnings: string[];
    complete: boolean;
  };
  alexa?: {
    yaml: string;
    warnings: string[];
    complete: boolean;
  };
}

export interface WriteResult {
  google: { written: boolean; error: string | null };
  alexa: { written: boolean; error: string | null };
  homekit: { written: boolean; error: string | null };
}
