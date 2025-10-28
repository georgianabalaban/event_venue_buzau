# ⚡ Quick Start - Event Venue Buzău

Ghid rapid pentru a rula proiectul local în 5 minute.

## 🚀 Setup Rapid

### 1. Instalare (1 minut)

```bash
cd event-venue-buzau
npm install
```

### 2. Environment Variables (2 minute)

Creează fișierul `.env.local` în root:

```bash
cp env.template .env.local
```

Editează `.env.local` cu credențiale reale sau folosește acestea pentru testare:

```env
# Folosește MongoDB gratuit din MongoDB Atlas
DATABASE_URI=mongodb+srv://test:test@cluster.mongodb.net/event-venue

# Generează cu: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
PAYLOAD_SECRET=1234567890123456789012345678901234567890123456789012345678901234

# URL local
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Resend API (opțional pentru dev, emailurile nu vor funcționa fără)
RESEND_API_KEY=re_your_key_here
BUSINESS_EMAIL=test@test.ro
```

### 3. Start Development Server (1 minut)

```bash
npm run dev
```

Proiectul va rula la:
- **Frontend:** http://localhost:3000
- **Admin:** http://localhost:3000/admin

### 4. Creare Cont Admin (1 minut)

1. Deschide http://localhost:3000/admin
2. Completează formularul "Create First User":
   - Email: `admin@test.ro`
   - Password: `admin123`
   - Nume: `Admin Test`
3. Login

## 📝 Next Steps

### A. Adaugă Conținut în Admin

1. **Collections → Pages** → Create "Home" page
2. **Collections → Gallery** → Upload imagini
3. **Collections → Events** → Creează evenimente
4. **Globals → Settings** → Configurează site

### B. Vezi Site-ul

Deschide http://localhost:3000 pentru a vedea landing page-ul cu conținutul adăugat.

### C. Test Booking Form

1. Scroll la secțiunea Contact
2. Completează formularul
3. Verifică în **Admin → Collections → Bookings**

## 🎯 Comenzi Utile

```bash
# Development server
npm run dev

# Build pentru producție
npm run build

# Run producție local
npm run start

# Generare Payload types
npm run generate:types
```

## 🆘 Probleme?

### "Cannot connect to database"
- Verifică `DATABASE_URI` în `.env.local`
- Folosește MongoDB Atlas gratuit (vezi README.md)

### "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Admin panel nu se încarcă
- Verifică că `PAYLOAD_SECRET` are min 32 caractere
- Șterge `.next/` și restart: `rm -rf .next && npm run dev`

## 📚 Documentație Completă

- **README.md** - Documentație completă
- **DEPLOYMENT.md** - Ghid deployment pe Vercel
- **env.template** - Template environment variables

## 🎉 Gata!

Site-ul rulează local și poți începe să dezvolți/personalizezi!

Pentru deployment în producție, vezi **DEPLOYMENT.md**.

