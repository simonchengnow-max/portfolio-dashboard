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

function renderVCDeals(containerId, deals, tier) {
    const container = document.getElementById(containerId);
    
    if (!deals || deals.length === 0) {
        container.innerHTML = `<div class="loading">No ${tier.toLowerCase()} deals available</div>`;
        return;
    }
    
    let html = `<h3 class="tier-label tier-${tier.toLowerCase()}">${tier} DEALS</h3>`;
    deals.forEach(deal => {
        const formattedAmount = deal.amount ? `$${(deal.amount / 1000000).toFixed(1)}M` : 'Undisclosed';
        html += `
            <div class="data-card">
                <h3>${deal.company || 'Unknown Company'}</h3>
                <p><strong>Round:</strong> ${deal.round || 'N/A'}</p>
                <p><strong>Amount:</strong> ${formattedAmount}</p>
                <p>${deal.description || ''}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function renderSection(elementId, items, type) {
    const container = document.getElementById(elementId);
    
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="loading">No data available</div>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        html += `
            <div class="data-card">
                <h3>${item.title}</h3>
                ${item.description ? `<p>${item.description}</p>` : ''}
                ${item.value ? `<p><strong>Value:</strong> ${item.value}</p>` : ''}
                ${item.company ? `<p><strong>Company:</strong> ${item.company}</p>` : ''}
                ${item.amount ? `<p><strong>Amount:</strong> ${item.amount}</p>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}