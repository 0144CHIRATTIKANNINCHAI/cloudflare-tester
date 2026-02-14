# Cloudflare Testing Website

A modern, production-ready website for testing Cloudflare security and performance features. Built with Node.js, Express, and vanilla JavaScript.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Node](https://img.shields.io/badge/node-%3E%3D16.0.0-green)

## 🚀 Features

- **Real-time Visitor Information** - Display IP address, country, user agent, and timestamps
- **Cloudflare Header Detection** - Automatically detect and display CF-Ray, CF-Connecting-IP, CF-IPCountry
- **Modern Dark UI** - Beautiful, responsive design with smooth animations
- **REST API** - `/api/info` endpoint for programmatic access
- **Live Dashboard** - Real-time monitoring with auto-refresh capability
- **Mobile Responsive** - Works perfectly on all devices

## 📋 Prerequisites

- Node.js 16.0.0 or higher
- npm (comes with Node.js)

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
cd cloudflare-tester
npm install
```

### 2. Start the Server

```bash
npm start
```

The server will start on `http://localhost:3000`

### 3. Access the Application

- **Home Page**: http://localhost:3000
- **Test Page**: http://localhost:3000/test
- **Dashboard**: http://localhost:3000/dashboard
- **API Endpoint**: http://localhost:3000/api/info

## 📁 Project Structure

```
cloudflare-tester/
├── public/
│   ├── index.html          # Home page with hero section
│   ├── test.html           # Test page for analyzing headers
│   ├── dashboard.html      # Real-time dashboard
│   ├── css/
│   │   └── style.css       # Modern dark theme styles
│   └── js/
│       ├── main.js         # Shared utilities
│       ├── test.js         # Test page functionality
│       └── dashboard.js    # Dashboard functionality
├── server.js               # Express server
├── package.json            # Dependencies and scripts
├── README.md              # This file
└── DEPLOYMENT.md          # Deployment guides
```

## 🌐 API Documentation

### GET /api/info

Returns comprehensive visitor and request information.

**Response Example:**

```json
{
  "ip": "203.0.113.1",
  "timestamp": "2026-02-13T09:51:05.000Z",
  "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)...",
  "country": "US",
  "cloudflare": {
    "CF-Connecting-IP": "203.0.113.1",
    "CF-Ray": "8b5cf6d4e5f6g7h8",
    "CF-IPCountry": "US",
    "CF-Visitor": "{\"scheme\":\"https\"}"
  },
  "headers": {
    "host": "example.xyz",
    "user-agent": "Mozilla/5.0...",
    ...
  },
  "method": "GET",
  "protocol": "https",
  "hostname": "example.xyz"
}
```

### GET /api/health

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-02-13T09:51:05.000Z"
}
```

## 🎨 Features Overview

### Home Page
- Hero section with gradient background
- System status display
- Feature showcase
- API documentation preview

### Test Page
- One-click API testing
- Visitor IP and browser information
- Cloudflare header detection
- Complete request headers table
- Raw JSON response viewer

### Dashboard
- Real-time data display
- Connection details
- Cloudflare status monitoring
- Activity log
- Auto-refresh toggle (10-second intervals)

## 🔧 Configuration

### Environment Variables

You can customize the port by setting the `PORT` environment variable:

```bash
# Windows PowerShell
$env:PORT=8080; npm start

# Linux/Mac
PORT=8080 npm start
```

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions for:
- Cloudflare Pages
- VPS (Virtual Private Server)
- Domain connection via Cloudflare

## 📝 License

MIT License - feel free to use this project for any purpose.

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues or pull requests.

## 📧 Support

For issues or questions, please open an issue on the repository.

---

Built with ❤️ for Cloudflare testing
