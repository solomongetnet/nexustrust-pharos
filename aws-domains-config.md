nexustrust-mcp.solomongetnet.site
nexustrust-api.solomongetnet.site
nexustrust-test.solomongetnet.site



AWS config
# Step 1: Namecheap DNS Setup

Go to Namecheap → Domain List → **solomongetnet.site** → Manage → Advanced DNS

Since `solomongetnet.site` root is already on Vercel, just add A records for your specific subdomains (don't touch existing root/www records):

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A Record | nexustrust-mcp | YOUR_EC2_PUBLIC_IP | Automatic |
| A Record | nexustrust-api | YOUR_EC2_PUBLIC_IP | Automatic |
| A Record | nexustrust-test | YOUR_EC2_PUBLIC_IP | Automatic |

(Wildcard `*` is optional — only use it if you want ALL future subdomains to auto-point to EC2. Since you have specific names, individual A records are cleaner and won't conflict with Vercel's setup on the root.)

Get your EC2 public IP:
```bash
curl -s http://169.254.169.254/latest/meta-data/public-ipv4
```

DNS propagation: 10 min – 30 min usually, up to a few hours.

Verify propagation:
```bash
nslookup nexustrust-api.solomongetnet.site
```

---

# Step 2: EC2 Security Group

In AWS Console → EC2 → your instance → Security tab → Security Group → Edit inbound rules:

| Type | Port | Source |
|------|------|--------|
| HTTP | 80 | 0.0.0.0/0 |
| HTTPS | 443 | 0.0.0.0/0 |
| SSH | 22 | Your IP |

---

# Step 3: Install Nginx + Certbot

```bash
sudo apt update
sudo apt install -y nginx certbot python3-certbot-nginx
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

# Step 4: Nginx Config (3 subdomains → 3 ports)

Assuming your 3 servers run on ports 3000, 3001, 3002 — adjust as needed.

```bash
sudo nano /etc/nginx/sites-available/nexustrust
```

```nginx
server {
    listen 80;
    server_name nexustrust-mcp.solomongetnet.site;

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

server {
    listen 80;
    server_name nexustrust-api.solomongetnet.site;

    location / {
        proxy_pass http://localhost:3001;
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

server {
    listen 80;
    server_name nexustrust-test.solomongetnet.site;

    location / {
        proxy_pass http://localhost:3002;
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

Enable config:

```bash
sudo ln -s /etc/nginx/sites-available/nexustrust /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

# Step 5: SSL Certificates (HTTPS)

**Wait until DNS has propagated** (test with `nslookup` from Step 1 first), then:

```bash
sudo certbot --nginx -d nexustrust-mcp.solomongetnet.site -d nexustrust-api.solomongetnet.site -d nexustrust-test.solomongetnet.site
```

Follow prompts:
- Enter email
- Agree to terms
- Choose option **2** (redirect HTTP to HTTPS)

Certbot auto-edits your Nginx config to add SSL. Auto-renewal is set up by default — verify with:

```bash
sudo certbot renew --dry-run
```

---

# Step 6: Start Your 3 Apps with PM2

```bash
cd ~/project1 && pm2 start app.js --name nexustrust-mcp -- --port 3000
cd ~/project2 && pm2 start app.js --name nexustrust-api -- --port 3001
cd ~/project3 && pm2 start app.js --name nexustrust-test -- --port 3002

pm2 save
pm2 startup
# run the printed command, then pm2 save again
```

(Adjust based on each app's actual start command and port — e.g. Python apps use `pm2 start "python3 app.py --port 3001" --name nexustrust-api --interpreter none`)

---

# Step 7: Verify

```bash
curl -I https://nexustrust-mcp.solomongetnet.site
curl -I https://nexustrust-api.solomongetnet.site
curl -I https://nexustrust-test.solomongetnet.site
```

Each should return `HTTP/2 200` (or your app's response) with a valid SSL cert.

---

**Tell me each app's actual port and tech stack (Node/Python/etc.) and I'll give you exact PM2 start commands.**