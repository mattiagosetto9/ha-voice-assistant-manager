/**
 * Italian translations
 */
export const it: Record<string, string> = {
  // Header
  title: "Voice Assistant Manager",
  mode: "Modalità",
  linked: "Collegata",
  separate: "Separata",
  exclude: "Escludi",
  include: "Includi",
  
  // Tabs
  entities: "Entità",
  settings: "Impostazioni",
  
  // Domain card
  domainsToExclude: "Domini da Escludere",
  domainsToInclude: "Domini da Includere",
  selected: "selezionati",
  selectAll: "Seleziona Tutti",
  deselectAll: "Deseleziona Tutti",
  
  // Filters
  search: "Cerca",
  searchPlaceholder: "Cerca per nome o ID...",
  domain: "Dominio",
  allDomains: "Tutti i domini",
  area: "Area",
  allAreas: "Tutte le aree",
  onlyHidden: "Solo nascosti",
  onlyExposed: "Solo esposti",
  withAlias: "Con alias",
  overrides: "Override",
  
  // Bulk actions
  selectedCount: "selezionati",
  selectAction: "Seleziona azione...",
  addToExclusions: "Aggiungi alle esclusioni",
  removeFromExclusions: "Rimuovi dalle esclusioni",
  addOverride: "Aggiungi override",
  removeOverride: "Rimuovi override",
  excludeDomain: "Escludi intero dominio",
  excludeDevice: "Escludi intero dispositivo",
  addAliasPrefix: "Aggiungi prefisso alias",
  addAliasSuffix: "Aggiungi suffisso alias",
  clearAlias: "Cancella alias",
  valuePlaceholder: "Valore (per prefisso/suffisso)",
  apply: "Applica",
  clear: "Pulisci",
  
  // Table
  status: "Stato",
  override: "Override",
  voiceAlias: "Alias Vocale",
  name: "Nome",
  reason: "Motivo",
  exposed: "Esposto",
  hidden: "Nascosto",
  byDomain: "Per dominio",
  manual: "Manuale",
  aliasPlaceholder: "Alias vocale...",
  
  // Pagination
  showing: "Mostrando",
  of: "di",
  total: "totali",
  perPage: "per pagina",
  page: "Pagina",
  first: "Prima",
  prev: "Prec",
  next: "Succ",
  last: "Ultima",
  noResults: "Nessuna entità corrisponde ai filtri attuali",
  
  // Settings
  googleAssistant: "Google Assistant",
  enableGoogle: "Abilita Google Assistant",
  projectId: "ID Progetto",
  projectIdPlaceholder: "my-home-assistant-project",
  serviceAccountPath: "Percorso Service Account",
  serviceAccountPlaceholder: "/config/SERVICE_ACCOUNT.json",
  reportState: "Riporta Stato",
  securePin: "PIN Dispositivi Sicuri (opzionale)",
  securePinPlaceholder: "1234",
  advancedYaml: "YAML Avanzato (opzionale)",
  amazonAlexa: "Amazon Alexa",
  enableAlexa: "Abilita Alexa",
  baseConfig: "Configurazione Base (richiesta)",
  baseConfigPlaceholder: "locale: it-IT\nendpoint: https://...",
  homekitBridge: "Bridge HomeKit",
  homekitDescription: "Seleziona un bridge HomeKit. La configurazione verrà sincronizzata quando clicchi \"Salva e Genera\" nella tab Entità.",
  noHomekitBridges: "Nessun bridge HomeKit trovato. Configura prima HomeKit Bridge in Home Assistant.",
  noBridge: "Nessun bridge (disabilitato)",
  port: "Porta",
  homekitEnabled: "HomeKit verrà abilitato dopo il salvataggio",
  homekitDisabled: "HomeKit disabilitato",
  backToEntities: "Torna alle Entità",
  saveSettings: "Salva Impostazioni",
  saving: "Salvataggio...",
  configureSettings: "Configura le impostazioni degli assistenti vocali sopra",
  
  // Footer
  googleReady: "Google Assistant: Pronto",
  googleNotConfigured: "Google Assistant: Non configurato",
  alexaReady: "Alexa: Pronto",
  alexaNotConfigured: "Alexa: Non configurato",
  homekitEnabledStatus: "HomeKit: Abilitato",
  homekitDisabledStatus: "HomeKit: Disabilitato",
  previewYaml: "Anteprima YAML",
  saveGenerate: "Salva e Genera",
  checkConfig: "Verifica Config",
  restartHa: "Riavvia HA",
  
  // Dialog
  yamlPreview: "Anteprima YAML",
  warnings: "Avvisi",
  notConfigured: "Non configurato",
  close: "Chiudi",
  
  // Messages
  loading: "Caricamento Voice Assistant Manager...",
  error: "Errore",
  retry: "Riprova",
  settingsSaved: "Impostazioni salvate con successo!",
  configValid: "Configurazione valida!",
  configError: "Errore configurazione",
  restartConfirm: "Sei sicuro di voler riavviare Home Assistant?",
  restarting: "Home Assistant si sta riavviando...",
  configSaved: "Configurazione salvata:",
  googleOk: "Google Assistant: OK",
  alexaOk: "Alexa: OK",
  homekitOk: "HomeKit: OK",
};
