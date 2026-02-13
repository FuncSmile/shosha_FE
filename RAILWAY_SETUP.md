# 🚂 Railway Deployment Guide - Frontend

Panduan lengkap deploy ShoshaMart Frontend (Nuxt 3) ke Railway.

## 📋 Prerequisites

1. **Railway Account** - [Daftar di Railway](https://railway.app)
2. **GitHub Account** - Repo sudah di: https://github.com/FuncSmile/shosha_FE.git
3. **Backend sudah deploy** - Dapatkan backend URL terlebih dahulu
4. **Railway CLI** (optional) - `npm install -g @railway/cli`

---

## 🚀 Quick Deploy

### 1. Create New Service di Railway

**Option A: Separate Project (Recommended)**
1. Login ke [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Pilih repo: `FuncSmile/shosha_FE`

**Option B: Same Project as Backend**
1. Buka project yang sudah ada (tempat backend)
2. Click **"+ New"** → **"GitHub Repo"**
3. Pilih repo: `FuncSmile/shosha_FE`

### 2. Configure Environment Variables

Di Railway Dashboard → Frontend Service → **Variables**:

```bash
# Required Variables
NODE_ENV=production
PORT=3000

# Backend API URL (dari backend Railway URL)
NUXT_PUBLIC_API_BASE=https://your-backend.railway.app/api

# Alternative jika backend di project yang sama:
# NUXT_PUBLIC_API_BASE=http://backend:3001/api

# App Metadata
NUXT_PUBLIC_APP_NAME=ShoshaMart
NUXT_PUBLIC_APP_VERSION=1.0.0
```

### 3. Update Backend CORS

Setelah frontend deploy, update `FRONTEND_URL` di backend:

```bash
# Di Railway Backend Variables:
FRONTEND_URL=https://your-frontend.railway.app
```

---

## 🔐 GitHub Secrets untuk CI/CD

Tambahkan secrets di GitHub repo → **Settings** → **Secrets and variables** → **Actions**:

### Required Secrets:

1. **`RAILWAY_TOKEN`**
   ```bash
   # Dapatkan token:
   railway login
   railway whoami --token
   ```
   Atau via Railway Dashboard → Account Settings → Tokens → Create New Token

2. **`RAILWAY_SERVICE_ID`**
   ```bash
   # Dapatkan service ID:
   railway status
   ```
   Atau dari Railway Dashboard URL: `railway.app/project/{PROJECT_ID}/service/{SERVICE_ID}`

---

## 🔧 Custom Domain (Optional)

### Setup Custom Domain:

1. Di Railway Dashboard → Frontend Service
2. Click **"Settings"** → **"Domains"**
3. Click **"Generate Domain"** untuk subdomain Railway gratis
4. Atau **"Custom Domain"** untuk domain sendiri

**DNS Configuration (untuk custom domain):**
```
Type: CNAME
Name: www (atau subdomain lain)
Value: your-app.up.railway.app
```

---

## 🔄 CI/CD Workflow

Setiap push ke `main` akan:

1. ✅ Install dependencies
2. ✅ Run linter
3. ✅ Build Nuxt app
4. ✅ Deploy to Railway

**Manual deploy:**
```bash
railway up
```

---

## 📝 Health Check

Railway akan monitor endpoint:
- **Path**: `/` (homepage)
- **Timeout**: 300 seconds
- **Expected**: HTTP 200 OK

Test deployment:
```bash
curl https://your-frontend.railway.app
```

---

## 🌐 Service Communication

### Same Project (Backend + Frontend):

**Internal URLs (lebih cepat, tidak keluar internet):**
```bash
# Frontend bisa akses backend via:
NUXT_PUBLIC_API_BASE=http://backend:3001/api

# "backend" adalah nama service Railway
```

**Railway Private Networking:**
- Gratis
- Lebih cepat (internal network)
- Lebih aman (tidak expose ke public)

### Different Projects:

```bash
# Harus gunakan public URL:
NUXT_PUBLIC_API_BASE=https://backend.railway.app/api
```

---

## 🐛 Troubleshooting

### Build Failed

**Check logs:**
```bash
railway logs
```

**Common issues:**
- npm install timeout → Increase timeout di `railway.json`
- Build out of memory → Upgrade plan atau optimize build
- Missing env vars → Check `NUXT_PUBLIC_API_BASE` exists

### Runtime Errors

1. **CORS Error:**
   ```
   Access to fetch at 'backend-url' from origin 'frontend-url' has been blocked
   ```
   **Fix:** Update `FRONTEND_URL` di backend Railway variables

2. **API Connection Failed:**
   ```
   Failed to fetch from API
   ```
   **Fix:** Check `NUXT_PUBLIC_API_BASE` correct dan backend running

3. **SSR Hydration Mismatch:**
   - Check data fetching uses `useAsyncData`
   - Verify backend API returns consistent data

### Deployment Slow

```bash
# Clear build cache
railway run npm cache clean --force

# Or delete and redeploy service
```

---

## 🎨 Static Assets

**Public files** (di `/public`):
- Accessible di: `https://your-app.railway.app/image.jpg`
- Railway serve otomatis

**Uploaded files:**
- Gunakan backend file upload API
- Atau gunakan CDN seperti Cloudinary

---

## 💰 Pricing Estimate

**Starter Plan:**
- Frontend: ~$5/month (512MB RAM)
- **Total dengan backend: ~$15/month**

**Optimizations:**
- Enable Railway caching
- Use CDN untuk static assets
- Optimize Nuxt bundle size

---

## 📊 Performance Monitoring

### Railway Built-in Metrics:
- CPU usage
- Memory usage
- Request count
- Response time

### External Monitoring (Optional):
- Google Analytics
- Sentry untuk error tracking
- LogRocket untuk session replay

---

## 🔗 Useful Links

- Railway Dashboard: https://railway.app/dashboard
- Railway Docs: https://docs.railway.app
- Nuxt Deployment: https://nuxt.com/docs/getting-started/deployment
- Project Repo: https://github.com/FuncSmile/shosha_FE

---

## ✅ Deployment Checklist

- [ ] Backend sudah deploy dan dapat URL
- [ ] Railway project/service created
- [ ] Environment variables configured
- [ ] `NUXT_PUBLIC_API_BASE` pointing to backend
- [ ] GitHub secrets added
- [ ] Initial deploy successful
- [ ] Homepage accessible
- [ ] API calls working (check browser console)
- [ ] CORS configured di backend
- [ ] Custom domain setup (optional)

---

## 🔄 Update Deployment

```bash
# Via git push (automatic):
git add .
git commit -m "feat: update feature"
git push origin main

# Via Railway CLI:
railway up

# Rollback to previous deployment:
railway rollback
```

---

## 🆘 Support

Jika ada masalah:
1. Check Railway logs: `railway logs`
2. Check GitHub Actions logs
3. Check browser console untuk frontend errors
4. Check Network tab untuk API requests
5. Railway Discord: https://discord.gg/railway

---

## 📱 Mobile/PWA Support

Nuxt 3 mendukung PWA. Tambahkan module:

```bash
npm install @vite-pwa/nuxt
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@vite-pwa/nuxt'],
  pwa: {
    manifest: {
      name: 'ShoshaMart',
      short_name: 'ShoshaMart',
      description: 'Internal Marketplace',
    }
  }
})
```

Deploy ulang dan Railway akan serve PWA manifest.
