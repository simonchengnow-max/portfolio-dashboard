/**
 * Modal Component for Portfolio Dashboard
 * 
 * Reusable modal/popup component that displays full item details
 * with dynamic field rendering based on item type and available data.
 * 
 * Functions:
 * - openModal(item, type) - Opens modal with item data
 * - closeModal() - Closes the modal
 * - initModal() - Initializes event listeners
 */

// Inject CSS styles
(function injectModalStyles() {
  const styleId = 'modal-styles';
  if (document.getElementById(styleId)) return; // Avoid duplicate injection

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = `
    /* Modal Overlay */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      backdrop-filter: blur(2px);
    }

    .modal-overlay.active {
      opacity: 1;
      visibility: visible;
    }

    /* Modal Content Box */
    .modal-content {
      background: #ffffff;
      border-radius: 12px;
      max-width: 600px;
      width: 90%;
      max-height: 85vh;
      overflow-y: auto;
      position: relative;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      transform: translateY(-20px);
      transition: transform 0.3s ease;
    }

    .modal-overlay.active .modal-content {
      transform: translateY(0);
    }

    /* Close Button */
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border: none;
      background: #f5f5f5;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      color: #666;
      transition: background 0.2s, color 0.2s;
      z-index: 10;
    }

    .modal-close:hover {
      background: #e0e0e0;
      color: #333;
    }

    /* Modal Header */
    .modal-header {
      padding: 24px 24px 16px 24px;
      border-bottom: 1px solid #eee;
    }

    .modal-title {
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0 0 8px 0;
      line-height: 1.4;
      padding-right: 40px;
    }

    .modal-type-badge {
      display: inline-block;
      padding: 4px 12px;
      background: #f0f0f0;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 500;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* Modal Body */
    .modal-body {
      padding: 24px;
    }

    .modal-description {
      font-size: 15px;
      line-height: 1.6;
      color: #333;
      margin-bottom: 24px;
    }

    /* Metadata Fields */
    .modal-metadata {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;
    }

    .modal-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .modal-field-label {
      font-size: 12px;
      font-weight: 600;
      color: #888;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .modal-field-value {
      font-size: 14px;
      color: #1a1a1a;
      font-weight: 500;
    }

    .modal-field-value a {
      color: #2563eb;
      text-decoration: none;
      word-break: break-all;
    }

    .modal-field-value a:hover {
      text-decoration: underline;
    }

    /* Status Badge */
    .modal-status-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
    }

    .status-active, .status-green, .status-on-track {
      background: #dcfce7;
      color: #166534;
    }

    .status-warm, .status-needs-attention {
      background: #fef3c7;
      color: #92400e;
    }

    .status-competitive, .status-early-stage, .status-early-discussions {
      background: #dbeafe;
      color: #1e40af;
    }

    .status-in-progress, .status-term-sheet-signed {
      background: #e0e7ff;
      color: #3730a3;
    }

    .status-opportunity, .status-tailwind {
      background: #f3e8ff;
      color: #7e22ce;
    }

    /* Section Divider */
    .modal-divider {
      height: 1px;
      background: #eee;
      margin: 20px 0;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .modal-content {
        width: 95%;
        max-height: 90vh;
      }

      .modal-header {
        padding: 20px 20px 12px 20px;
      }

      .modal-body {
        padding: 20px;
      }

      .modal-title {
        font-size: 18px;
      }

      .modal-description {
        font-size: 14px;
      }
    }

    /* Fade-in Animation */
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-content {
      animation: modalFadeIn 0.3s ease;
    }
  `;
  document.head.appendChild(style);
})();

// Modal DOM element (created on first use)
let modalElement = null;

/**
 * Creates the modal DOM structure
 */
function createModalDOM() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'portfolio-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" aria-label="Close modal">&times;</button>
      <div class="modal-header">
        <h2 class="modal-title"></h2>
        <span class="modal-type-badge"></span>
      </div>
      <div class="modal-body">
        <p class="modal-description"></p>
        <div class="modal-divider"></div>
        <div class="modal-metadata"></div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  return modal;
}

/**
 * Formats a field label from camelCase/snake_case to Title Case
 */
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .replace(/^\w/, c => c.toUpperCase());
}

/**
 * Determines the appropriate CSS class for status values
 */
function getStatusClass(status) {
  if (!status) return '';
  const lowerStatus = status.toLowerCase().replace(/ /g, '-');
  return `status-${lowerStatus}`;
}

/**
 * Renders a field value, handling URLs and special formatting
 */
