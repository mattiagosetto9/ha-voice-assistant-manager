import { css } from 'lit';

/**
 * Filter bar styles
 */
export const filterStyles = css`
  .filters {
    padding: 16px;
    border-bottom: 1px solid var(--vm-divider);
  }

  .filter-row {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
  }

  .filter-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .filter-item label {
    font-size: 12px;
    color: var(--vm-text-secondary);
    font-weight: 500;
  }

  .filter-item input,
  .filter-item select {
    padding: 8px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
    min-width: 150px;
  }

  .filter-toggles {
    display: flex;
    gap: 16px;
    align-items: center;
  }

  .filter-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    cursor: pointer;
  }

  .filter-toggle input {
    cursor: pointer;
  }
`;

/**
 * Bulk actions bar styles
 */
export const bulkActionsStyles = css`
  .bulk-actions {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--primary-color);
    color: white;
  }

  .bulk-actions .count {
    font-weight: 500;
  }

  .bulk-actions select,
  .bulk-actions input {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
  }

  .bulk-actions button {
    padding: 6px 16px;
    border: none;
    border-radius: 4px;
    background: white;
    color: var(--primary-color);
    font-weight: 500;
    cursor: pointer;
  }

  .bulk-actions button:hover {
    background: rgba(255, 255, 255, 0.9);
  }
`;

/**
 * Settings form styles
 */
export const settingsStyles = css`
  .settings-container {
    padding: 24px;
  }

  .settings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 24px;
  }

  .settings-card {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 20px;
  }

  .settings-card h3 {
    margin: 0 0 16px;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .settings-card .icon {
    font-size: 20px;
  }

  .settings-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-group label {
    font-size: 13px;
    color: var(--vm-text-secondary);
    font-weight: 500;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
  }

  .form-group textarea {
    min-height: 100px;
    font-family: monospace;
    resize: vertical;
  }

  .form-group .checkbox-label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
  }

  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;
  }

  .homekit-section {
    background: var(--secondary-background-color);
    border-radius: 8px;
    padding: 20px;
    margin-top: 24px;
  }

  .homekit-bridge-select {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 12px;
  }

  .homekit-bridge-select select {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 14px;
  }

  .homekit-actions {
    display: flex;
    gap: 12px;
    margin-top: 16px;
  }
`;
