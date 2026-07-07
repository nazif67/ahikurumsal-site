# Kişisel Site

Next.js (App Router, TypeScript, Tailwind) ile yapılmış kişisel site iskeleti.
Şu an hazır: ana sayfa, header/footer/navigasyon, Markdown tabanlı blog.
Haberler, Araçlar, Hakkımda sayfaları yer tutucu olarak eklendi.

## Yerel kurulum (kendi bilgisayarınızda)

```bash
npm install
npm run dev
```

`http://localhost:3000` adresinden kontrol edin.

## Build

```bash
npm run build
npm run start
```

> Not: Bu proje bir AI ortamında (npm registry erişimi engelli) elle yazıldı,
> `npm install` / `npm run build` hiç çalıştırılıp test edilmedi. İlk işiniz
> kendi bilgisayarınızda `npm install && npm run build` çalıştırıp olası
> küçük hataları (varsa) düzeltmek olmalı.

## Blog yazısı ekleme

`content/blog/` klasörüne yeni bir `.md` dosyası ekleyin:

```markdown
---
title: "Yazı Başlığı"
date: "2026-06-23"
excerpt: "Kısa özet."
---

İçerik buraya...
```

## GitHub'a gönderme

```bash
cd kisisel-site
git init
git add .
git commit -m "İlk sürüm: ana sayfa + blog"
git branch -M main
git remote add origin https://github.com/nazif67/ahikurumsal-site.git
git push -u origin main
```

## Hostinger VPS'te çalıştırma

Detaylar için `DEPLOY.md` dosyasına bakın.
