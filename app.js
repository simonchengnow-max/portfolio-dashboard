/**
 * Portfolio Dashboard - Main Application
 * 
 * Loads and renders data for 5 sections:
 * 1. Revenue Signals
 * 2. Market Intelligence
 * 3. Capital Markets
 * 4. Operational Health
 * 5. VC News Daily
 */

// Initialize modal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initModal();
  loadAllSections();
});

// Load all sections
function loadAllSections() {
  loadRevenueSignals();
  loadMarketIntel();
  loadCapitalMarkets();
  loadOperationalHealth();
  loadVCNewsDaily();

  // Update timestamp
  const now = new Date();
  document.getElementById('update-timestamp').textContent = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

// 1. Load Revenue Signals
async function loadRevenueSignals() {
  try {
    const response = await fetch('data/revenue-signals.json');
    const data = await response.json();
    renderSection('revenue-signals-content', data.opportunities, 'revenue');
  } catch (error) {
    console.error('Error loading revenue signals:', error);
    document.getElementById('revenue-signals-content').innerHTML =
      '<div class="error">Error loading data</div>';
  }
}

// 2. Load Market Intelligence
async function loadMarketIntel() {
  try {
    const response = await fetch('data/market-intel.json');
    const data = await response.json();
    renderSection('market-intel-content', data.intelligence, 'market');
  } catch (error) {
    console.error('Error loading market intel:', error);
    document.getElementById('market-intel-content').innerHTML =
      '<div class="error">Error loading data</div>';
  }
}

// 3. Load Capital Markets
async function loadCapitalMarkets() {
  try {
    const response = await fetch('data/capital-markets.json');
    const data = await response.json();
    renderSection('capital-markets-content', data.deals, 'capital');
  } catch (error) {
    console.error('Error loading capital markets:', error);
    document.getElementById('capital-markets-content').innerHTML =
      '<div class="error">Error loading data</div>';
  }
}

// 4. Load Operational Health
async function loadOperationalHealth() {
  try {
    const response = await fetch('data/operational-health.json');
    const data = await response.json();
    renderSection('operational-health-content', data.metrics, 'operational');
  } catch (error) {
    console.error('Error loading operational health:', error);
    document.getElementById('operational-health-content').innerHTML =
      '<div class="error">Error loading data</div>';
  }
}

// 5. Load VC News Daily - Renders summary table
async function loadVCNewsDaily() {
  try {
    const response = await fetch('data/vc-news-daily.json');
    const data = await response.json();

    // Update stats
    const totalDeals = (data.hotOpportunities?.length || 0) + (data.warmSignals?.length || 0);
    const totalCapital = data.totalCapital || '$0';

    document.getElementById('vc-total-deals').textContent = totalDeals;
    document.getElementById('vc-total-capital').textContent = totalCapital;
    document.getElementById('vc-last-updated').textContent = data.lastUpdated || 'Unknown';

    // Render the VC deals table
    renderVCTable(data.hotOpportunities || []);
  } catch (error) {
    console.error('Error loading VC News Daily:', error);
    document.getElementById('vc-news-content').innerHTML =
      '<div class="error">Error loading data</div>';
  }
}

// Render VC News Daily Summary Table
function renderVCTable(deals) {
  const container = document.getElementById('vc-news-content');

  if (!deals || deals.length === 0) {
    container.innerHTML = '<p class="empty-state">No VC deals available</p>';
    return;
  }

  const tableHTML = `
    <table class="vc-table">
      <thead>
        <tr>
          <th>Company Name</th>
          <th>What They Do</th>
          <th>Amount Raised</th>
        </tr>
      </thead>
      <tbody>
        ${deals.map(deal => `
          <tr>
            <td><a href="${deal.url || '#'}" target="_blank" rel="noopener">${escapeHtml(deal.company)}</a></td>
            <td>${escapeHtml(deal.description)}</td>
            <td>${escapeHtml(deal.amount)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;

  container.innerHTML = tableHTML;
}

// Generic section renderer
function renderSection(elementId, data, type) {
  const container = document.getElementById(elementId);
  if (!data || data.length === 0) {
    container.innerHTML = '<p class="empty-state">No data available</p>';
    return;
  }

  switch(type) {
    case 'revenue':
      container.innerHTML = data.map(item => `
        <div class="card">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="status-badge ${getStatusClass(item.status)}">${escapeHtml(item.status || 'Unknown')}</span>
          <p>${escapeHtml(item.description)}</p>
          <div class="card-footer">
            <span class="value">${escapeHtml(item.value || 'N/A')}</span>
            ${formatDate(item.date)}
          </div>
        </div>
      `).join('');
      break;
    case 'market':
      container.innerHTML = data.map(item => `
        <div class="card">
          <h3>${escapeHtml(item.title)}</h3>
          <span class="trend-badge ${getTrendClass(item.trend)}">${escapeHtml(item.trend || 'Neutral')}</span>
          <p>${escapeHtml(item.description)}</p>
          <div class="card-footer">
            <span class="source">${escapeHtml(item.source)}</span>
            ${formatDate(item.date)}
          </div>
        </div>
      `).join('');
      break;
    case 'capital':
      container.innerHTML = data.map(item => `
        <div class="card">
          <h3>${escapeHtml(item.company)}</h3>
          <span class="status-badge">${escapeHtml(item.round || 'Unknown')}</span>
          <p>${escapeHtml(item.description)}</p>
          <div class="card-footer">
            <span class="value">${escapeHtml(item.amount || 'Undisclosed')}</span>
            <span class="investors">${escapeHtml(item.investors || 'Unknown')}</span>
          </div>
        </div>
      `).join('');
      break;
    case 'operational':
      container.innerHTML = data.map(item => `
        <div class="card">
          <h3>${escapeHtml(item.name)}</h3>
          <span class="health-badge ${getHealthClass(item.health)}">${escapeHtml(item.health || 'Unknown')}</span>
          <p>${escapeHtml(item.description)}</p>
          <div class="card-footer">
            <span class="value">${escapeHtml(item.value || 'N/A')}</span>
            <span class="trend">${escapeHtml(item.trend || '')}</span>
          </div>
        </div>
      `).join('');
      break;
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text || '';
  return div.innerHTML;
}

function getStatusClass(status) {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s.includes('warm') || s.includes('active')) return 'status-warm';
  if (s.includes('cold') || s.includes('lost')) return 'status-cold';
  return 'status-green';
}

function getTrendClass(trend) {
  if (!trend) return '';
  const t = trend.toLowerCase();
  if (t.includes('up') || t.includes('positive') || t.includes('bullish')) return 'trend-up';
  if (t.includes('down') || t.includes('negative') || t.includes('bearish')) return 'trend-down';
  return '';
}

function getHealthClass(health) {
  if (!health) return '';
  const h = health.toLowerCase();
  if (h.includes('good') || h.includes('green') || h.includes('healthy')) return 'health-good';
  if (h.includes('warning') || h.includes('yellow')) return 'health-warning';
  if (h.includes('critical') || h.includes('red') || h.includes('unhealthy')) return 'health-critical';
  return '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
