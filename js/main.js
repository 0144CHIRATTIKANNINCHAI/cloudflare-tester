// Main shared utilities

// Highlight active navigation link
document.addEventListener('DOMContentLoaded', () => {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        link.classList.remove('active');
        const linkPath = new URL(link.href).pathname;
        if (linkPath === currentPath || (currentPath === '/' && linkPath === '/')) {
            link.classList.add('active');
        }
    });
});

// API helper function
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Format timestamp
function formatTimestamp(isoString) {
    const date = new Date(isoString);
    return date.toLocaleString();
}

// Format time only
function formatTime(isoString) {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
}

// Check if Cloudflare is active
function isCloudflareActive(cloudflareData) {
    return cloudflareData && (
        cloudflareData['CF-Ray'] ||
        cloudflareData['CF-Connecting-IP'] ||
        cloudflareData['CF-IPCountry']
    );
}
