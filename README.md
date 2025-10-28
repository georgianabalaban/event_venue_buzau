# 🎉 Event Venue Buzău - Landing Page & CMS

Un site modern pentru un spațiu de evenimente lângă Buzău, cu sistem de administrare pentru conținut (CMS).

## 🚀 Tehnologii Folosite

- **Framework:** Next.js 15 (App Router)
- **CMS:** Payload CMS 3.0
- **Database:** MongoDB Atlas (gratuit)
- **Styling:** Tailwind CSS 4.0
- **Animații:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Email:** Resend
- **Hosting:** Vercel (gratuit)
- **Language:** TypeScript

## ✨ Funcționalități

### Frontend (Landing Page):
- 🏠 **Hero Section** - Secțiune principală cu CTA
- 📖 **Despre** - Informații despre spațiu și facilități
- 🎯 **Servicii** - Tipuri de evenimente (Corporate, Nunți, Petreceri, Aniversări)
- 🖼️ **Galerie** - Imagini cu categorii (Interior, Exterior, Piscină, Evenimente)
- 📅 **Evenimente Tematice** - Evenimente organizate de business
- 📧 **Contact & Booking** - Formular de rezervare cu validare
- 🎨 **Design Modern 2025** - Gradients, glassmorphism, animații smooth

### Backend (Admin Panel):
- 🔐 **Autentificare** - Sistem de login pentru admin
- 📝 **Editor Conținut** - Editare simplă a textelor și imaginilor
- 🖼️ **Management Galerie** - Upload și organizare imagini
- 📅 **Management Evenimente** - Adăugare/editare evenimente tematice
- 📨 **Vizualizare Rezervări** - Toate cererile de rezervare
- ⚙️ **Setări Generale** - Logo, social media, informații contact

## 📦 Instalare & Setup

### 1. Instalare dependențe

```bash
npm install
```

### 2. Configurare Environment Variables

Copiază `env.template` și creează fișierul `.env.local`:

```bash
cp env.template .env.local
```

Editează `.env.local` cu propriile tale credențiale:

```env
# MongoDB Database
DATABASE_URI=mongodb+srv://username:password@cluster.mongodb.net/event-venue

# Payload CMS
PAYLOAD_SECRET=your-super-secret-key-minimum-32-characters
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Email (Resend)
RESEND_API_KEY=re_your_resend_api_key
BUSINESS_EMAIL=contact@yourvenue.ro
```

### 3. Setup Servicii Externe (GRATUITE)

#### **MongoDB Atlas** (Database - GRATUIT)
1. Mergi la [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Creează cont gratuit
3. Creează un cluster gratuit (M0 Free Tier)
4. În "Database Access" → Creează un user
5. În "Network Access" → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)
6. Click "Connect" → "Connect your application" → Copiază connection string
7. Înlocuiește `<password>` cu parola userului
8. Adaugă în `.env.local` la `DATABASE_URI`

