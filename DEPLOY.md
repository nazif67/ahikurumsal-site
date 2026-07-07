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
git clone https://github.com/nazif67/ahikurumsal-site.git kisisel-site
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

## 7) Strapi backend güncelleme

Strapi VPS'te ayrı bir PM2 süreci olarak çalışır (`pm2 list` çıktısında adı
`strapi`). Klasör yolunu bilmiyorsanız önce şununla bulun:

```bash
pm2 describe strapi | grep -i "exec cwd"
```

Klasör yolunu bulduktan sonra güncelleme adımları (yol örnektir, kendi
bulduğunuz yolla değiştirin):

```bash
cd /var/www/kisisel-strapi
git pull origin master
npm install
npm run build
pm2 restart strapi
```

### Restart sonrası mutlaka kontrol edin

```bash
pm2 logs strapi --lines 50 --nostream
```

Backend'deki bootstrap script'i, prod veritabanında "Next.js Server" adlı
bir API token yoksa otomatik olarak yeni bir tane oluşturur ve log'a
şöyle yazdırır:

```
=== YENİ STRAPI API TOKEN OLUŞTURULDU ===
kisisel-site/.env.local dosyasındaki STRAPI_API_TOKEN değerini bununla değiştirin:
<uzun bir token>
==========================================
```

Bu blok görünürse token'ı kopyalayıp **frontend tarafındaki**
(`/var/www/kisisel-site`) prod ortam değişkenlerine (`.env.local` veya
pm2 ecosystem dosyanızdaki `STRAPI_API_TOKEN`) yazın, sonra
`pm2 restart kisisel-site` ile yeniden başlatın. Aksi halde canlıda
yorum gönderme (haberler sayfasındaki yorum formu) çalışmaz.

Bu adım normalde **sadece ilk deploy sonrası bir kez** gerekir — token
veritabanında kalıcı olduğu için sonraki restart'larda tekrar
oluşturulmaz.
