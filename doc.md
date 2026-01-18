# VPS Frontend Setup Guide (Next.js with Laravel Reverb)

## Prerequisites

- VPS with Ubuntu 20.04+ or similar Linux distribution
- Node.js 18+
- npm or yarn
- Nginx
- SSL Certificate (Let's Encrypt recommended)
- Laravel backend with Reverb already configured (see backend guide)

---

## Step 1: Build Your Next.js Application

```bash
npm install
npm run build
```

---

## Step 2: Configure Environment Variables

Create `.env.production` or `.env.local`:

```env
NEXT_PUBLIC_REVERB_APP_KEY=your-app-key
NEXT_PUBLIC_REVERB_HOST=your-backend-domain.com
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_SCHEME=https

# Your Laravel API endpoint
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

---

## Step 3: Install Required Packages

```bash
npm install laravel-echo pusher-js
```

---

## Step 4: Configure Laravel Echo for Reverb

Create a file `lib/echo.ts` or add to your existing config:

```typescript
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo;
  }
}

export function initializeEcho() {
  if (typeof window === 'undefined') return null;

  window.Pusher = Pusher;

  window.Echo = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '443'),
    wssPort: parseInt(process.env.NEXT_PUBLIC_REVERB_PORT || '443'),
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
  });

  return window.Echo;
}
```

---

## Step 5: Use Echo in Your Chat Component

```typescript
'use client';

import { useEffect, useState } from 'react';
import { initializeEcho } from '@/lib/echo';

export default function ChatComponent() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const echo = initializeEcho();
    if (!echo) return;

    // Listen to a channel
    echo.channel('chat')
      .listen('MessageSent', (event) => {
        setMessages(prev => [...prev, event.message]);
      });

    // For private channels (requires authentication)
    // echo.private('chat.1')
    //   .listen('MessageSent', (event) => {
    //     setMessages(prev => [...prev, event.message]);
    //   });

    return () => {
      echo.leave('chat');
    };
  }, []);

  return (
    // Your chat UI
  );
}
```

---

## Step 6: Configure Nginx for Next.js

Create Nginx site configuration:

```bash
sudo nano /etc/nginx/sites-available/your-frontend
```

```nginx
server {
    listen 80;
    server_name your-frontend-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-frontend-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-frontend-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-frontend-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
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
sudo ln -s /etc/nginx/sites-available/your-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Step 7: Create Systemd Service for Next.js

```bash
sudo nano /etc/systemd/system/nextjs.service
```

```ini
[Unit]
Description=Next.js Application
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/your-nextjs-project
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nextjs
sudo systemctl start nextjs
```

---

## Step 8: Using PM2 (Alternative to Systemd)

Install PM2:

```bash
npm install -g pm2
```

Start your app:

```bash
cd /var/www/your-nextjs-project
pm2 start npm --name "nextjs" -- start
pm2 save
pm2 startup
```

---

## Step 9: CORS Configuration (Backend)

Ensure your Laravel backend allows requests from your frontend domain.

In Laravel `config/cors.php`:

```php
'allowed_origins' => [
    'https://your-frontend-domain.com',
],
```

---

## Step 10: Private Channel Authentication

For private channels, configure the auth endpoint in Echo:

```typescript
window.Echo = new Echo({
  broadcaster: 'reverb',
  key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
  wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
  wsPort: 443,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ['ws', 'wss'],
  authEndpoint: 'https://your-backend-domain.com/broadcasting/auth',
  auth: {
    headers: {
      Authorization: `Bearer ${yourAuthToken}`,
    },
  },
});
```

---

## Troubleshooting

### Check if Next.js is running:

```bash
sudo systemctl status nextjs
# or
pm2 status
```

### View logs:

```bash
sudo journalctl -u nextjs -f
# or
pm2 logs nextjs
```

### Test WebSocket connection in browser:

Open browser console and check:

```javascript
window.Echo.connector.pusher.connection.state
// Should be "connected"
```

### Common Issues:

1. **WebSocket connection failed**: 
   - Verify backend Reverb is running
   - Check CORS settings
   - Ensure SSL certificates are valid

2. **Authentication errors for private channels**:
   - Verify auth endpoint is correct
   - Check Bearer token is being sent
   - Ensure Laravel Sanctum/Passport is configured

3. **Messages not received**:
   - Verify channel names match between frontend and backend
   - Check event names are correct (include namespace if needed)
   - Ensure backend is broadcasting events properly

---

## Deployment Checklist

- [ ] Build Next.js app (`npm run build`)
- [ ] Upload to VPS
- [ ] Configure environment variables
- [ ] Set up Nginx reverse proxy
- [ ] Configure SSL certificate
- [ ] Create systemd service or PM2 process
- [ ] Test WebSocket connection
- [ ] Verify private channel authentication
- [ ] Set up log rotation

