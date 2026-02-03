import { css } from 'lit';

/**
 * Footer styles
 */
export const footerStyles = css`
  .footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 24px;
    background: var(--secondary-background-color);
    border-radius: 0 0 8px 8px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .footer-info {
    font-size: 13px;
    color: var(--vm-text-secondary);
  }

  .footer-actions {
    display: flex;
    gap: 12px;
  }
`;
