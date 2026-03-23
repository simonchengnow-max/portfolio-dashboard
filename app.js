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

// 5. Load VC News Daily
async function loadVCNewsDaily() {
  try {
    const response = await fetch('data/vc-news-daily.json');
    const data = await response.json();

    // Update stats
    const totalDeals = (data.hot_deals?.length || 0) + (data.warm_deals?.length || 0);
    const totalCapital = data.hot_deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) +
      data.warm_deals?.reduce((sum, deal) => sum + (deal.amount || 0), 0) || 0;
    const lastUpdated = data.last_scraped || 'Unknown';

    document.getElementById('vc-total-deals').textContent = totalDeals;
    document.getElementById('vc-total-capital').textContent = '$' + (totalCapital / 1000000).toFixed(1) + 'M';
    document.getElementById('vc-last-updated').textContent = lastUpdated;

    // Render hot deals
    renderVCDeals('vc-hot-deals', data.hot_deals || [], 'HOT');

    // Render warm deals
    renderVCDeals('vc-warm-deals', data.warm_deals || [], 'WARM');

  } catch (error) {
    console.error('Error loading VC News Daily:', error);
    document.getElementById('vc-hot-deals').innerHTML =
      '<div class="error">Error loading VC deals data</div>';
    document.getElementById('vc-warm-deals').innerHTML = '';
  }
}

/**
 * Generic render function for 4 sections (Revenue, Market, Capital, Operational)
 * Now includes clickable cards with modal integration
 */
function renderSection(elementId, items, type) {
  const container = document.getElementById(elementId);

  if (!items || items.length === 0) {
    container.innerHTML = '<div class="empty">No data available</div>';
    return;
  }

  let html = '';
  items.forEach(item => {
    // Create serialized data attribute for modal
    const itemData = encodeURIComponent(JSON.stringify(item));
    
    html += `
      <div class="card clickable-card" 
           data-item='${itemData}'
           onclick="handleCardClick(this, '${type}')">
        <h3>${item.title}</h3>
        ${item.description ? `
          <p class="description">${item.description}</p>
        ` : ''}
        ${item.value ? `
          <p class="value"><strong>Value:</strong> ${item.value}</p>
        ` : ''}
        ${item.company ? `
          <p class="company"><strong>Company:</strong> ${item.company}</p>
        ` : ''}
        ${item.amount ? `
          <p class="amount"><strong>Amount:</strong> ${item.amount}</p>
        ` : ''}
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Specialized render for VC News Daily deals
 * Now includes clickable cards with modal integration
 */
function renderVCDeals(containerId, deals, tier) {
  const container = document.getElementById(containerId);

  if (!deals || deals.length === 0) {
    container.innerHTML = `<div class="empty">No ${tier.toLowerCase()} deals available</div>`;
    return;
  }

  let html = `<div class="tier-header"><h3>${tier} DEALS</h3></div>`;
  deals.forEach(deal => {
    const formattedAmount = deal.amount ? `$${(deal.amount / 1000000).toFixed(1)}M` : 'Undisclosed';
    const dealData = encodeURIComponent(JSON.stringify(deal));
    
    html += `
      <div class="card deal-card clickable-card"
           data-item='${dealData}'
           onclick="handleCardClick(this, 'vc')">
        <h3>${deal.company || 'Unknown Company'}</h3>
        <p class="round"><strong>Round:</strong> ${deal.round || 'N/A'}</p>
        <p class="amount"><strong>Amount:</strong> ${formattedAmount}</p>
        <p class="description">${deal.description || ''}</p>
      </div>
    `;
  });

  container.innerHTML = html;
}

/**
 * Handle card click - opens modal with item data
 */
function handleCardClick(element, type) {
  const itemData = element.getAttribute('data-item');
  if (itemData) {
    const item = JSON.parse(decodeURIComponent(itemData));
    openModal(item, type);
  }
}

// Global function for inline onclick handlers (for backward compatibility)
window.openModal = openModal;
window.handleCardClick = handleCardClick;