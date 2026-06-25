# Hostinger VPS'e Deploy

Bu site Next.js ile çalıştığı için VPS'te Node.js'e ihtiyaç var.
Aşağıdaki adımlar SSH ile VPS'e bağlandıktan sonra terminalde çalıştırılır.

## 1) Node.js kurulumu (bir kere)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
node -v
npm -v
```

## 2) PM2 kurulumu (process manager, bir kere)

```bash
sudo npm install -g pm2
```

## 3) Repoyu çekme

```bash
cd /var/www
git clone https://github.com/ahikariyer-ik/front-main.git kisisel-site
cd kisisel-site
npm install
npm run build
```

## 4) PM2 ile başlatma

```bash
pm2 start npm --name "kisisel-site" -- start
pm2 save
pm2 startup
```

Bu site varsayılan olarak 3000 portunda çalışır.

## 5) Nginx reverse proxy

```nginx
server {
    listen 80;
    server_name siteadiniz.com www.siteadiniz.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Dosyayı `/etc/nginx/sites-available/kisisel-site` olarak kaydedip:

```bash
sudo ln -s /etc/nginx/sites-available/kisisel-site /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

SSL için: `sudo certbot --nginx -d siteadiniz.com -d www.siteadiniz.com`

## 6) Güncelleme yaparken (her değişiklikten sonra)

```bash
cd /var/www/kisisel-site
git pull
npm install
npm run build
pm2 restart kisisel-site
```

Bu son adımı tek satırlık bir script olarak da kaydedebilirsiniz:

```bash
#!/bin/bash
cd /var/www/kisisel-site
git pull
npm install
npm run build
pm2 restart kisisel-site
```

`deploy.sh` olarak kaydedip `chmod +x deploy.sh` yaptıktan sonra her
güncellemede sadece `./deploy.sh` çalıştırmanız yeterli.
