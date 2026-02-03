import { css } from 'lit';

/**
 * Table and entity list styles
 */
export const tableStyles = css`
  .entity-table-container {
    overflow: hidden;
  }

  .table-scroll {
    overflow-x: auto;
    max-height: 500px;
    overflow-y: auto;
  }

  .entity-table {
    width: 100%;
    border-collapse: collapse;
    min-width: 900px;
  }

  .entity-table th,
  .entity-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid var(--vm-divider);
  }

  .entity-table th {
    background: var(--secondary-background-color);
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--vm-text-secondary);
    position: sticky;
    top: 0;
    z-index: 1;
  }

  .entity-table tbody tr:hover {
    background: var(--secondary-background-color);
  }

  .entity-table tbody tr.excluded {
    background: rgba(244, 67, 54, 0.05);
  }

  .entity-table tbody tr.override {
    background: rgba(255, 152, 0, 0.1);
  }

  .entity-link {
    color: var(--primary-color);
    cursor: pointer;
    text-decoration: none;
  }

  .entity-link:hover {
    text-decoration: underline;
  }

  .entity-id {
    font-family: monospace;
    font-size: 12px;
    color: var(--vm-text-secondary);
  }

  .alias-input {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    font-size: 13px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
  }

  .status-badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 500;
  }

  .status-badge.exposed {
    background: rgba(76, 175, 80, 0.1);
    color: var(--vm-success);
  }

  .status-badge.excluded {
    background: rgba(244, 67, 54, 0.1);
    color: var(--vm-error);
  }

  .status-badge.override {
    background: rgba(255, 152, 0, 0.1);
    color: var(--vm-warning);
  }

  .reason-text {
    font-size: 11px;
    color: var(--vm-text-secondary);
  }

  .override-btn {
    padding: 4px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    cursor: pointer;
    font-size: 12px;
  }

  .override-btn:hover {
    background: var(--secondary-background-color);
  }

  .override-btn.active {
    background: var(--vm-warning);
    color: white;
    border-color: var(--vm-warning);
  }

  .no-results {
    text-align: center;
    padding: 48px;
    color: var(--vm-text-secondary);
  }
`;

/**
 * Pagination styles
 */
export const paginationStyles = css`
  .pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-top: 1px solid var(--vm-divider);
    flex-wrap: wrap;
    gap: 12px;
  }

  .pagination-info {
    font-size: 13px;
    color: var(--vm-text-secondary);
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .pagination-controls button {
    padding: 6px 12px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    cursor: pointer;
    font-size: 13px;
  }

  .pagination-controls button:hover:not(:disabled) {
    background: var(--secondary-background-color);
  }

  .pagination-controls button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .pagination-controls select {
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    background: var(--vm-card-bg);
    color: var(--vm-text-primary);
    font-size: 13px;
  }

  .page-input {
    width: 60px;
    padding: 6px 8px;
    border: 1px solid var(--vm-divider);
    border-radius: 4px;
    text-align: center;
    font-size: 13px;
  }
`;
