# Cafeteria Vote System

Bu depo, kurumsal yemek oylama ve menü planlama uygulaması için örnek bir monorepo iskeletidir. Next.js tabanlı bir frontend ve NestJS tabanlı bir backend içerir.

## Başlangıç

Gerekli araçlar: [Node.js 20](https://nodejs.org/), [pnpm](https://pnpm.io/), Docker.

```bash
pnpm install --recursive
```

Geliştirme ortamını Docker ile başlatmak için:

```bash
docker compose up
```

Backend varsayılan olarak `http://localhost:3000`, frontend `http://localhost:3001` adresinde çalışır.

## Çevre Değişkenleri

Backend için `.env` dosyası örneği `apps/backend/.env.example`, frontend için `apps/frontend/.env.example` dosyasındadır.

## Test

Backend testleri Jest ile yazılmıştır:

```bash
pnpm test
```

Henüz kapsamlı testler eklenmemiştir.
