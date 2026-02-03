import { css } from 'lit';

/**
 * Dialog and modal styles
 */
export const dialogStyles = css`
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  .dialog {
    background: var(--vm-card-bg);
    border-radius: 8px;
    max-width: 800px;
    max-height: 80vh;
    width: 90%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    border-bottom: 1px solid var(--vm-divider);
  }

  .dialog-header h2 {
    margin: 0;
    font-size: 18px;
  }

  .dialog-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: var(--vm-text-secondary);
  }

  .dialog-content {
    padding: 24px;
    overflow-y: auto;
    flex: 1;
  }

  .yaml-preview {
    background: var(--secondary-background-color);
    padding: 16px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 12px;
    white-space: pre-wrap;
    overflow-x: auto;
    max-height: 400px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    padding: 16px 24px;
    border-top: 1px solid var(--vm-divider);
  }
`;
