// Test page functionality

async function runTest() {
    const loadingEl = document.getElementById('loading');
    const resultsEl = document.getElementById('results');
    const testBtn = document.getElementById('test-btn');

    // Show loading state
    loadingEl.classList.remove('hidden');
    resultsEl.classList.add('hidden');
    testBtn.disabled = true;
    testBtn.textContent = 'Testing...';

    try {
        const data = await fetchAPI('/api/info');

        // Populate visitor information
        document.getElementById('ip-address').textContent = data.ip || 'Unknown';
        document.getElementById('country').textContent = data.country || 'Unknown';
        document.getElementById('timestamp').textContent = formatTimestamp(data.timestamp);
        document.getElementById('protocol').textContent = data.protocol?.toUpperCase() || 'Unknown';

        // Populate browser information
        document.getElementById('user-agent').textContent = data.userAgent || 'Unknown';

        // Populate Cloudflare headers
        const cfActive = isCloudflareActive(data.cloudflare);
        const cfBadge = document.getElementById('cf-badge');

        if (cfActive) {
            cfBadge.textContent = 'Cloudflare Active';
            cfBadge.className = 'badge badge-success';
        } else {
            cfBadge.textContent = 'Not Detected';
            cfBadge.className = 'badge badge-warning';
        }

        document.getElementById('cf-ip').textContent = data.cloudflare['CF-Connecting-IP'] || 'Not available';
        document.getElementById('cf-ray').textContent = data.cloudflare['CF-Ray'] || 'Not available';
        document.getElementById('cf-country').textContent = data.cloudflare['CF-IPCountry'] || 'Not available';
        document.getElementById('cf-visitor').textContent = data.cloudflare['CF-Visitor'] || 'Not available';

        // Populate headers table
        const headersBody = document.getElementById('headers-body');
        headersBody.innerHTML = '';

        if (data.headers) {
            Object.entries(data.headers).forEach(([key, value]) => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td style="font-weight: 600;">${key}</td>
          <td style="word-break: break-all;">${value}</td>
        `;
                headersBody.appendChild(row);
            });
        }

        // Show raw JSON
        document.getElementById('raw-json').textContent = JSON.stringify(data, null, 2);

        // Show results
        loadingEl.classList.add('hidden');
        resultsEl.classList.remove('hidden');

    } catch (error) {
        alert('Error running test: ' + error.message);
        loadingEl.classList.add('hidden');
    } finally {
        testBtn.disabled = false;
        testBtn.textContent = '🚀 Run API Test';
    }
}

// Auto-run test on page load
document.addEventListener('DOMContentLoaded', () => {
    runTest();
});
