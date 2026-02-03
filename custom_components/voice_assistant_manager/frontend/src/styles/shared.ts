import { css } from 'lit';

/**
 * Shared CSS variables and common styles
 */
export const sharedStyles = css`
  :host {
    display: block;
    --mdc-theme-primary: var(--primary-color);
    --vm-card-bg: var(--card-background-color, #fff);
    --vm-text-primary: var(--primary-text-color, #212121);
    --vm-text-secondary: var(--secondary-text-color, #727272);
    --vm-divider: var(--divider-color, #e0e0e0);
    --vm-success: #4caf50;
    --vm-warning: #ff9800;
    --vm-error: #f44336;
  }

  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .btn-primary {
    background: var(--primary-color);
    color: white;
  }

  .btn-primary:hover:not(:disabled) {
    opacity: 0.9;
  }

  .btn-secondary {
    background: var(--vm-divider);
    color: var(--vm-text-primary);
  }

  .btn-secondary:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .loading-container,
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px;
    text-align: center;
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--vm-divider);
    border-top-color: var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-container {
    color: var(--vm-error);
  }
`;

/**
 * Header styles
 */
export const headerStyles = css`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-left {
    display: flex;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }

  .header h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 400;
    color: var(--vm-text-primary);
  }

  .mode-select {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .mode-select label {
    color: var(--vm-text-secondary);
    font-size: 14px;
  }

  .mode-select select {
    padding: 8px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
    cursor: pointer;
  }

  .platform-tabs {
    display: flex;
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 4px;
    gap: 4px;
  }

  .platform-tab {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--vm-text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .platform-tab:hover {
    background: var(--vm-divider);
  }

  .platform-tab.active {
    background: var(--primary-color);
    color: white;
  }

  .platform-tab.google.active {
    background: #4285f4;
  }

  .platform-tab.alexa.active {
    background: #00caff;
  }

  .platform-tab.homekit.active {
    background: #ff9500;
  }

  .filter-mode-toggle {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 12px;
    background: var(--secondary-background-color);
    border-radius: 8px;
  }

  .filter-mode-toggle label {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .filter-mode-toggle input[type="radio"] {
    cursor: pointer;
  }
`;

/**
 * Tab styles
 */
export const tabStyles = css`
  .tabs {
    display: flex;
    border-bottom: 1px solid var(--vm-divider);
    margin-bottom: 16px;
    gap: 8px;
  }

  .tab {
    padding: 12px 24px;
    background: none;
    border: none;
    color: var(--vm-text-secondary);
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 2px solid transparent;
    transition: all 0.2s ease;
  }

  .tab:hover {
    color: var(--vm-text-primary);
  }

  .tab.active {
    color: var(--primary-color);
    border-bottom-color: var(--primary-color);
  }
`;

/**
 * Content card styles
 */
export const cardStyles = css`
  .content {
    background: var(--vm-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .domain-card {
    background: var(--vm-card-bg);
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    overflow: hidden;
  }

  .domain-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: var(--secondary-background-color);
    cursor: pointer;
  }

  .domain-card-header h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 500;
  }

  .domain-card-header .toggle-icon {
    transition: transform 0.2s ease;
  }

  .domain-card-header .toggle-icon.expanded {
    transform: rotate(180deg);
  }

  .domain-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 8px;
    padding: 16px;
  }

  .domain-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    background: var(--secondary-background-color);
    cursor: pointer;
    font-size: 13px;
  }

  .domain-item:hover {
    background: var(--vm-divider);
  }

  .domain-item.selected {
    background: var(--primary-color);
    color: white;
  }

  .domain-actions {
    display: flex;
    gap: 8px;
    padding: 0 16px 16px;
  }

  .domain-actions button {
    padding: 6px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    cursor: pointer;
    font-size: 12px;
  }

  .domain-actions button:hover {
    background: var(--secondary-background-color);
  }
`;
