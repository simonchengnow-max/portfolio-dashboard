// Portfolio Dashboard - Dynamic Data Loading

document.addEventListener('DOMContentLoaded', function() {
 // Load all data sections on page load
 loadRevenueSignals();
 loadMarketIntel();
 loadCapitalMarkets();
 loadOperationalHealth();
 loadVCNewsDaily();

 // Update timestamp
 updateTimestamp();
});

function updateTimestamp() {
 const now = new Date();
 const options = {
 weekday: 'short',
 year: 'numeric',
 month: 'short',
 day: 'numeric',
 hour: '2-digit',
 minute: '2-digit'
 };
 document.getElementById('update-timestamp').textContent = now.toLocaleDateString('en-US', options);
}

// Helper function to parse amount strings like "$14M" or "$2.5B" to numbers
function parseAmount(amountStr) {
 if (!amountStr || typeof amountStr !== 'string') return 0;
 
 // Remove $ and whitespace
 const cleaned = amountStr.replace(/[$,\s]/g, '');
 
 // Check for billions
 if (cleaned.toUpperCase().includes('B')) {
 const num = parseFloat(cleaned.replace(/B/i, ''));
 return num * 1000000000;
 }
 
 // Check for millions
 if (cleaned.toUpperCase().includes('M')) {
 const num = parseFloat(cleaned.replace(/M/i, ''));
 return num * 1000000;
 }
 
 // Check for thousands
 if (cleaned.toUpperCase().includes('K')) {
 const num = parseFloat(cleaned.replace(/K/i, ''));
 return num * 1000;
 }
 
 // Plain number
 const num = parseFloat(cleaned);
 return isNaN(num) ? 0 : num;
}

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

async function loadVCNewsDaily() {
 try {
 const response = await fetch('data/vc-news-daily.json');
 const data = await response.json();

 // Update stats - using corrected property names
 const totalDeals = (data.hotOpportunities?.length || 0) + (data.warmSignals?.length || 0);
 const totalCapital = (data.hotOpportunities?.reduce((sum, deal) => sum + parseAmount(deal.amount), 0) || 0) +
 (data.warmSignals?.reduce((sum, deal) => sum + parseAmount(deal.amount), 0) || 0);
 const lastUpdated = data.lastUpdated || 'Unknown';

 document.getElementById('vc-total-deals').textContent = totalDeals;
 document.getElementById('vc-total-capital').textContent = '$' + (totalCapital / 1000000).toFixed(1) + 'M';
 document.getElementById('vc-last-updated').textContent = lastUpdated;

 // Render hot deals
 renderVCDeals('vc-hot-deals', data.hotOpportunities || [], 'HOT');

 // Render warm deals
 renderVCDeals('vc-warm-deals', data.warmSignals || [], 'WARM');

 } catch (error) {
 console.error('Error loading VC News Daily:', error);
 document.getElementById('vc-hot-deals').innerHTML =
 '<div class="error">Error loading VC deals data</div>';
 document.getElementById('vc-warm-deals').innerHTML = '';
 }
}

function renderVCDeals(containerId, deals, tier) {
 const container = document.getElementById(containerId);

 if (!deals || deals.length === 0) {
 container.innerHTML = `<div class="no-deals">No ${tier.toLowerCase()} deals available</div>`;
 return;
 }

 let html = `<h3 class="tier-title">${tier} DEALS</h3>`;
 deals.forEach(deal => {
 const amountNum = parseAmount(deal.amount);
 const formattedAmount = amountNum > 0 ? `$${(amountNum / 1000000).toFixed(1)}M` : 'Undisclosed';
 html += `<div class="deal-card">
<h4 class="deal-company">${deal.company || 'Unknown Company'}</h4>
<p class="deal-round"><strong>Round:</strong> ${deal.round || 'N/A'}</p>
<p class="deal-amount"><strong>Amount:</strong> ${formattedAmount}</p>
<p class="deal-description">${deal.description || ''}</p>
</div>`;
 });

 container.innerHTML = html;
}

function renderSection(elementId, items, type) {
 const container = document.getElementById(elementId);

 if (!items || items.length === 0) {
 container.innerHTML = '<div class="no-data">No data available</div>';
 return;
 }

 let html = '';
 items.forEach(item => {
 html += `<div class="item-card">
<h4 class="item-title">${item.title}</h4>
${item.description ? `<p class="item-description">${item.description}</p>` : ''}
${item.value ? `<p class="item-value"><strong>Value:</strong> ${item.value}</p>` : ''}
${item.company ? `<p class="item-company"><strong>Company:</strong> ${item.company}</p>` : ''}
${item.amount ? `<p class="item-amount"><strong>Amount:</strong> ${item.amount}</p>` : ''}
</div>`;
 });

 container.innerHTML = html;
}
