# Deployment Guide

## Overview

The Resume Hub consists of two main components:
- **Frontend**: SvelteKit app (deployed to Netlify/Vercel)
- **Backend**: PocketBase server (deployed to VPS/cloud)

## Frontend Deployment (Netlify)

### Automatic Deployment
1. Connect GitHub repository to Netlify
2. Set build settings:
   ```
   Build command: cd app && npm run build
   Publish directory: app/build
   ```

### Environment Variables
```bash
PUBLIC_POCKETBASE_URL=https://your-backend-domain.com
```

### Manual Deployment
```bash
cd app
npm run build
netlify deploy --prod --dir=build
```

## Backend Deployment (VPS)

### Server Requirements
- Ubuntu 20.04+ or similar
- 1GB+ RAM
- 10GB+ storage
- Domain with SSL

### Installation Steps

#### 1. Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y nginx certbot python3-certbot-nginx

# Create app user
sudo useradd -m -s /bin/bash resumehub
sudo usermod -aG sudo resumehub
```

#### 2. PocketBase Setup
```bash
# Switch to app user
sudo su - resumehub

# Download PocketBase
wget https://github.com/pocketbase/pocketbase/releases/download/v0.20.0/pocketbase_0.20.0_linux_amd64.zip
unzip pocketbase_0.20.0_linux_amd64.zip
chmod +x pocketbase

# Create directory structure
mkdir -p ~/app/backend
mv pocketbase ~/app/backend/
cd ~/app/backend
```

#### 3. Upload Application Files
```bash
# Copy your backend files to ~/app/backend/
# Including: pb_migrations/, any custom files
```

#### 4. Systemd Service
```bash
sudo nano /etc/systemd/system/resumehub.service
```

```ini
[Unit]
Description=Resume Hub PocketBase
After=network.target

[Service]
Type=simple
User=resumehub
WorkingDirectory=/home/resumehub/app/backend
ExecStart=/home/resumehub/app/backend/pocketbase serve --http=127.0.0.1:8090
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable resumehub
sudo systemctl start resumehub
```

#### 5. Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/resumehub
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:8090;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/resumehub /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 6. SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com
```

## Environment Configuration

### Production Environment Variables
```bash
# Set in your deployment environment
PUBLIC_POCKETBASE_URL=https://your-backend-domain.com
PB_ENCRYPTION_KEY=your-32-character-encryption-key
```

### PocketBase Settings
1. Access admin panel: `https://your-domain.com/_/`
2. Configure:
   - CORS settings for your frontend domain
   - Email settings (SMTP)
   - File storage settings
   - API rate limits

## Monitoring & Maintenance

### Health Checks
```bash
# Check service status
sudo systemctl status resumehub

# Check logs
sudo journalctl -u resumehub -f

# Check nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
```

### Backup Strategy
```bash
# Create backup script
nano ~/backup.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/resumehub/backups"
mkdir -p $BACKUP_DIR

# Backup database
cp -r /home/resumehub/app/backend/pb_data $BACKUP_DIR/pb_data_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "pb_data_*" -mtime +7 -exec rm -rf {} \;
```

```bash
# Make executable and add to cron
chmod +x ~/backup.sh
crontab -e
# Add: 0 2 * * * /home/resumehub/backup.sh
```

### Updates
```bash
# Update PocketBase
cd ~/app/backend
sudo systemctl stop resumehub
wget https://github.com/pocketbase/pocketbase/releases/download/v0.XX.X/pocketbase_0.XX.X_linux_amd64.zip
unzip pocketbase_0.XX.X_linux_amd64.zip
chmod +x pocketbase
sudo systemctl start resumehub
```

## Troubleshooting

### Common Issues

#### Service Won't Start
```bash
# Check logs
sudo journalctl -u resumehub -n 50

# Check file permissions
ls -la /home/resumehub/app/backend/pocketbase

# Test manually
cd /home/resumehub/app/backend
./pocketbase serve
```

#### SSL Issues
```bash
# Renew certificate
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

#### Database Issues
```bash
# Check database files
ls -la ~/app/backend/pb_data/

# Restore from backup
sudo systemctl stop resumehub
cp -r ~/backups/pb_data_YYYYMMDD_HHMMSS ~/app/backend/pb_data
sudo systemctl start resumehub
```

### Performance Optimization

#### Nginx Caching
```nginx
# Add to nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

#### Database Optimization
- Add indexes for frequently queried fields
- Implement pagination for large datasets
- Use proper API rules to limit data access
- Regular database maintenance

## Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (only ports 22, 80, 443 open)
- [ ] Regular security updates
- [ ] Strong admin passwords
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Regular backups tested
- [ ] Monitoring and alerting set up