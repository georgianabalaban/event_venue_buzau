# 🚀 Ghid Deployment - Event Venue Buzău

Ghid pas-cu-pas pentru deployment pe Vercel (100% GRATUIT).

## 📋 Checklist Pre-Deployment

- [ ] Ai cont GitHub
- [ ] Ai cont Vercel
- [ ] Ai cont MongoDB Atlas
- [ ] Ai cont Resend
- [ ] Toate variabilele de environment sunt configurate local
- [ ] Site-ul funcționează local (`npm run dev`)

## 🔧 Pas 1: Setup MongoDB Atlas (5 minute)

### 1.1 Creare Cont și Cluster

1. Mergi la [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Click "Try Free" și creează cont
3. Alege "Free Shared Cluster" (M0)
4. Region: Alege "Frankfurt" (cel mai apropiat de România)
5. Cluster Name: `event-venue` (sau lasă default)
6. Click "Create Cluster"

### 1.2 Configurare Database Access

1. În meniul lateral: **Database Access**
2. Click "Add New Database User"
3. Authentication Method: Password
4. Username: `admin-event-venue`
5. Password: Click "Autogenerate Secure Password" și **SALVEAZĂ-L**
6. Database User Privileges: "Read and write to any database"
7. Click "Add User"

### 1.3 Configurare Network Access

1. În meniul lateral: **Network Access**
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Confirm

### 1.4 Obține Connection String

1. În meniul lateral: **Database**
2. Click "Connect" pe cluster-ul tău
3. "Connect your application"
4. Driver: Node.js, Version: 5.5 or later
5. Copiază connection string:
   ```
   mongodb+srv://admin-event-venue:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. **Înlocuiește `<password>`** cu parola generată la pas 1.2
7. **SALVEAZĂ acest string** - îl vei folosi la Vercel

## 📧 Pas 2: Setup Resend (2 minute)

### 2.1 Creare Cont

1. Mergi la [https://resend.com/](https://resend.com/)
2. Sign up cu GitHub sau email
3. Confirmă emailul

### 2.2 Obține API Key

1. Dashboard → **API Keys**
2. Click "Create API Key"
3. Name: `Event Venue Production`
4. Permission: "Full access" (Sending access)
5. Click "Add"
6. **COPIAZĂ ȘI SALVEAZĂ** cheia (începe cu `re_...`)
7. ⚠️ O vei vedea o singură dată!

### 2.3 (Opțional) Verificare Domeniu

Pentru a trimite emailuri de la domeniul tău (ex: `contact@yourdomain.ro`):

1. Dashboard → **Domains**
2. Click "Add Domain"
3. Introdu domeniul: `yourdomain.ro`
4. Adaugă DNS records în panelul de management al domeniului:
   - TXT record pentru SPF
   - CNAME records pentru DKIM
5. Click "Verify"

**Dacă nu ai domeniu:** Poți folosi `onboarding@resend.dev` (funcționează, dar emailurile pot ajunge în spam).

## 🔐 Pas 3: Generare Payload Secret

Generează o cheie secretă de minim 32 caractere:

```bash
# În terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Sau folosește: https://generate-secret.vercel.app/32

**SALVEAZĂ această cheie!**

## 📂 Pas 4: Push pe GitHub

### 4.1 Inițializare Git

```bash
cd event-venue-buzau
git init
git add .
git commit -m "Initial commit - Event Venue Buzau landing page"
```

### 4.2 Creare Repository pe GitHub

**Opțiunea A: Cu GitHub CLI**
```bash
gh repo create event-venue-buzau --public --source=. --push
```

**Opțiunea B: Manual**
1. Mergi la [https://github.com/new](https://github.com/new)
2. Repository name: `event-venue-buzau`
3. Visibility: Public (sau Private)
4. **NU** adăuga README, .gitignore sau license
5. Click "Create repository"
6. Urmează instrucțiunile pentru "push an existing repository":

```bash
git remote add origin https://github.com/USERNAME/event-venue-buzau.git
git branch -M main
git push -u origin main
```

## ☁️ Pas 5: Deploy pe Vercel

### 5.1 Creare Cont Vercel

1. Mergi la [https://vercel.com/signup](https://vercel.com/signup)
2. Click "Continue with GitHub"
3. Autorizează Vercel să acceseze GitHub-ul tău

### 5.2 Import Project

1. În Vercel Dashboard: Click "Add New..." → "Project"
2. Găsește `event-venue-buzau` în listă
3. Click "Import"

### 5.3 Configurare Project

**Project Settings:**
- Framework Preset: `Next.js` (ar trebui detectat automat)
- Root Directory: `./` (lasă default)
- Build Command: `npm run build` (default)
- Install Command: `npm install` (default)
- Output Directory: `.next` (default)

**Environment Variables:**

Click "Environment Variables" și adaugă:

| Name | Value | Unde găsești |
|------|-------|--------------|
| `DATABASE_URI` | `mongodb+srv://admin-event-venue:...` | MongoDB Atlas (Pas 1.4) |
| `PAYLOAD_SECRET` | Cheia de 64 caractere | Generată la Pas 3 |
| `NEXT_PUBLIC_SERVER_URL` | `https://your-app.vercel.app` | Va fi generat după deploy, **lasă gol deocamdată** |
| `RESEND_API_KEY` | `re_...` | Resend (Pas 2.2) |
| `BUSINESS_EMAIL` | `contact@yourvenue.ro` | Emailul tău de business |

### 5.4 Deploy

1. Click "Deploy"
2. Așteaptă ~2-3 minute
3. 🎉 Site-ul va fi live!

### 5.5 Update Environment Variable

1. După deploy, vei primi un URL: `https://event-venue-buzau.vercel.app`
2. Mergi la **Settings → Environment Variables**
3. Găsește `NEXT_PUBLIC_SERVER_URL`
4. Editează și adaugă URL-ul complet: `https://event-venue-buzau.vercel.app`
5. Salvează
6. **Redeploy:** Settings → Deployments → Latest → Click "..." → "Redeploy"

## 👤 Pas 6: Creare Cont Admin

1. Navighează la `https://your-app.vercel.app/admin`
2. Vei vedea formularul de "Create First User"
3. Completează:
   - **Email:** admin@yourdomain.ro (folosește emailul tău real)
   - **Password:** Alege o parolă PUTERNICĂ (min 8 caractere)
   - **Confirm Password**
   - **Nume:** Numele tău
4. Click "Create"
5. Login cu credențialele create

## ✅ Pas 7: Configurare Inițială Conținut

### 7.1 Creează Pagina Home

1. În Admin Panel: **Collections → Pages**
2. Click "Create New"
3. Completează:
   - **Titlu:** Home
   - **Slug:** `home` (IMPORTANT: exact "home")
   - **Hero Heading:** "Spațiu unic pentru evenimente de neuitat"
   - **Hero Subheading:** "Organizăm evenimente memorabile lângă Buzău"
   - **Hero CTA Text:** "Rezervă acum"
4. Scroll și completează **Despre**, **Servicii**, **Contact**
5. Click "Save"

### 7.2 Configurează Settings

1. **Globals → Settings**
2. Completează:
   - **Nume Site:** Event Venue Buzău
   - **Tagline:** Spațiul tău pentru evenimente perfecte
   - **Social Media:** Link-uri Facebook, Instagram
   - **Contact:** Email, Telefon, Adresă
3. Click "Save"

### 7.3 Adaugă Imagini în Galerie

1. **Collections → Gallery**
2. Click "Create New"
3. Upload imagine
4. Completează:
   - **Title:** Descriere imagine
   - **Alt:** Text alternativ pentru SEO
   - **Category:** Interior/Exterior/Piscină/Evenimente
5. Repetă pentru fiecare imagine
6. **Recomandare:** Minim 6-8 imagini

### 7.4 Creează Evenimente Tematice

1. **Collections → Events**
2. Click "Create New"
3. Completează:
   - **Titlu eveniment**
   - **Descriere**
   - **Data**
   - **Categorie**
   - **Preț** (opțional)
   - **Locuri disponibile**
   - Upload **imagine**
4. Click "Save"

## 🎨 Pas 8: Customizare (Opțional)

### Custom Domain

1. În Vercel: **Settings → Domains**
2. Adaugă domeniul tău: `www.yourvenue.ro`
3. Urmează instrucțiunile pentru configurare DNS
4. Update `NEXT_PUBLIC_SERVER_URL` în Environment Variables
5. Redeploy

### Analytics

Vercel oferă analytics gratuit:
1. **Analytics** tab în Vercel Dashboard
2. Vezi trafic, performanță, Core Web Vitals

## 🧪 Pas 9: Testare

### Checklist Testare:

- [ ] Homepage se încarcă corect
- [ ] Toate secțiunile sunt vizibile
- [ ] Formularul de contact funcționează
- [ ] Primești email de confirmare (client)
- [ ] Primești email cu datele rezervării (business)
- [ ] Admin panel este accesibil la `/admin`
- [ ] Poți edita conținut din admin
- [ ] Modificările apar pe site după refresh
- [ ] Site-ul este responsive pe mobile
- [ ] Toate imaginile se încarcă

### Test Formular Contact:

1. Mergi pe site la secțiunea Contact
2. Completează formularul cu date reale
3. Trimite
4. Verifică inbox-ul pentru confirmare
5. Verifică în Admin → Bookings dacă apare cererea

## 🔄 Updates & Maintenance

### Deploy Modificări

```bash
# Modifică fișiere
git add .
git commit -m "Update: descriere modificare"
git push

# Vercel va face auto-deploy (2-3 minute)
```

### Backup Database

MongoDB Atlas face backup automat, dar poți exporta:
1. MongoDB Atlas → Database → Browse Collections
2. Export to JSON

### Monitor Site

- **Uptime:** Vercel are uptime de ~99.99%
- **Errors:** Vercel Dashboard → Logs
- **Performance:** Vercel Analytics

## 💰 Costuri

| Serviciu | Plan | Cost | Limite |
|----------|------|------|--------|
| Vercel | Hobby | **GRATUIT** | 100 GB bandwidth/lună |
| MongoDB Atlas | M0 Free | **GRATUIT** | 512 MB storage |
| Resend | Free | **GRATUIT** | 100 emails/zi, 3000/lună |
| **TOTAL** | | **0 RON/lună** | |

### Când costurile cresc:

- **Vercel Pro** ($20/lună): Dacă depășești 100 GB bandwidth
- **MongoDB M2** (~$9/lună): Dacă depășești 512 MB date
- **Resend Pro** ($20/lună): Dacă trimiți >3000 emails/lună

**Pentru un business mic-mediu, FREE tier este suficient pentru început!**

## 🆘 Troubleshooting Deployment

### Error: "Internal Server Error"

**Cauză:** Probabil lipsește o variabilă de environment

**Soluție:**
1. Vercel Dashboard → Settings → Environment Variables
2. Verifică că TOATE variabilele sunt setate
3. Redeploy

### Error: "Cannot connect to database"

**Cauză:** MongoDB connection string incorect sau IP blocat

**Soluție:**
1. Verifică `DATABASE_URI` în Vercel Environment Variables
2. MongoDB Atlas → Network Access → Verifică că `0.0.0.0/0` este adăugat
3. Redeploy

### Error: "Module not found"

**Cauză:** Dependențe lipsă

**Soluție:**
```bash
rm -rf node_modules package-lock.json
npm install
git add .
git commit -m "Fix dependencies"
git push
```

### Admin Panel nu se încarcă

**Cauză:** `PAYLOAD_SECRET` lipsă sau prea scurt

**Soluție:**
1. Generează un secret nou (min 32 caractere)
2. Adaugă în Vercel Environment Variables
3. Redeploy

### Emailurile nu se trimit

**Cauză:** `RESEND_API_KEY` incorect

**Soluție:**
1. Resend Dashboard → Verifică API Key
2. Generează unul nou dacă e necesar
3. Update în Vercel Environment Variables
4. Redeploy

## 📱 Contact Support

- **Vercel:** [vercel.com/support](https://vercel.com/support)
- **MongoDB:** [mongodb.com/support](https://www.mongodb.com/support)
- **Resend:** [resend.com/support](https://resend.com/support)

---

**🎉 Felicitări! Site-ul tău este LIVE și funcțional!**

Acum poți administra conținutul din `/admin` și primesti rezervări prin formular.

