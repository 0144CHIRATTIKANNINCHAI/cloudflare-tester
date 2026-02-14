# Deployment Guide

Complete deployment instructions for the Cloudflare Testing Website.

## Table of Contents

1. [Cloudflare Pages Deployment](#cloudflare-pages-deployment)
2. [VPS Deployment](#vps-deployment)
3. [Domain Connection via Cloudflare](#domain-connection-via-cloudflare)

---

## Cloudflare Pages Deployment

Cloudflare Pages is ideal for static sites. Since this application has a Node.js backend, we'll use **Cloudflare Workers** for the API and Pages for the frontend.

### Option 1: Full Static with Workers (Recommended)

#### Step 1: Prepare the Project

Create a `functions` directory for Cloudflare Workers:

```bash
mkdir functions
```

Create `functions/api/info.js`:

```javascript
export async function onRequest(context) {
  const { request } = context;
  
  const clientIP = request.headers.get('CF-Connecting-IP') || 
                   request.headers.get('X-Forwarded-For')?.split(',')[0] || 
                   'Unknown';
  
  const cloudflareHeaders = {
    'CF-Connecting-IP': request.headers.get('CF-Connecting-IP') || null,
    'CF-Ray': request.headers.get('CF-Ray') || null,
    'CF-IPCountry': request.headers.get('CF-IPCountry') || null,
    'CF-Visitor': request.headers.get('CF-Visitor') || null,
  };

  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }

  const response = {
    ip: clientIP,
    timestamp: new Date().toISOString(),
    userAgent: request.headers.get('User-Agent') || 'Unknown',
    country: request.headers.get('CF-IPCountry') || 'Unknown',
    cloudflare: cloudflareHeaders,
    headers: headers,
    method: request.method,
    protocol: new URL(request.url).protocol.replace(':', ''),
    hostname: new URL(request.url).hostname,
  };

  return new Response(JSON.stringify(response), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
```

#### Step 2: Deploy to Cloudflare Pages

1. **Push to Git Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/cloudflare-tester.git
   git push -u origin main
   ```

2. **Connect to Cloudflare Pages**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your Git repository
   - Configure build settings:
     - **Build command**: (leave empty)
     - **Build output directory**: `public`
   - Click **Save and Deploy**

3. **Your site will be live at**: `https://your-project.pages.dev`

---

## VPS Deployment

Deploy the full Node.js application on a VPS (DigitalOcean, Linode, AWS EC2, etc.)

### Prerequisites

- Ubuntu 20.04+ or similar Linux distribution
- Root or sudo access
- Domain name pointing to your VPS IP

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Optional - for reverse proxy)
sudo apt install -y nginx
```

### Step 2: Upload Your Application

```bash
# Create application directory
sudo mkdir -p /var/www/cloudflare-tester
sudo chown -R $USER:$USER /var/www/cloudflare-tester

# Upload files (use SCP, SFTP, or Git)
# Example with Git:
cd /var/www/cloudflare-tester
git clone https://github.com/yourusername/cloudflare-tester.git .

# Install dependencies
npm install --production
```

### Step 3: Start with PM2

```bash
# Start the application
pm2 start server.js --name cloudflare-tester

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by the command above
```

### Step 4: Configure Nginx (Recommended)

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/cloudflare-tester
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.xyz www.your-domain.xyz;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/cloudflare-tester /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.xyz -d www.your-domain.xyz

# Auto-renewal is configured automatically
```

### Step 6: Configure Firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

### Useful PM2 Commands

```bash
# View logs
pm2 logs cloudflare-tester

# Restart application
pm2 restart cloudflare-tester

# Stop application
pm2 stop cloudflare-tester

# Monitor
pm2 monit

# View status
pm2 status
```

---

## Domain Connection via Cloudflare

### Step 1: Add Domain to Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com/)

2. **Add Your Domain**
   - Click **Add a Site**
   - Enter your `.xyz` domain name
   - Click **Add Site**

3. **Select a Plan**
   - Choose **Free** plan (or any other)
   - Click **Continue**

4. **Review DNS Records**
   - Cloudflare will scan existing DNS records
   - Click **Continue**

### Step 2: Update Nameservers

1. **Get Cloudflare Nameservers**
   - Cloudflare will provide 2 nameservers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com`)

2. **Update at Your Domain Registrar**
   - Log in to your `.xyz` domain registrar
   - Find DNS/Nameserver settings
   - Replace existing nameservers with Cloudflare's nameservers
   - Save changes

3. **Wait for Propagation**
   - Can take 24-48 hours (usually much faster)
   - Cloudflare will email you when active

### Step 3: Configure DNS Records

#### For VPS Deployment:

1. Go to **DNS** tab in Cloudflare
2. Add an **A record**:
   - **Type**: A
   - **Name**: @ (for root domain) or www
   - **IPv4 address**: Your VPS IP address
   - **Proxy status**: Proxied (orange cloud) ✅
   - **TTL**: Auto
3. Click **Save**

#### For Cloudflare Pages:

1. Go to **DNS** tab
2. Add a **CNAME record**:
   - **Type**: CNAME
   - **Name**: @ or www
   - **Target**: your-project.pages.dev
   - **Proxy status**: Proxied ✅
   - **TTL**: Auto
3. Click **Save**

### Step 4: Configure SSL/TLS

1. Go to **SSL/TLS** tab
2. Set encryption mode:
   - **For VPS with Let's Encrypt**: Full (strict)
   - **For Cloudflare Pages**: Full
3. Enable **Always Use HTTPS**
   - Go to **SSL/TLS** → **Edge Certificates**
   - Toggle **Always Use HTTPS** to ON

### Step 5: Optimize Settings (Optional)

#### Performance:

1. **Auto Minify**
   - Go to **Speed** → **Optimization**
   - Enable JavaScript, CSS, HTML minification

2. **Brotli Compression**
   - Go to **Speed** → **Optimization**
   - Enable Brotli

3. **Caching**
   - Go to **Caching** → **Configuration**
   - Set caching level to **Standard**

#### Security:

1. **Security Level**
   - Go to **Security** → **Settings**
   - Set to **Medium** or **High**

2. **Bot Fight Mode**
   - Go to **Security** → **Bots**
   - Enable **Bot Fight Mode** (Free plan)

3. **Rate Limiting** (Pro plan+)
   - Configure rate limits for API endpoints

### Step 6: Verify Cloudflare is Active

1. Visit your website: `https://your-domain.xyz`
2. Go to the **Test** page
3. Check for Cloudflare headers:
   - `CF-Ray` should be present
   - `CF-Connecting-IP` should show your real IP
   - `CF-IPCountry` should show your country code

---

## Troubleshooting

### Cloudflare Headers Not Showing

- **Ensure Proxy is Enabled**: DNS record must have orange cloud (Proxied)
- **Clear Cache**: Cloudflare Dashboard → Caching → Purge Everything
- **Check SSL Mode**: Must be Full or Full (Strict)

### 502 Bad Gateway (VPS)

- Check if Node.js app is running: `pm2 status`
- Check Nginx configuration: `sudo nginx -t`
- Check firewall: `sudo ufw status`
- View logs: `pm2 logs cloudflare-tester`

### SSL Certificate Issues

- Verify nameservers are pointing to Cloudflare
- Wait for DNS propagation (up to 48 hours)
- Check SSL/TLS mode in Cloudflare Dashboard

### Application Not Starting

```bash
# Check Node.js version
node --version  # Should be 16+

# Check for errors
npm start

# View PM2 logs
pm2 logs cloudflare-tester --lines 100
```

---

## Production Checklist

- [ ] Environment variables configured
- [ ] SSL/TLS enabled and working
- [ ] Cloudflare proxy enabled (orange cloud)
- [ ] PM2 configured to restart on boot (VPS)
- [ ] Firewall configured properly
- [ ] DNS records pointing correctly
- [ ] Cloudflare headers visible in test page
- [ ] All pages loading correctly
- [ ] API endpoint responding
- [ ] Mobile responsiveness verified

---

## Support

For deployment issues:
- Check Cloudflare documentation: https://developers.cloudflare.com/
- PM2 documentation: https://pm2.keymetrics.io/
- Nginx documentation: https://nginx.org/en/docs/

---

**Deployment complete! Your Cloudflare testing website is now live! 🚀**
