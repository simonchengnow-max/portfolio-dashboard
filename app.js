// Portfolio Dashboard - Dynamic Data Loading

document.addEventListener('DOMContentLoaded', function() {
    // Load all data sections on page load
    loadRevenueSignals();
    loadMarketIntel();
    loadCapitalMarkets();
    loadOperationalHealth();
    
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
                <div class="meta">
                    ${item.value ? `<span class="value">${item.value}</span>` : ''}
                    ${item.date ? `<span>${formatDate(item.date)}</span>` : ''}
                    ${item.source ? `<span class="tag">${item.source}</span>` : ''}
                    ${item.status ? `<span class="tag status-${item.status.toLowerCase()}">${item.status}</span>` : ''}
                    ${item.sector ? `<span class="tag">${item.sector}</span>` : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Auto-refresh every 5 minutes
setInterval(function() {
    loadRevenueSignals();
    loadMarketIntel();
    loadCapitalMarkets();
    loadOperationalHealth();
    updateTimestamp();
}, 300000);