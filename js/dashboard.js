// Dashboard functionality

let autoRefreshInterval = null;

async function refreshData() {
    try {
        const data = await fetchAPI('/api/info');

        // Update main stats
        document.getElementById('dash-ip').textContent = data.ip || 'Unknown';
        document.getElementById('dash-country').textContent = data.country || 'Unknown';
        document.getElementById('dash-time').textContent = formatTime(data.timestamp);

        // Update connection details
        document.getElementById('dash-protocol').textContent = data.protocol?.toUpperCase() || 'Unknown';
        document.getElementById('dash-hostname').textContent = data.hostname || 'Unknown';
        document.getElementById('dash-method').textContent = data.method || 'Unknown';

        // Update Cloudflare status
        document.getElementById('dash-cf-ray').textContent = data.cloudflare['CF-Ray'] || 'Not available';
        document.getElementById('dash-cf-ip').textContent = data.cloudflare['CF-Connecting-IP'] || 'Not available';
        document.getElementById('dash-cf-country').textContent = data.cloudflare['CF-IPCountry'] || 'Not available';

        // Update user agent
        document.getElementById('dash-ua').textContent = data.userAgent || 'Unknown';

        // Add to activity log
        addActivityLog(`Data refreshed at ${formatTimestamp(data.timestamp)}`);

    } catch (error) {
        addActivityLog(`Error: ${error.message}`, 'error');
    }
}

function addActivityLog(message, type = 'info') {
    const logContainer = document.getElementById('activity-log');
    const logEntry = document.createElement('div');
    logEntry.className = 'info-item';

    const timestamp = new Date().toLocaleTimeString();
    logEntry.innerHTML = `
    <div class="info-label">${timestamp}</div>
    <div class="info-value" style="color: ${type === 'error' ? 'var(--error)' : 'var(--text-primary)'}">
      ${message}
    </div>
  `;

    // Add to top of log
    logContainer.insertBefore(logEntry, logContainer.firstChild);

    // Keep only last 10 entries
    while (logContainer.children.length > 10) {
        logContainer.removeChild(logContainer.lastChild);
    }
}

function toggleAutoRefresh() {
    const checkbox = document.getElementById('auto-refresh');
    const statusText = document.getElementById('auto-status');

    if (checkbox.checked) {
        // Enable auto-refresh
        autoRefreshInterval = setInterval(refreshData, 10000);
        statusText.textContent = 'Enabled (10s)';
        statusText.style.color = 'var(--success)';
        addActivityLog('Auto-refresh enabled (every 10 seconds)');
    } else {
        // Disable auto-refresh
        if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            autoRefreshInterval = null;
        }
        statusText.textContent = 'Disabled';
        statusText.style.color = 'var(--text-primary)';
        addActivityLog('Auto-refresh disabled');
    }
}

// Load data on page load
document.addEventListener('DOMContentLoaded', () => {
    refreshData();
});
