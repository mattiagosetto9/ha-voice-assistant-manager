/**
 * Voice Manager Panel for Home Assistant
 * 
 * A LitElement-based panel for managing Google Assistant, Alexa, and HomeKit
 * Smart Home exposure with include/exclude workflow.
 * 
 * @version 1.0.0
 * @license MIT
 */

import { LitElement, html, css, CSSResultGroup, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { createTranslator, TranslateFunction } from './locales';
import { debounce, escapeHtml } from './utils';
import {
  sharedStyles,
  headerStyles,
  tabStyles,
  cardStyles,
  tableStyles,
  paginationStyles,
  filterStyles,
  bulkActionsStyles,
  settingsStyles,
  dialogStyles,
  footerStyles,
} from './styles';
import type {
  HomeAssistant,
  VoiceManagerState,
  FilterConfig,
  FilterMode,
  GoogleSettings,
  AlexaSettings,
  Entity,
  Area,
  HomeKitBridge,
  Filters,
  ExposureResult,
  PreviewContent,
  Platform,
} from './types';

const DEFAULT_FILTER_CONFIG: FilterConfig = {
  filter_mode: 'exclude',
  domains: [],
  entities: [],
  devices: [],
  overrides: [],
};

@customElement('voice-assistant-manager-panel')
export class VoiceAssistantManagerPanel extends LitElement {
  @property({ attribute: false }) hass!: HomeAssistant;
  @property({ type: Boolean }) narrow = false;
  @property({ attribute: false }) panel: unknown;

  @state() private _state: VoiceManagerState | null = null;
  @state() private _loading = true;
  @state() private _error: string | null = null;
  @state() private _activeTab = 'entities';
  @state() private _selectedEntities: string[] = [];
  @state() private _filters: Filters = {
    search: '',
    domains: [],
    area: '',
    device: '',
    onlyExcluded: false,
    onlyNotExcluded: false,
    onlyWithAlias: false,
    onlyOverrides: false,
  };
  @state() private _previewDialog = false;
  @state() private _previewContent: PreviewContent | null = null;
  @state() private _bulkActionValue = '';
  @state() private _saving = false;
  @state() private _currentPage = 1;
  @state() private _pageSize = 50;
  @state() private _activePlatform: Platform = 'google';
  @state() private _domainsExpanded = false;
  @state() private _pendingGoogleSettings: Partial<GoogleSettings> | null = null;
  @state() private _pendingAlexaSettings: Partial<AlexaSettings> | null = null;
  @state() private _pendingHomekitBridge: string | null = null;
  @state() private _pendingFilterConfig: FilterConfig | null = null;
  @state() private _pendingGoogleFilterConfig: FilterConfig | null = null;
  @state() private _pendingAlexaFilterConfig: FilterConfig | null = null;
  @state() private _pendingHomekitFilterConfig: FilterConfig | null = null;
  @state() private _pendingAliases: Record<string, string> | null = null;
  @state() private _pendingGoogleAliases: Record<string, string> | null = null;
  @state() private _pendingAlexaAliases: Record<string, string> | null = null;
  @state() private _hasUnsavedChanges = false;
  @state() private _showUnsavedDialog = false;
  @state() private _pendingTabSwitch: string | null = null;

  private _debouncedSearch: (value: string) => void;

  static styles: CSSResultGroup = [
    sharedStyles,
    headerStyles,
    tabStyles,
    cardStyles,
    tableStyles,
    paginationStyles,
    filterStyles,
    bulkActionsStyles,
    settingsStyles,
    dialogStyles,
    footerStyles,
    css`
      :host {
        display: block;
        padding: 16px;
      }

      @media (max-width: 768px) {
        :host {
          padding: 8px;
        }

        .filters {
          padding: 12px;
        }

        .filter-item input,
        .filter-item select {
          min-width: 120px;
        }

        .settings-grid {
          grid-template-columns: 1fr;
        }

        .table-scroll {
          max-height: 400px;
        }

        .entity-table {
          min-width: 700px;
        }
      }
    `,
  ];

  constructor() {
    super();
    this._debouncedSearch = debounce((value: string) => {
      this._filters = { ...this._filters, search: value };
      this._currentPage = 1;
    }, 300);
  }

  private get _t(): TranslateFunction {
    return createTranslator(this.hass?.language);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._loadState();
  }

  private async _loadState(): Promise<void> {
    this._loading = true;
    this._error = null;
    try {
      const result = await this.hass.callWS<VoiceManagerState>({
        type: 'voice_assistant_manager/get_state',
      });
      this._state = result;
      
      // Initialize pending settings
      this._pendingGoogleSettings = { ...(result.google_settings || {}) };
      this._pendingAlexaSettings = { ...(result.alexa_settings || {}) };
      this._pendingHomekitBridge = result.homekit_entry_id || '';
      
      // Initialize pending filter configs
      this._pendingFilterConfig = { ...(result.filter_config || DEFAULT_FILTER_CONFIG) };
      this._pendingGoogleFilterConfig = { ...(result.google_filter_config || DEFAULT_FILTER_CONFIG) };
      this._pendingAlexaFilterConfig = { ...(result.alexa_filter_config || DEFAULT_FILTER_CONFIG) };
      this._pendingHomekitFilterConfig = { ...(result.homekit_filter_config || DEFAULT_FILTER_CONFIG) };
      
      // Initialize pending aliases
      this._pendingAliases = { ...(result.aliases || {}) };
      this._pendingGoogleAliases = { ...(result.google_aliases || {}) };
      this._pendingAlexaAliases = { ...(result.alexa_aliases || {}) };
      
      // Reset unsaved changes flag
      this._hasUnsavedChanges = false;
    } catch (error) {
      console.error('Failed to load state:', error);
      this._error = (error as Error).message || 'Failed to load Voice Manager state';
    }
    this._loading = false;
  }

  private _getCurrentFilterConfig(): FilterConfig {
    if (!this._state) return DEFAULT_FILTER_CONFIG;
    
    if (this._state.mode === 'linked') {
      return this._pendingFilterConfig || DEFAULT_FILTER_CONFIG;
    }
    
    if (this._activePlatform === 'google') {
      return this._pendingGoogleFilterConfig || DEFAULT_FILTER_CONFIG;
    } else if (this._activePlatform === 'alexa') {
      return this._pendingAlexaFilterConfig || DEFAULT_FILTER_CONFIG;
    } else {
      return this._pendingHomekitFilterConfig || DEFAULT_FILTER_CONFIG;
    }
  }

  private _getCurrentAliases(): Record<string, string> {
    if (!this._state) return {};
    if (this._state.mode === 'linked') {
      return this._pendingAliases || {};
    }
    if (this._activePlatform === 'google') {
      return this._pendingGoogleAliases || {};
    } else if (this._activePlatform === 'alexa') {
      return this._pendingAlexaAliases || {};
    }
    return {};
  }

  private _isEntityExposed(entity: Entity): ExposureResult {
    const config = this._getCurrentFilterConfig();
    const filterMode = config.filter_mode || 'exclude';
    const domains = config.domains || [];
    const entities = config.entities || [];
    const overrides = config.overrides || [];
    
    const entityDomain = entity.entity_id.split('.')[0];
    const isOverride = overrides.includes(entity.entity_id);
    const isDomainMatch = domains.includes(entityDomain);
    const isEntityMatch = entities.includes(entity.entity_id);
    
    if (filterMode === 'exclude') {
      if (isOverride) return { exposed: true, reason: 'override' };
      if (isDomainMatch) return { exposed: false, reason: 'domain' };
      if (isEntityMatch) return { exposed: false, reason: 'entity' };
      return { exposed: true, reason: '' };
    } else {
      if (isOverride) return { exposed: false, reason: 'override' };
      if (isDomainMatch) return { exposed: true, reason: 'domain' };
      if (isEntityMatch) return { exposed: true, reason: 'entity' };
      return { exposed: false, reason: '' };
    }
  }

  private _getFilteredEntities(): Entity[] {
    if (!this._state?.entities) return [];

    let entities = [...this._state.entities];
    const aliases = this._getCurrentAliases();

    if (this._filters.search) {
      const search = this._filters.search.toLowerCase();
      entities = entities.filter(
        (e) =>
          e.entity_id.toLowerCase().includes(search) ||
          (e.name && e.name.toLowerCase().includes(search))
      );
    }

    if (this._filters.domains && this._filters.domains.length > 0) {
      entities = entities.filter((e) =>
        this._filters.domains.includes(e.domain)
      );
    }

    if (this._filters.area) {
      entities = entities.filter((e) => e.area_id === this._filters.area);
    }

    if (this._filters.device) {
      entities = entities.filter((e) => e.device_id === this._filters.device);
    }

    if (this._filters.onlyExcluded) {
      entities = entities.filter((e) => !this._isEntityExposed(e).exposed);
    }

    if (this._filters.onlyNotExcluded) {
      entities = entities.filter((e) => this._isEntityExposed(e).exposed);
    }

    if (this._filters.onlyWithAlias) {
      entities = entities.filter((e) => aliases[e.entity_id]);
    }

    if (this._filters.onlyOverrides) {
      const config = this._getCurrentFilterConfig();
      const overrides = config.overrides || [];
      entities = entities.filter((e) => overrides.includes(e.entity_id));
    }

    return entities;
  }

  private async _setMode(mode: string): Promise<void> {
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_mode',
        mode: mode,
      });
      this._state = { ...this._state!, mode: mode as 'linked' | 'separate' };
    } catch (error) {
      console.error('Failed to set mode:', error);
      this._showError('Failed to set mode: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private _setFilterMode(filterMode: string): void {
    const config = this._getCurrentFilterConfig();
    config.filter_mode = filterMode as FilterMode;
    
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _toggleDomain(domain: string): void {
    const config = this._getCurrentFilterConfig();
    const domains = new Set(config.domains || []);
    
    if (domains.has(domain)) {
      domains.delete(domain);
    } else {
      domains.add(domain);
    }
    
    config.domains = Array.from(domains);
    
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _selectAllDomains(): void {
    const allDomains = this._state?.domains || [];
    const config = this._getCurrentFilterConfig();
    config.domains = [...allDomains];
    
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _deselectAllDomains(): void {
    const config = this._getCurrentFilterConfig();
    config.domains = [];
    
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _toggleOverride(entityId: string): void {
    const config = this._getCurrentFilterConfig();
    const overrides = new Set(config.overrides || []);
    
    if (overrides.has(entityId)) {
      overrides.delete(entityId);
    } else {
      overrides.add(entityId);
    }
    
    config.overrides = Array.from(overrides);
    
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _toggleSelectAllPage(e: Event, pageEntities: Entity[]): void {
    const target = e.target as HTMLInputElement;
    if (target.checked) {
      const pageIds = pageEntities.map((e) => e.entity_id);
      const newSelection = new Set([...this._selectedEntities, ...pageIds]);
      this._selectedEntities = Array.from(newSelection);
    } else {
      const pageIds = new Set(pageEntities.map((e) => e.entity_id));
      this._selectedEntities = this._selectedEntities.filter(id => !pageIds.has(id));
    }
  }

  private _toggleSelectEntity(entityId: string, checked: boolean): void {
    if (checked) {
      this._selectedEntities = [...this._selectedEntities, entityId];
    } else {
      this._selectedEntities = this._selectedEntities.filter(
        (id) => id !== entityId
      );
    }
  }

  private _openEntity(entityId: string): void {
    const event = new CustomEvent('hass-more-info', {
      detail: { entityId },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _setAlias(entityId: string, alias: string): void {
    const aliases = { ...this._getCurrentAliases() };
    if (alias) {
      aliases[entityId] = alias;
    } else {
      delete aliases[entityId];
    }
    
    if (this._state?.mode === 'linked') {
      this._pendingAliases = { ...aliases };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleAliases = { ...aliases };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaAliases = { ...aliases };
    }
    
    this._hasUnsavedChanges = true;
  }

  private _bulkAction(action: string): void {
    if (this._selectedEntities.length === 0) return;

    const config = this._getCurrentFilterConfig();
    const aliases = this._getCurrentAliases();

    if (action === 'exclude') {
      const current_entities = new Set(config.entities || []);
      this._selectedEntities.forEach(id => current_entities.add(id));
      config.entities = Array.from(current_entities);
    } else if (action === 'unexclude') {
      const current_entities = new Set(config.entities || []);
      this._selectedEntities.forEach(id => current_entities.delete(id));
      config.entities = Array.from(current_entities);
    } else if (action === 'add_override') {
      const current_overrides = new Set(config.overrides || []);
      this._selectedEntities.forEach(id => current_overrides.add(id));
      config.overrides = Array.from(current_overrides);
    } else if (action === 'remove_override') {
      const current_overrides = new Set(config.overrides || []);
      this._selectedEntities.forEach(id => current_overrides.delete(id));
      config.overrides = Array.from(current_overrides);
    } else if (action === 'set_alias') {
      // Imposta lo stesso alias per tutte le entità selezionate
      if (!this._bulkActionValue.trim()) {
        alert(this._t('aliasRequired') || 'Please enter an alias');
        return;
      }
      this._selectedEntities.forEach(entityId => {
        aliases[entityId] = this._bulkActionValue.trim();
      });
    } else if (action === 'clear_alias') {
      this._selectedEntities.forEach(entityId => {
        delete aliases[entityId];
      });
    } else if (action === 'exclude_domain') {
      const domains = new Set(config.domains || []);
      this._selectedEntities.forEach(entityId => {
        const domain = entityId.split('.')[0];
        domains.add(domain);
      });
      config.domains = Array.from(domains);
    } else if (action === 'exclude_device') {
      const entities = this._state?.entities || [];
      const devices = new Set(config.devices || []);
      this._selectedEntities.forEach(entityId => {
        const entity = entities.find(e => e.entity_id === entityId);
        if (entity?.device_id) {
          devices.add(entity.device_id);
        }
      });
      config.devices = Array.from(devices);
    }

    // Update pending state
    if (this._state?.mode === 'linked') {
      this._pendingFilterConfig = { ...config };
      this._pendingAliases = { ...aliases };
    } else if (this._activePlatform === 'google') {
      this._pendingGoogleFilterConfig = { ...config };
      this._pendingGoogleAliases = { ...aliases };
    } else if (this._activePlatform === 'alexa') {
      this._pendingAlexaFilterConfig = { ...config };
      this._pendingAlexaAliases = { ...aliases };
    } else {
      this._pendingHomekitFilterConfig = { ...config };
    }

    this._hasUnsavedChanges = true;
    this._selectedEntities = [];
    this._bulkActionValue = '';
  }

  private _buildSavePayload(): Record<string, unknown> {
    const payload: Record<string, unknown> = {};
    const isLinked = this._state?.mode === 'linked';

    if (isLinked) {
      // Linked mode: only shared config
      if (this._pendingFilterConfig) payload.filter_config = this._pendingFilterConfig;
      if (this._pendingAliases) payload.aliases = this._pendingAliases;
    } else {
      // Separate mode: only per-assistant configs
      if (this._pendingGoogleFilterConfig) payload.google_filter_config = this._pendingGoogleFilterConfig;
      if (this._pendingAlexaFilterConfig) payload.alexa_filter_config = this._pendingAlexaFilterConfig;
      if (this._pendingHomekitFilterConfig) payload.homekit_filter_config = this._pendingHomekitFilterConfig;
      if (this._pendingGoogleAliases) payload.google_aliases = this._pendingGoogleAliases;
      if (this._pendingAlexaAliases) payload.alexa_aliases = this._pendingAlexaAliases;
    }

    // Settings (always)
    if (this._pendingGoogleSettings) payload.google_settings = this._pendingGoogleSettings;
    if (this._pendingAlexaSettings) payload.alexa_settings = this._pendingAlexaSettings;

    // HomeKit bridge (only if changed)
    const currentBridge = this._state?.homekit_entry_id || '';
    if (this._pendingHomekitBridge !== currentBridge) {
      payload.homekit_entry_id = this._pendingHomekitBridge || null;
    }

    return payload;
  }

  private async _saveAllSettings(): Promise<void> {
    this._saving = true;
    try {
      const payload = {
        type: 'voice_assistant_manager/save_all',
        ...this._buildSavePayload(),
      };

      await this.hass.callWS(payload as { type: string; [key: string]: unknown });
      await this._loadState();
      this._hasUnsavedChanges = false;
      alert(this._t('settingsSaved'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      this._showError('Failed to save settings: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private _discardChanges(): void {
    if (!this._state) return;
    
    // Reset all pending states to saved state
    this._pendingFilterConfig = { ...(this._state.filter_config || DEFAULT_FILTER_CONFIG) };
    this._pendingGoogleFilterConfig = { ...(this._state.google_filter_config || DEFAULT_FILTER_CONFIG) };
    this._pendingAlexaFilterConfig = { ...(this._state.alexa_filter_config || DEFAULT_FILTER_CONFIG) };
    this._pendingHomekitFilterConfig = { ...(this._state.homekit_filter_config || DEFAULT_FILTER_CONFIG) };
    
    this._pendingAliases = { ...(this._state.aliases || {}) };
    this._pendingGoogleAliases = { ...(this._state.google_aliases || {}) };
    this._pendingAlexaAliases = { ...(this._state.alexa_aliases || {}) };
    
    this._pendingGoogleSettings = { ...(this._state.google_settings || {}) };
    this._pendingAlexaSettings = { ...(this._state.alexa_settings || {}) };
    this._pendingHomekitBridge = this._state.homekit_entry_id || '';
    
    this._hasUnsavedChanges = false;
    this._showUnsavedDialog = false;
  }

  private _handleTabSwitch(newTab: string): void {
    if (this._hasUnsavedChanges) {
      this._pendingTabSwitch = newTab;
      this._showUnsavedDialog = true;
    } else {
      this._activeTab = newTab;
    }
  }

  private _confirmTabSwitch(): void {
    if (this._pendingTabSwitch) {
      this._activeTab = this._pendingTabSwitch;
      this._pendingTabSwitch = null;
    }
    this._showUnsavedDialog = false;
    this._hasUnsavedChanges = false;
  }

  private _cancelTabSwitch(): void {
    this._showUnsavedDialog = false;
    this._pendingTabSwitch = null;
  }

  private _updatePendingGoogle(key: keyof GoogleSettings, value: unknown): void {
    this._pendingGoogleSettings = {
      ...this._pendingGoogleSettings,
      [key]: value,
    };
    this._hasUnsavedChanges = true;
  }

  private _updatePendingAlexa(key: keyof AlexaSettings, value: unknown): void {
    this._pendingAlexaSettings = {
      ...this._pendingAlexaSettings,
      [key]: value,
    };
    this._hasUnsavedChanges = true;
  }

  private async _previewYAML(): Promise<void> {
    try {
      const result = await this.hass.callWS<PreviewContent>({
        type: 'voice_assistant_manager/preview_yaml',
      });
      this._previewContent = result;
      this._previewDialog = true;
    } catch (error) {
      console.error('Failed to preview YAML:', error);
      this._showError('Failed to preview YAML: ' + (error as Error).message);
    }
  }

  private async _writeFiles(): Promise<void> {
    this._saving = true;
    try {
      // First, save all pending changes if any
      if (this._hasUnsavedChanges) {
        const payload = {
          type: 'voice_assistant_manager/save_all',
          ...this._buildSavePayload(),
        };

        await this.hass.callWS(payload as { type: string; [key: string]: unknown });
        this._hasUnsavedChanges = false;
      }
      
      // Then write files
      const result = await this.hass.callWS<{
        google: { written: boolean; error: string | null };
        alexa: { written: boolean; error: string | null };
        homekit: { written: boolean; error: string | null };
      }>({
        type: 'voice_assistant_manager/write_files',
      });
      
      let message = this._t('configSaved') + '\n';
      if (result.google?.written) message += '- ' + this._t('googleOk') + '\n';
      else if (result.google?.error) message += `- Google Assistant: ${result.google.error}\n`;
      if (result.alexa?.written) message += '- ' + this._t('alexaOk') + '\n';
      else if (result.alexa?.error) message += `- Alexa: ${result.alexa.error}\n`;
      if (result.homekit?.written) message += '- ' + this._t('homekitOk') + '\n';
      else if (result.homekit?.error) message += `- HomeKit: ${result.homekit.error}\n`;
      
      alert(message);
      await this._loadState();
    } catch (error) {
      console.error('Failed to write files:', error);
      this._showError('Failed to write files: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private async _checkConfig(): Promise<void> {
    this._saving = true;
    try {
      const result = await this.hass.callWS<{ success: boolean; error?: string }>({
        type: 'voice_assistant_manager/check_config',
      });
      if (result.success) {
        alert(this._t('configValid'));
      } else {
        alert(this._t('configError') + ': ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Failed to check config:', error);
      alert('Failed to check config: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private async _restartHA(): Promise<void> {
    if (!confirm(this._t('restartConfirm'))) {
      return;
    }
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/restart',
      });
      alert(this._t('restarting'));
    } catch (error) {
      console.error('Failed to restart:', error);
      alert('Failed to restart: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private _showError(message: string): void {
    alert(message);
  }

  render(): TemplateResult {
    if (this._loading) {
      return html`
        <div class="loading-container">
          <div class="spinner"></div>
          <p>${this._t('loading')}</p>
        </div>
      `;
    }

    if (this._error) {
      return html`
        <div class="error-container">
          <p>${this._t('error')}: ${this._error}</p>
          <button class="btn btn-primary" @click=${this._loadState}>
            ${this._t('retry')}
          </button>
        </div>
      `;
    }

    const isSeparateMode = this._state?.mode === 'separate';
    const filterConfig = this._getCurrentFilterConfig();
    const filterMode = filterConfig.filter_mode || 'exclude';

    return html`
      <div class="header">
        <div class="header-left">
          <h1>${this._t('title')}</h1>
          <div class="mode-select">
            <label>${this._t('mode')}:</label>
            <select
              @change=${(e: Event) => this._setMode((e.target as HTMLSelectElement).value)}
              .value=${this._state?.mode || 'linked'}
              ?disabled=${this._saving}
            >
              <option value="linked">${this._t('linked')}</option>
              <option value="separate">${this._t('separate')}</option>
            </select>
          </div>
          ${isSeparateMode ? html`
            <div class="platform-tabs">
              <button 
                class="platform-tab google ${this._activePlatform === 'google' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'google'}
              >Google</button>
              <button 
                class="platform-tab alexa ${this._activePlatform === 'alexa' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'alexa'}
              >Alexa</button>
              <button 
                class="platform-tab homekit ${this._activePlatform === 'homekit' ? 'active' : ''}"
                @click=${() => this._activePlatform = 'homekit'}
              >HomeKit</button>
            </div>
          ` : ''}
          <div class="filter-mode-toggle">
            <label>
              <input 
                type="radio" 
                name="filterMode" 
                value="exclude"
                .checked=${filterMode === 'exclude'}
                @change=${() => this._setFilterMode('exclude')}
                ?disabled=${this._saving}
              />
              ${this._t('exclude')}
            </label>
            <label>
              <input 
                type="radio" 
                name="filterMode" 
                value="include"
                .checked=${filterMode === 'include'}
                @change=${() => this._setFilterMode('include')}
                ?disabled=${this._saving}
              />
              ${this._t('include')}
            </label>
          </div>
        </div>
      </div>

      <div class="tabs">
        <div
          class="tab ${this._activeTab === 'entities' ? 'active' : ''}"
          @click=${() => this._handleTabSwitch('entities')}
        >
          ${this._t('entities')}
        </div>
        <div
          class="tab ${this._activeTab === 'settings' ? 'active' : ''}"
          @click=${() => this._handleTabSwitch('settings')}
        >
          ${this._t('settings')}
        </div>
      </div>

      <div class="content">
        ${this._activeTab === 'entities'
          ? this._renderEntitiesTab()
          : this._renderSettingsTab()}
      </div>

      ${this._renderFooter()}
      ${this._showUnsavedDialog ? this._renderUnsavedDialog() : ''}
      ${this._previewDialog ? this._renderPreviewDialog() : ''}
    `;
  }

  private _renderDomainCard(): TemplateResult {
    const filterConfig = this._getCurrentFilterConfig();
    const filterMode = filterConfig.filter_mode || 'exclude';
    const selectedDomains = new Set(filterConfig.domains || []);
    const allDomains = this._state?.domains || [];

    return html`
      <div class="domain-card">
        <div 
          class="domain-card-header"
          @click=${() => this._domainsExpanded = !this._domainsExpanded}
        >
          <h3>
            ${filterMode === 'exclude' ? this._t('domainsToExclude') : this._t('domainsToInclude')}
            (${selectedDomains.size} ${this._t('selected')})
          </h3>
          <span class="toggle-icon ${this._domainsExpanded ? 'expanded' : ''}">
            ▼
          </span>
        </div>
        ${this._domainsExpanded ? html`
          <div class="domain-grid">
            ${allDomains.map(domain => html`
              <div 
                class="domain-item ${selectedDomains.has(domain) ? 'selected' : ''}"
                @click=${() => this._toggleDomain(domain)}
              >
                <input 
                  type="checkbox" 
                  .checked=${selectedDomains.has(domain)}
                  @click=${(e: Event) => e.stopPropagation()}
                  @change=${() => this._toggleDomain(domain)}
                />
                ${domain}
              </div>
            `)}
          </div>
          <div class="domain-actions">
            <button @click=${this._selectAllDomains}>${this._t('selectAll')}</button>
            <button @click=${this._deselectAllDomains}>${this._t('deselectAll')}</button>
          </div>
        ` : ''}
      </div>
    `;
  }

  private _renderEntitiesTab(): TemplateResult {
    const filteredEntities = this._getFilteredEntities();
    const aliases = this._getCurrentAliases();
    const filterConfig = this._getCurrentFilterConfig();
    const overrides = new Set(filterConfig.overrides || []);

    const totalPages = Math.ceil(filteredEntities.length / this._pageSize);
    const currentPage = Math.min(this._currentPage, totalPages || 1);
    const startIndex = (currentPage - 1) * this._pageSize;
    const endIndex = startIndex + this._pageSize;
    const paginatedEntities = filteredEntities.slice(startIndex, endIndex);

    return html`
      ${this._renderDomainCard()}
      ${this._renderFilters()}
      ${this._selectedEntities.length > 0 ? this._renderBulkActions() : ''}

      <div class="entity-table-container">
        <div class="table-scroll">
          <table class="entity-table">
            <thead>
              <tr>
                <th style="width: 40px">
                  <input
                    type="checkbox"
                    @change=${(e: Event) => this._toggleSelectAllPage(e, paginatedEntities)}
                    .checked=${paginatedEntities.length > 0 && 
                      paginatedEntities.every(e => this._selectedEntities.includes(e.entity_id))}
                  />
                </th>
                <th style="width: 80px">${this._t('status')}</th>
                <th style="width: 70px">${this._t('override')}</th>
                <th style="width: 180px">${this._t('voiceAlias')}</th>
                <th>${this._t('name')}</th>
                <th style="width: 100px">${this._t('domain')}</th>
                <th style="width: 120px">${this._t('area')}</th>
                <th style="width: 100px">${this._t('reason')}</th>
              </tr>
            </thead>
            <tbody>
              ${paginatedEntities.length === 0
                ? html`
                    <tr>
                      <td colspan="8" class="no-results">
                        ${this._t('noResults')}
                      </td>
                    </tr>
                  `
                : paginatedEntities.map((entity) => {
                    const { exposed, reason } = this._isEntityExposed(entity);
                    const alias = aliases[entity.entity_id] || '';
                    const isSelected = this._selectedEntities.includes(entity.entity_id);
                    const isOverride = overrides.has(entity.entity_id);
                    const showOverride = reason === 'domain';

                    return html`
                      <tr class="${!exposed ? 'excluded' : ''} ${isOverride ? 'override' : ''}">
                        <td>
                          <input
                            type="checkbox"
                            .checked=${isSelected}
                            @change=${(e: Event) =>
                              this._toggleSelectEntity(entity.entity_id, (e.target as HTMLInputElement).checked)}
                          />
                        </td>
                        <td>
                          <span class="status-badge ${exposed ? 'exposed' : 'excluded'} ${isOverride ? 'override' : ''}">
                            ${exposed ? this._t('exposed') : this._t('hidden')}
                          </span>
                        </td>
                        <td>
                          ${showOverride || isOverride ? html`
                            <button 
                              class="override-btn ${isOverride ? 'active' : ''}"
                              @click=${() => this._toggleOverride(entity.entity_id)}
                              title="${isOverride ? this._t('removeOverride') : this._t('addOverride')}"
                            >
                              ${isOverride ? '−' : '+'}
                            </button>
                          ` : ''}
                        </td>
                        <td>
                          <input
                            type="text"
                            class="alias-input"
                            .value=${alias}
                            placeholder="${this._t('aliasPlaceholder')}"
                            maxlength="128"
                            @change=${(e: Event) =>
                              this._setAlias(entity.entity_id, (e.target as HTMLInputElement).value)}
                          />
                        </td>
                        <td>
                          <span
                            class="entity-link"
                            @click=${() => this._openEntity(entity.entity_id)}
                          >
                            ${escapeHtml(entity.name || entity.entity_id)}
                          </span>
                        </td>
                        <td>${escapeHtml(entity.domain)}</td>
                        <td>${escapeHtml(entity.area_name || '-')}</td>
                        <td>
                          <span class="reason-text">
                            ${reason === 'domain' ? this._t('byDomain') : 
                              reason === 'entity' ? this._t('manual') : 
                              reason === 'override' ? this._t('override') : ''}
                          </span>
                        </td>
                      </tr>
                    `;
                  })}
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="pagination-info">
            ${this._t('showing')} ${startIndex + 1}-${Math.min(endIndex, filteredEntities.length)} 
            ${this._t('of')} ${filteredEntities.length} ${this._t('entities').toLowerCase()}
            ${this._state?.entities?.length !== filteredEntities.length 
              ? `(${this._state?.entities?.length || 0} ${this._t('total')})` 
              : ''}
          </div>
          <div class="pagination-controls">
            <select 
              .value=${String(this._pageSize)}
              @change=${(e: Event) => {
                this._pageSize = parseInt((e.target as HTMLSelectElement).value);
                this._currentPage = 1;
              }}
            >
              <option value="25">25 ${this._t('perPage')}</option>
              <option value="50">50 ${this._t('perPage')}</option>
              <option value="100">100 ${this._t('perPage')}</option>
              <option value="200">200 ${this._t('perPage')}</option>
            </select>
            <button 
              ?disabled=${currentPage <= 1}
              @click=${() => this._currentPage = 1}
            >${this._t('first')}</button>
            <button 
              ?disabled=${currentPage <= 1}
              @click=${() => this._currentPage = currentPage - 1}
            >${this._t('prev')}</button>
            <span>
              ${this._t('page')} 
              <input 
                type="number" 
                class="page-input"
                min="1" 
                max="${totalPages}"
                .value=${String(currentPage)}
                @change=${(e: Event) => {
                  const page = parseInt((e.target as HTMLInputElement).value);
                  if (page >= 1 && page <= totalPages) {
                    this._currentPage = page;
                  }
                }}
              />
              ${this._t('of')} ${totalPages || 1}
            </span>
            <button 
              ?disabled=${currentPage >= totalPages}
              @click=${() => this._currentPage = currentPage + 1}
            >${this._t('next')}</button>
            <button 
              ?disabled=${currentPage >= totalPages}
              @click=${() => this._currentPage = totalPages}
            >${this._t('last')}</button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderFilters(): TemplateResult {
    return html`
      <div class="filters">
        <div class="filter-row">
          <div class="filter-item">
            <label>${this._t('search')}</label>
            <input
              type="text"
              placeholder="${this._t('searchPlaceholder')}"
              .value=${this._filters.search}
              @input=${(e: Event) => this._debouncedSearch((e.target as HTMLInputElement).value)}
            />
          </div>

          <div class="filter-item">
            <label>${this._t('domain')}</label>
            <select
              @change=${(e: Event) => {
                const value = (e.target as HTMLSelectElement).value;
                this._filters = {
                  ...this._filters,
                  domains: value ? [value] : [],
                };
                this._currentPage = 1;
              }}
            >
              <option value="">${this._t('allDomains')}</option>
              ${(this._state?.domains || []).map(
                (domain) =>
                  html`<option value="${domain}">${escapeHtml(domain)}</option>`
              )}
            </select>
          </div>

          <div class="filter-item">
            <label>${this._t('area')}</label>
            <select
              @change=${(e: Event) => {
                this._filters = { ...this._filters, area: (e.target as HTMLSelectElement).value };
                this._currentPage = 1;
              }}
            >
              <option value="">${this._t('allAreas')}</option>
              ${(this._state?.areas || []).map(
                (area: Area) =>
                  html`<option value="${area.id}">
                    ${escapeHtml(area.name)}
                  </option>`
              )}
            </select>
          </div>

          <div class="filter-toggles">
            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyExcluded}
                @change=${(e: Event) => {
                  this._filters = {
                    ...this._filters,
                    onlyExcluded: (e.target as HTMLInputElement).checked,
                    onlyNotExcluded: false,
                  };
                  this._currentPage = 1;
                }}
              />
              ${this._t('onlyHidden')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyNotExcluded}
                @change=${(e: Event) => {
                  this._filters = {
                    ...this._filters,
                    onlyNotExcluded: (e.target as HTMLInputElement).checked,
                    onlyExcluded: false,
                  };
                  this._currentPage = 1;
                }}
              />
              ${this._t('onlyExposed')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyWithAlias}
                @change=${(e: Event) => {
                  this._filters = {
                    ...this._filters,
                    onlyWithAlias: (e.target as HTMLInputElement).checked,
                  };
                  this._currentPage = 1;
                }}
              />
              ${this._t('withAlias')}
            </label>

            <label class="filter-toggle">
              <input
                type="checkbox"
                .checked=${this._filters.onlyOverrides}
                @change=${(e: Event) => {
                  this._filters = {
                    ...this._filters,
                    onlyOverrides: (e.target as HTMLInputElement).checked,
                  };
                  this._currentPage = 1;
                }}
              />
              ${this._t('overrides')}
            </label>
          </div>
        </div>
      </div>
    `;
  }

  private _renderBulkActions(): TemplateResult {
    // Calcola lo stato delle entità selezionate
    const entities = this._state?.entities || [];
    const selectedEntitiesData = entities.filter(e => this._selectedEntities.includes(e.entity_id));
    const aliases = this._getCurrentAliases();
    
    // Conta quante sono esposte/nascoste
    const exposedCount = selectedEntitiesData.filter(e => this._isEntityExposed(e).exposed).length;
    const hiddenCount = selectedEntitiesData.length - exposedCount;
    
    // Conta quante hanno override
    const config = this._getCurrentFilterConfig();
    const overrides = new Set(config.overrides || []);
    const withOverride = selectedEntitiesData.filter(e => overrides.has(e.entity_id)).length;
    const withoutOverride = selectedEntitiesData.length - withOverride;
    
    // Conta quante hanno alias
    const withAlias = selectedEntitiesData.filter(e => aliases[e.entity_id]).length;
    
    return html`
      <div class="bulk-actions">
        <span class="count">${this._selectedEntities.length} ${this._t('selectedCount')}</span>
        <select id="bulkAction" @change=${(e: Event) => {
          const value = (e.target as HTMLSelectElement).value;
          // Mostra/nascondi input basato sull'azione
          const input = this.shadowRoot?.querySelector('.bulk-value-input') as HTMLInputElement;
          if (input) {
            input.style.display = value === 'set_alias' ? 'inline-block' : 'none';
          }
        }}>
          <option value="">${this._t('selectAction')}</option>
          ${hiddenCount > 0 ? html`
            <option value="unexclude">✓ ${this._t('expose')} (${hiddenCount})</option>
          ` : ''}
          ${exposedCount > 0 ? html`
            <option value="exclude">✗ ${this._t('hide')} (${exposedCount})</option>
          ` : ''}
          ${withoutOverride > 0 ? html`
            <option value="add_override">+ ${this._t('addOverride')} (${withoutOverride})</option>
          ` : ''}
          ${withOverride > 0 ? html`
            <option value="remove_override">− ${this._t('removeOverride')} (${withOverride})</option>
          ` : ''}
          <option value="exclude_domain">⚠️ ${this._t('excludeWholeDomain')}</option>
          <option value="exclude_device">⚠️ ${this._t('excludeWholeDevice')}</option>
          <option value="set_alias">✏️ ${this._t('setAlias')}</option>
          ${withAlias > 0 ? html`
            <option value="clear_alias">🗑️ ${this._t('clearAlias')} (${withAlias})</option>
          ` : ''}
        </select>
        <input
          type="text"
          class="bulk-value-input"
          placeholder="${this._t('aliasValuePlaceholder')}"
          .value=${this._bulkActionValue}
          @input=${(e: Event) => (this._bulkActionValue = (e.target as HTMLInputElement).value)}
          style="display: none;"
        />
        <button
          @click=${() => {
            const select = this.shadowRoot?.querySelector('#bulkAction') as HTMLSelectElement;
            if (select?.value) {
              this._bulkAction(select.value);
            }
          }}
          ?disabled=${this._saving}
        >
          ${this._t('apply')}
        </button>
        <button
          @click=${() => {
            this._selectedEntities = [];
            this._bulkActionValue = '';
          }}
        >
          ${this._t('clear')}
        </button>
      </div>
    `;
  }

  private _renderSettingsTab(): TemplateResult {
    const googleSettings = this._pendingGoogleSettings || this._state?.google_settings || {};
    const alexaSettings = this._pendingAlexaSettings || this._state?.alexa_settings || {};

    return html`
      <div class="settings-container">
        <div class="settings-grid">
          <div class="settings-card">
            <h3>
              <span class="icon">🔵</span>
              ${this._t('googleAssistant')}
            </h3>
            <div class="settings-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${googleSettings.enabled || false}
                    @change=${(e: Event) => this._updatePendingGoogle('enabled', (e.target as HTMLInputElement).checked)}
                  />
                  ${this._t('enableGoogle')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('projectId')}</label>
                <input
                  type="text"
                  .value=${googleSettings.project_id || ''}
                  placeholder="${this._t('projectIdPlaceholder')}"
                  @input=${(e: Event) => this._updatePendingGoogle('project_id', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="form-group">
                <label>${this._t('serviceAccountPath')}</label>
                <input
                  type="text"
                  .value=${googleSettings.service_account_path || ''}
                  placeholder="${this._t('serviceAccountPlaceholder')}"
                  @input=${(e: Event) => this._updatePendingGoogle('service_account_path', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${googleSettings.report_state !== false}
                    @change=${(e: Event) => this._updatePendingGoogle('report_state', (e.target as HTMLInputElement).checked)}
                  />
                  ${this._t('reportState')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('securePin')}</label>
                <input
                  type="text"
                  .value=${googleSettings.secure_devices_pin || ''}
                  placeholder="${this._t('securePinPlaceholder')}"
                  @input=${(e: Event) => this._updatePendingGoogle('secure_devices_pin', (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="form-group">
                <label>${this._t('advancedYaml')}</label>
                <textarea
                  .value=${googleSettings.advanced_yaml || ''}
                  placeholder="exposed_domains:\n  - switch\n  - light"
                  @input=${(e: Event) => this._updatePendingGoogle('advanced_yaml', (e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </div>
            </div>
          </div>

          <div class="settings-card">
            <h3>
              <span class="icon">🔷</span>
              ${this._t('amazonAlexa')}
            </h3>
            <div class="settings-form">
              <div class="form-group">
                <label class="checkbox-label">
                  <input
                    type="checkbox"
                    .checked=${alexaSettings.enabled || false}
                    @change=${(e: Event) => this._updatePendingAlexa('enabled', (e.target as HTMLInputElement).checked)}
                  />
                  ${this._t('enableAlexa')}
                </label>
              </div>
              <div class="form-group">
                <label>${this._t('baseConfig')}</label>
                <textarea
                  .value=${alexaSettings.advanced_yaml || ''}
                  placeholder="${this._t('baseConfigPlaceholder')}"
                  @input=${(e: Event) => this._updatePendingAlexa('advanced_yaml', (e.target as HTMLTextAreaElement).value)}
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        ${this._renderHomekitSettings()}
      </div>
    `;
  }

  private _renderHomekitSettings(): TemplateResult {
    const bridges = this._state?.homekit_bridges || [];
    
    let selectedBridge = '';
    if (this._pendingHomekitBridge !== null && this._pendingHomekitBridge !== undefined) {
      selectedBridge = this._pendingHomekitBridge;
    } else if (this._state?.homekit_entry_id) {
      selectedBridge = this._state.homekit_entry_id;
    }
    
    const bridgeExists = selectedBridge && bridges.some((b: HomeKitBridge) => b.entry_id === selectedBridge);
    const effectiveBridge = bridgeExists ? selectedBridge : '';

    return html`
      <div class="homekit-section">
        <h3>
          <span class="icon">🟠</span>
          ${this._t('homekitBridge')}
        </h3>
        <p style="color: var(--vm-text-secondary); font-size: 14px;">
          ${this._t('homekitDescription')}
        </p>
        
        ${bridges.length === 0 ? html`
          <p style="color: var(--vm-warning);">
            ${this._t('noHomekitBridges')}
          </p>
        ` : html`
          <div class="homekit-bridge-select">
            <select @change=${(e: Event) => {
              this._pendingHomekitBridge = (e.target as HTMLSelectElement).value;
              this._hasUnsavedChanges = true;
            }}>
              <option value="" ?selected=${!effectiveBridge}>${this._t('noBridge')}</option>
              ${bridges.map((bridge: HomeKitBridge) => html`
                <option value="${bridge.entry_id}" ?selected=${effectiveBridge === bridge.entry_id}>
                  ${escapeHtml(bridge.title)} (${this._t('port')}: ${bridge.port})
                </option>
              `)}
            </select>
          </div>
          ${effectiveBridge ? html`
            <p style="color: var(--vm-success); font-size: 13px; margin-top: 8px;">
              ✓ ${this._t('homekitEnabled')}
            </p>
          ` : html`
            <p style="color: var(--vm-text-secondary); font-size: 13px; margin-top: 8px;">
              ${this._t('homekitDisabled')}
            </p>
          `}
        `}
      </div>
    `;
  }

  private _renderFooter(): TemplateResult {
    if (this._activeTab === 'settings') {
      return html`
        <div class="footer">
          <div class="footer-info">
            ${this._t('configureSettings')}
          </div>
          <div class="footer-actions">
            <button
              class="btn btn-secondary"
              @click=${() => this._handleTabSwitch('entities')}
            >
              ${this._t('backToEntities')}
            </button>
            <button
              class="btn btn-secondary"
              @click=${this._discardChanges}
              ?disabled=${!this._hasUnsavedChanges}
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
            <button
              class="btn btn-primary"
              @click=${this._saveAllSettings}
              ?disabled=${this._saving}
            >
              ${this._saving ? this._t('saving') : this._t('saveSettings')}
            </button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="footer">
        <div class="footer-info">
          ${this._hasUnsavedChanges ? html`
            <span style="color: var(--vm-warning); font-weight: bold;">
              ⚠️ ${this._t('unsavedChanges') || 'Unsaved changes'}
            </span>
            |
          ` : ''}
          ${this._state?.google_complete
            ? this._t('googleReady')
            : this._t('googleNotConfigured')}
          |
          ${this._state?.alexa_complete
            ? this._t('alexaReady')
            : this._t('alexaNotConfigured')}
          |
          ${this._state?.homekit_entry_id
            ? this._t('homekitEnabledStatus')
            : this._t('homekitDisabledStatus')}
        </div>
        <div class="footer-actions">
          ${this._hasUnsavedChanges ? html`
            <button
              class="btn btn-secondary"
              @click=${this._discardChanges}
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
          ` : ''}
          <button
            class="btn btn-secondary"
            @click=${this._previewYAML}
            ?disabled=${this._saving}
          >
            ${this._t('previewYaml')}
          </button>
          <button
            class="btn btn-primary"
            @click=${this._writeFiles}
            ?disabled=${this._saving}
          >
            ${this._t('saveGenerate')}
          </button>
          <button
            class="btn btn-secondary"
            @click=${this._checkConfig}
            ?disabled=${this._saving}
          >
            ${this._t('checkConfig')}
          </button>
          <button
            class="btn btn-secondary"
            @click=${this._restartHA}
            ?disabled=${this._saving}
            style="background: var(--vm-warning); color: white;"
          >
            ${this._t('restartHa')}
          </button>
        </div>
      </div>
    `;
  }

  private _renderUnsavedDialog(): TemplateResult {
    return html`
      <div class="dialog-overlay" @click=${this._cancelTabSwitch}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()} style="max-width: 500px;">
          <div class="dialog-header">
            <h2>⚠️ ${this._t('unsavedChanges') || 'Unsaved Changes'}</h2>
            <button
              class="dialog-close"
              @click=${this._cancelTabSwitch}
            >
              ×
            </button>
          </div>
          <div class="dialog-content">
            <p>${this._t('unsavedChangesMessage') || 'You have unsaved changes. Do you want to discard them?'}</p>
          </div>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click=${this._cancelTabSwitch}
            >
              ${this._t('cancel') || 'Cancel'}
            </button>
            <button
              class="btn btn-primary"
              @click=${() => {
                this._discardChanges();
                this._confirmTabSwitch();
              }}
              style="background: var(--vm-warning);"
            >
              ${this._t('discardChanges') || 'Discard Changes'}
            </button>
          </div>
        </div>
      </div>
    `;
  }

  private _renderPreviewDialog(): TemplateResult {
    return html`
      <div class="dialog-overlay" @click=${() => (this._previewDialog = false)}>
        <div class="dialog" @click=${(e: Event) => e.stopPropagation()}>
          <div class="dialog-header">
            <h2>${this._t('yamlPreview')}</h2>
            <button
              class="dialog-close"
              @click=${() => (this._previewDialog = false)}
            >
              ×
            </button>
          </div>
          <div class="dialog-content">
            ${this._previewContent?.google
              ? html`
                  <h3>${this._t('googleAssistant')}</h3>
                  ${this._previewContent.google.warnings?.length
                    ? html`
                        <p style="color: var(--vm-warning)">
                          ${this._t('warnings')}:
                          ${this._previewContent.google.warnings.join(', ')}
                        </p>
                      `
                    : ''}
                  <pre class="yaml-preview">${this._previewContent.google.yaml || this._t('notConfigured')}</pre>
                `
              : ''}
            ${this._previewContent?.alexa
              ? html`
                  <h3>${this._t('amazonAlexa')}</h3>
                  ${this._previewContent.alexa.warnings?.length
                    ? html`
                        <p style="color: var(--vm-warning)">
                          ${this._t('warnings')}:
                          ${this._previewContent.alexa.warnings.join(', ')}
                        </p>
                      `
                    : ''}
                  <pre class="yaml-preview">${this._previewContent.alexa.yaml || this._t('notConfigured')}</pre>
                `
              : ''}
          </div>
          <div class="dialog-footer">
            <button
              class="btn btn-secondary"
              @click=${() => (this._previewDialog = false)}
            >
              ${this._t('close')}
            </button>
            <button class="btn btn-primary" @click=${this._writeFiles}>
              ${this._t('saveGenerate')}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'voice-assistant-manager-panel': VoiceAssistantManagerPanel;
  }
}
