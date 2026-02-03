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
      this._pendingGoogleSettings = { ...(result.google_settings || {}) };
      this._pendingAlexaSettings = { ...(result.alexa_settings || {}) };
      this._pendingHomekitBridge = result.homekit_entry_id || '';
    } catch (error) {
      console.error('Failed to load state:', error);
      this._error = (error as Error).message || 'Failed to load Voice Manager state';
    }
    this._loading = false;
  }

  private _getCurrentFilterConfig(): FilterConfig {
    if (!this._state) return DEFAULT_FILTER_CONFIG;
    
    if (this._state.mode === 'linked') {
      return this._state.filter_config || DEFAULT_FILTER_CONFIG;
    }
    
    const key = `${this._activePlatform}_filter_config` as keyof VoiceManagerState;
    return (this._state[key] as FilterConfig) || DEFAULT_FILTER_CONFIG;
  }

  private _getCurrentAliases(): Record<string, string> {
    if (!this._state) return {};
    if (this._state.mode === 'linked') {
      return this._state.aliases || {};
    }
    const key = `${this._activePlatform}_aliases` as keyof VoiceManagerState;
    return (this._state[key] as Record<string, string>) || {};
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

  private async _setFilterMode(filterMode: string): Promise<void> {
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_filter_mode',
        filter_mode: filterMode,
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      await this._loadState();
    } catch (error) {
      console.error('Failed to set filter mode:', error);
      this._showError('Failed to set filter mode: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private async _toggleDomain(domain: string): Promise<void> {
    const config = this._getCurrentFilterConfig();
    const domains = new Set(config.domains || []);
    
    if (domains.has(domain)) {
      domains.delete(domain);
    } else {
      domains.add(domain);
    }

    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_domains',
        domains: Array.from(domains),
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      await this._loadState();
    } catch (error) {
      console.error('Failed to toggle domain:', error);
      this._showError('Failed to toggle domain: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private async _selectAllDomains(): Promise<void> {
    const allDomains = this._state?.domains || [];
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_domains',
        domains: allDomains,
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      await this._loadState();
    } catch (error) {
      console.error('Failed to select all domains:', error);
    }
    this._saving = false;
  }

  private async _deselectAllDomains(): Promise<void> {
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_domains',
        domains: [],
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      await this._loadState();
    } catch (error) {
      console.error('Failed to deselect all domains:', error);
    }
    this._saving = false;
  }

  private async _toggleOverride(entityId: string): Promise<void> {
    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/toggle_override',
        entity_id: entityId,
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      await this._loadState();
    } catch (error) {
      console.error('Failed to toggle override:', error);
      this._showError('Failed to toggle override: ' + (error as Error).message);
    }
    this._saving = false;
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

  private async _setAlias(entityId: string, alias: string): Promise<void> {
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/set_alias',
        entity_id: entityId,
        alias: alias,
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      
      const aliases = { ...this._getCurrentAliases() };
      if (alias) {
        aliases[entityId] = alias;
      } else {
        delete aliases[entityId];
      }
      
      if (this._state?.mode === 'linked') {
        this._state = { ...this._state!, aliases };
      } else {
        const aliasKey = `${this._activePlatform}_aliases` as keyof VoiceManagerState;
        this._state = { ...this._state!, [aliasKey]: aliases } as VoiceManagerState;
      }
    } catch (error) {
      console.error('Failed to set alias:', error);
      this._showError('Failed to set alias: ' + (error as Error).message);
    }
  }

  private async _bulkAction(action: string): Promise<void> {
    if (this._selectedEntities.length === 0) return;

    this._saving = true;
    try {
      await this.hass.callWS({
        type: 'voice_assistant_manager/bulk_update',
        action: action,
        entity_ids: this._selectedEntities,
        value: this._bulkActionValue,
        ...(this._state?.mode === 'separate' ? { assistant: this._activePlatform } : {}),
      });
      this._selectedEntities = [];
      this._bulkActionValue = '';
      await this._loadState();
    } catch (error) {
      console.error('Failed to perform bulk action:', error);
      this._showError('Failed to perform bulk action: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private async _saveAllSettings(): Promise<void> {
    this._saving = true;
    try {
      if (this._pendingGoogleSettings) {
        await this.hass.callWS({
          type: 'voice_assistant_manager/set_settings',
          assistant: 'google',
          settings: this._pendingGoogleSettings,
        });
      }
      
      if (this._pendingAlexaSettings) {
        await this.hass.callWS({
          type: 'voice_assistant_manager/set_settings',
          assistant: 'alexa',
          settings: this._pendingAlexaSettings,
        });
      }
      
      const currentBridge = this._state?.homekit_entry_id || '';
      if (this._pendingHomekitBridge !== currentBridge) {
        await this.hass.callWS({
          type: 'voice_assistant_manager/set_homekit_bridge',
          entry_id: this._pendingHomekitBridge || null,
        });
      }
      
      await this._loadState();
      alert(this._t('settingsSaved'));
    } catch (error) {
      console.error('Failed to save settings:', error);
      this._showError('Failed to save settings: ' + (error as Error).message);
    }
    this._saving = false;
  }

  private _updatePendingGoogle(key: keyof GoogleSettings, value: unknown): void {
    this._pendingGoogleSettings = {
      ...this._pendingGoogleSettings,
      [key]: value,
    };
  }

  private _updatePendingAlexa(key: keyof AlexaSettings, value: unknown): void {
    this._pendingAlexaSettings = {
      ...this._pendingAlexaSettings,
      [key]: value,
    };
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
          @click=${() => (this._activeTab = 'entities')}
        >
          ${this._t('entities')}
        </div>
        <div
          class="tab ${this._activeTab === 'settings' ? 'active' : ''}"
          @click=${() => (this._activeTab = 'settings')}
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
    return html`
      <div class="bulk-actions">
        <span class="count">${this._selectedEntities.length} ${this._t('selectedCount')}</span>
        <select id="bulkAction">
          <option value="">${this._t('selectAction')}</option>
          <option value="exclude">${this._t('addToExclusions')}</option>
          <option value="unexclude">${this._t('removeFromExclusions')}</option>
          <option value="add_override">${this._t('addOverride')}</option>
          <option value="remove_override">${this._t('removeOverride')}</option>
          <option value="exclude_domain">${this._t('excludeDomain')}</option>
          <option value="exclude_device">${this._t('excludeDevice')}</option>
          <option value="set_alias_prefix">${this._t('addAliasPrefix')}</option>
          <option value="set_alias_suffix">${this._t('addAliasSuffix')}</option>
          <option value="clear_alias">${this._t('clearAlias')}</option>
        </select>
        <input
          type="text"
          placeholder="${this._t('valuePlaceholder')}"
          .value=${this._bulkActionValue}
          @input=${(e: Event) => (this._bulkActionValue = (e.target as HTMLInputElement).value)}
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
            <select @change=${(e: Event) => this._pendingHomekitBridge = (e.target as HTMLSelectElement).value}>
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
              @click=${() => this._activeTab = 'entities'}
            >
              ${this._t('backToEntities')}
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