#### **Resend** (Email - GRATUIT 100 emails/zi)
1. Mergi la [https://resend.com/](https://resend.com/)
2. Creează cont gratuit
3. Dashboard → API Keys → Create API Key
4. Copiază cheia și adaugă în `.env.local` la `RESEND_API_KEY`
5. **Important:** În producție, verifică domeniul tău pentru a trimite de la emailul tău

#### **Cloudinary** (OPȚIONAL - pentru imagini)
1. Mergi la [https://cloudinary.com/](https://cloudinary.com/)
2. Creează cont gratuit
3. Dashboard → Copiază Cloud Name, API Key, API Secret
4. Adaugă în `.env.local`

### 4. Rulare în Development

```bash
npm run dev
```

Site-ul va fi disponibil la:
- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Admin Panel:** [http://localhost:3000/admin](http://localhost:3000/admin)

### 5. Creare Cont Admin (Prima rulare)

La prima accesare a `/admin`, vei fi întâmpinat cu un formular de creare cont:
- **Email:** admin@yourdomain.ro
- **Password:** Alege o parolă puternică
- **Nume:** Numele tău

## 🚀 Deployment pe Vercel (GRATUIT)

### Pregătire

1. **Push pe GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/username/event-venue-buzau.git
git push -u origin main
```

### Deploy pe Vercel

1. Mergi la [https://vercel.com](https://vercel.com)
2. Sign up cu GitHub
3. Click "Add New Project"
4. Import repository-ul tău
5. Configurare:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build`
   - **Install Command:** `npm install`

### Adaugă Environment Variables în Vercel

În Vercel Dashboard → Settings → Environment Variables, adaugă:

```
DATABASE_URI=mongodb+srv://...
PAYLOAD_SECRET=your-secret-key-32-characters
NEXT_PUBLIC_SERVER_URL=https://your-app.vercel.app
RESEND_API_KEY=re_...
BUSINESS_EMAIL=contact@yourvenue.ro
```

6. Click "Deploy" și așteaptă ~2-3 minute

## 📝 Utilizare Admin Panel

### Accesare
1. Navighează la `https://your-domain.com/admin`
2. Login cu credențialele create

### Editare Conținut Landing Page

#### 1. Modificare Text & Secțiuni
- Du-te la **Collections → Pages**
- Selectează pagina "Home"
- Editează:
  - **Hero** (Titlu, Subtitlu, Text Buton)
  - **Despre** (Titlu, Descriere, Facilități)
  - **Servicii** (Titlu, Lista servicii)
  - **Contact** (Telefon, Email, Adresă)

#### 2. Adăugare Imagini în Galerie
- Du-te la **Collections → Gallery**
- Click "Create New"
- Upload imagine
- Adaugă titlu și categorie (Interior/Exterior/Piscină/Evenimente)
- Save

#### 3. Creare Evenimente Tematice
- Du-te la **Collections → Events**
- Click "Create New"
- Completează:
  - Titlu eveniment
  - Descriere
  - Data
  - Categorie
  - Preț
  - Număr locuri disponibile
  - Upload imagine
- Save

#### 4. Vizualizare Rezervări
- Du-te la **Collections → Bookings**
- Vezi toate cererile de rezervare
- Modifică status (Nou/Confirmat/Anulat)
- Contactează clienții prin telefon/email

#### 5. Setări Generale
- Du-te la **Globals → Settings**
- Editează:
  - Nume site
  - Tagline
  - Logo
  - Social Media (Facebook, Instagram, TikTok)
  - Informații contact

## 🎨 Customizare Design

### Culori
Editează `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },    // Culoare principală
  secondary: { ... },  // Culoare secundară
  accent: { ... },     // Culoare accent
}
```

### Font
Editează `app/layout.tsx`:

```typescript
import { Inter, Poppins } from 'next/font/google'
```

## 📧 Configurare Email pentru Producție

### Cu Domeniu Propriu (Recomandat)

1. În Resend Dashboard → Domains → Add Domain
2. Adaugă DNS records în configurarea domeniului
3. Modifică `app/api/booking/route.ts`:

```typescript
from: 'Event Venue Buzău <contact@yourdomain.ro>'
```

### Fără Domeniu (Dev/Testing)

Poți folosi `onboarding@resend.dev` dar emailurile pot ajunge în SPAM.

## 🛠️ Comenzi Utile

```bash
# Development
npm run dev

# Build pentru producție
npm run build

# Start producție local
npm run start

# Generare TypeScript types pentru Payload
npm run generate:types

# Linting
npm run lint
```

## 📱 Responsive Design

Site-ul este complet responsive:
- 📱 **Mobile** (320px+)
- 📱 **Tablet** (768px+)
- 💻 **Desktop** (1024px+)
- 🖥️ **Large Desktop** (1440px+)

## 🔒 Securitate

- ✅ Environment variables pentru date sensibile
- ✅ Autentificare pentru admin panel
- ✅ Validare formulare (client + server)
- ✅ Rate limiting pe API routes (recomandat pentru producție)
- ✅ HTTPS obligatoriu pe Vercel

## 📊 Performance

- ⚡ Next.js App Router pentru performanță maximă
- 🖼️ Image optimization automată
- 📦 Code splitting automat
- 🚀 Static Site Generation unde e posibil
- 💨 Revalidare inteligentă (60 secunde)

## 🐛 Troubleshooting

### Eroare "Cannot connect to MongoDB"
- Verifică connection string-ul în `.env.local`
- Asigură-te că IP-ul este whitelisted în MongoDB Atlas
- Verifică username/password

### Eroare "Sharp module not found"
```bash
npm install sharp --force
```

### Eroare "Cannot find module '@payload-config'"
```bash
npm run generate:types
```

### Payload Admin nu se încarcă
- Verifică că `PAYLOAD_SECRET` are minim 32 caractere
- Șterge folder `.next` și rulează `npm run dev` din nou

## 📞 Support & Contact

Pentru probleme tehnice sau întrebări:
- Verifică documentația Payload CMS: [https://payloadcms.com/docs](https://payloadcms.com/docs)
- Next.js Documentation: [https://nextjs.org/docs](https://nextjs.org/docs)

## 📄 Licență

Acest proiect este proprietate privată.

---

**Dezvoltat cu ❤️ pentru Event Venue Buzău**
