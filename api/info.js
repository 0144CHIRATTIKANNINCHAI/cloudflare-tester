export default function handler(req, res) {
  res.status(200).json({
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent'],
    country: req.headers['x-vercel-ip-country'] || 'Unknown',
    protocol: req.headers['x-forwarded-proto'],
    hostname: req.headers.host,
    method: req.method,
    cloudflare: {
      'CF-Connecting-IP': req.headers['cf-connecting-ip'],
      'CF-Ray': req.headers['cf-ray'],
      'CF-IPCountry': req.headers['cf-ipcountry'],
      'CF-Visitor': req.headers['cf-visitor']
    },
    headers: req.headers
  });
}
