/**
 * Home Assistant types for Voice Manager
 */

export interface HassEntity {
  state: string;
  attributes: Record<string, unknown>;
  entity_id: string;
  last_changed: string;
  last_updated: string;
}

export interface HomeAssistant {
  language: string;
  callWS: <T>(msg: { type: string; [key: string]: unknown }) => Promise<T>;
  states: Record<string, HassEntity>;
  services: Record<string, Record<string, unknown>>;
  user?: {
    id: string;
    name: string;
    is_admin: boolean;
  };
}
