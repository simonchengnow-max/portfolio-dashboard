/**
 * Portfolio Dashboard - Client-Side Logic
 * Fetches and renders data from JSON files in /data directory
 */

// Configuration
const DATA_FILES = {
  'revenue-signals': 'data/revenue-signals.json',
  'market-intel': 'data/market-intel.json',
  'capital-markets': 'data/capital-markets.json',
  'operational-health': 'data/operational-health.json'
};

// State
let dashboardData = {};
let lastFetchTime = null;

/**
 * Initialize dashboard on page load
 */
document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Dashboard] Initializing...');
  await loadAllData();
  renderAllSections();
  updateTimestamp();
  console.log('[Dashboard] Initialization complete');
});

/**
 * Load all data files in parallel
 */
async function loadAllData() {
  const loadPromises = Object.entries(DATA_FILES).map(async ([key, url]) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      dashboardData[key] = await response.json();
      updateStatusIndicator(key, 'success');
    } catch (error) {
      console.error(`[Dashboard] Failed to load ${key}:`, error);
      dashboardData[key] = null;
      updateStatusIndicator(key, 'error');
    }
  });

  await Promise.all(loadPromises);
  lastFetchTime = new Date();
}

/**
 * Render all dashboard sections
 */
function renderAllSections() {
  renderRevenueSignals();
  renderMarketIntel();
  renderCapitalMarkets();
  renderOperationalHealth();
}

/**
 * Render Revenue Signals section
 */
function renderRevenueSignals() {
  const container = document.getElementById('revenue-grid');
  const data = dashboardData['revenue-signals'];

  if (!data || !data.signals || data.signals.length === 0) {
    container.innerHTML = renderEmptyState('No revenue signals yet');
    return;
  }

  container.innerHTML = data.signals.map(signal => `
    <div class="data-card">
      <h3>${escapeHtml(signal.title)}</h3>
      <div class="meta">
        <span class="badge ${getProbabilityBadge(signal.probability)}">${signal.probiciency || signal.probability}</span>
        <span>${escapeHtml(signal.company)}</span>
      </div>
      <div class="value">${escapeHtml(signal.value || 'TBD')}</div>
      <div class="notes">${escapeHtml(signal.notes || '')}</div>
    </div>
  `).join('');
}

/**
 * Render Market Intelligence section
 */
function renderMarketIntel() {
  const container = document.getElementById('market-grid');
  const data = dashboardData['market-intel'];

  if (!data || !data.intelligence || data.intelligence.length === 0) {
    container.innerHTML = renderEmptyState('No market intelligence yet');
    return;
  }

  container.innerHTML = data.intelligence.map(item => `
    <div class="data-card">
      <h3>${escapeHtml(item.title)}</h3>
      <div class="meta">
        <span class="badge ${getImpactBadge(item.impact)}">${item.impact}</span>
        <span>${escapeHtml(item.vertical)}</span>
      </div>
      <div class="value">${escapeHtml(item.category)}</div>
      <div class="notes">${escapeHtml(item.summary || item.notes || '')}</div>
    </div>
  `).join('');
}

/**
 * Render Capital Markets section
 */
function renderCapitalMarkets() {
  const container = document.getElementById('capital-grid');
  const data = dashboardData['capital-markets'];

  if (!data || !data.deals || data.deals.length === 0) {
    container.innerHTML = renderEmptyState('No capital markets activity yet');
    return;
  }

  container.innerHTML = data.deals.map(deal => `
    <div class="data-card">
      <h3>${escapeHtml(deal.title)}</h3>
      <div class="meta">
        <span class="badge ${getTypeBadge(deal.type)}">${deal.type}</span>
        <span>${escapeHtml(deal.company)}</span>
      </div>
      <div class="value">${escapeHtml(deal.amount || 'TBD')}</div>
      <div class="notes">${escapeHtml(deal.notes || '')}</div>
    </div>
  `).join('');
}

/**
 * Render Operational Health section
 */
function renderOperationalHealth() {
  const container = document.getElementById('health-grid');
  const data = dashboardData['operational-health'];

  if (!data || !data.companies || data.companies.length === 0) {
    container.innerHTML = renderEmptyState('No operational data yet');
    return;
  }

  container.innerHTML = data.companies.map(company => `
    <div class="data-card">
      <h3>${escapeHtml(company.name)}</h3>
      <div class="meta">
        <span class="badge ${getStatusBadge(company.status)}">${company.status}</span>
        <span>${escapeHtml(company.vertical)}</span>
      </div>
      <div class="value">${formatMetrics(company.metrics)}</div>
      <div class="notes">${escapeHtml(company.notes || '')}</div>
    </div>
  `).join('');
}

/**
 * Helper: Format metrics object to string
 */
function formatMetrics(metrics) {
  if (!metrics) return 'N/A';
  const parts = [];
  if (metrics.revenue) parts.push(`Rev: ${metrics.revenue}`);
  if (metrics.growth) parts.push(`Growth: ${metrics.growth}`);
  if (metrics.runway) parts.push(`Runway: ${metrics.runway}`);
  return parts.join(' | ') || 'TBD';
}

/**
 * Helper: Render empty state
 */
function renderEmptyState(message) {
  return `
    <div class="empty-state">
      <div class="empty-state-icon">📊</div>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

/**
 * Update status indicator for a section
 */
function updateStatusIndicator(source, status) {
  const indicator = document.querySelector(`.status-indicator[data-source="${source}"]`);
  if (indicator) {
    indicator.className = 'status-indicator';
    if (status === 'loading') indicator.classList.add('loading');
    if (status === 'error') indicator.classList.add('error');
  }
}

/**
 * Update last updated timestamp
 */
function updateTimestamp() {
  const timestampEl = document.getElementById('update-timestamp');
  if (timestampEl && lastFetchTime) {
    timestampEl.textContent = `Last updated: ${lastFetchTime.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    })}`;
  }
}

/**
 * Badge helpers
 */
function getProbabilityBadge(prob) {
  if (prob === 'high') return 'badge-hot';
  if (prob === 'medium') return 'badge-warm';
  return 'badge-new';
}

function getImpactBadge(impact) {
  if (impact === 'high') return 'badge-hot';
  if (impact === 'medium') return 'badge-warm';
  return 'badge-new';
}

function getTypeBadge(type) {
  if (type === 'fundraising') return 'badge-hot';
  if (type === 'ma') return 'badge-warm';
  return 'badge-new';
}

function getStatusBadge(status) {
  if (status === 'healthy') return 'badge-healthy';
  if (status === 'watch') return 'badge-warm';
  if (status === 'critical') return 'badge-hot';
  return 'badge-new';
}

/**
 * Helper: Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Auto-refresh every 5 minutes (optional)
 */
// setInterval(async () => {
//   console.log('[Dashboard] Auto-refreshing data...');
//   await loadAllData();
//   renderAllSections();
//   updateTimestamp();
// }, 5 * 60 * 1000);