function renderFieldValue(key, value) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  // Handle URL fields
  if (key === 'url' || key === 'sourceUrl' || key === 'articleUrl') {
    return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
  }

  // Handle source field (might be URL or text)
  if (key === 'source' && typeof value === 'string') {
    if (value.startsWith('http')) {
      return `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
    }
    return value;
  }

  // Handle status with badge styling
  if (key === 'status') {
    const statusClass = getStatusClass(value);
    return `<span class="modal-status-badge ${statusClass}">${value}</span>`;
  }

  // Handle numeric values (amounts, etc.)
  if (typeof value === 'number') {
    return value.toLocaleString();
  }

  // Default: return as string
  return String(value);
}

/**
 * Fields to exclude from display (internal metadata)
 */
const EXCLUDED_FIELDS = ['id', 'createdAt', 'updatedAt', '__typename'];

/**
 * Field display order by type (prioritized fields first)
 */
const FIELD_ORDER = {
  revenue: ['value', 'date', 'source', 'sector', 'status', 'deadline', 'contact'],
  market: ['value', 'date', 'source', 'sector', 'status', 'investors', 'implication', 'timeline', 'action'],
  capital: ['value', 'date', 'source', 'sector', 'status', 'lead_investor', 'expected_close', 'acquirer', 'advisor', 'investor', 'use_of_funds'],
  operational: ['value', 'date', 'source', 'sector', 'status', 'runway', 'headcount', 'burn_rate', 'pipeline', 'capex', 'target_capacity', 'utilization_loi', 'pilots'],
  vc: ['company', 'amount', 'round', 'investors', 'vertical', 'date', 'url']
};

/**
 * Opens the modal with item data
 * @param {Object} item - The data object to display
 * @param {string} type - The type of item (revenue, market, capital, operational, vc)
 */
function openModal(item, type) {
  if (!item || typeof item !== 'object') {
    console.error('openModal: item must be a valid object');
    return;
  }

  if (!type || !['revenue', 'market', 'capital', 'operational', 'vc'].includes(type)) {
    console.error('openModal: type must be one of: revenue, market, capital, operational, vc');
    return;
  }

  // Create modal if it doesn't exist
  if (!modalElement) {
    modalElement = createModalDOM();
  }

  // Get DOM elements
  const titleEl = modalElement.querySelector('.modal-title');
  const typeBadgeEl = modalElement.querySelector('.modal-type-badge');
  const descriptionEl = modalElement.querySelector('.modal-description');
  const metadataEl = modalElement.querySelector('.modal-metadata');
  const closeBtn = modalElement.querySelector('.modal-close');

  // Set title
  titleEl.textContent = item.title || item.company || 'Untitled';

  // Set type badge
  typeBadgeEl.textContent = type;

  // Set description (use description field or fallback)
  const description = item.description || item.company || '';
  descriptionEl.style.display = description ? 'block' : 'none';
  descriptionEl.textContent = description;

  // Build metadata fields
  const orderedFields = FIELD_ORDER[type] || [];
  const allKeys = Object.keys(item).filter(key => 
    !EXCLUDED_FIELDS.includes(key) && 
    key !== 'title' && 
    key !== 'description'
  );

  // Sort keys: ordered fields first, then remaining alphabetically
  const sortedKeys = [
    ...orderedFields.filter(key => allKeys.includes(key)),
    ...allKeys.filter(key => !orderedFields.includes(key)).sort()
  ];

  // Render metadata fields
  let metadataHTML = '';
  sortedKeys.forEach(key => {
    const renderedValue = renderFieldValue(key, item[key]);
    if (renderedValue !== null) {
      metadataHTML += `
        <div class="modal-field">
          <span class="modal-field-label">${formatLabel(key)}</span>
          <span class="modal-field-value">${renderedValue}</span>
        </div>
      `;
    }
  });

  metadataEl.innerHTML = metadataHTML;

  // Show modal
  modalElement.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent background scrolling

  // Focus trap for accessibility
  closeBtn.focus();
}

/**
 * Closes the modal
 */
function closeModal() {
  if (!modalElement) return;

  modalElement.classList.remove('active');
  document.body.style.overflow = ''; // Restore background scrolling
}

/**
 * Initializes event listeners for the modal
 */
function initModal() {
  // Create modal if it doesn't exist
  if (!modalElement) {
    modalElement = createModalDOM();
  }

  const closeBtn = modalElement.querySelector('.modal-close');
  const overlay = modalElement;

  // Close button click
  closeBtn.addEventListener('click', closeModal);

  // Click outside to close
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal();
    }
  });

  // ESC key to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalElement.classList.contains('active')) {
      closeModal();
    }
  });

  console.log('Modal initialized successfully');
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initModal);
} else {
  initModal();
}

// Export functions (for module usage)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { openModal, closeModal, initModal };
}
