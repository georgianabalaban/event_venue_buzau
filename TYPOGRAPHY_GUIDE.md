# 📝 Typography Guide - Event Venue Buzău

## 🎯 Sistem de Fonturi

### Fonturi Disponibile:

1. **Poppins** - Display/Headings (Modern, Geometric, Warm)
2. **Inter** - Body/UI (Neutral, Highly Readable)  
3. **Playfair Display** - Accents (Elegant, Serif, Luxurious)

---

## 🔤 Ierarhie Tipografică

### Headings (folosesc Poppins)

```tsx
// Hero - Extra Large
<h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold">
  Bun venit la Event Venue Buzău
</h1>

// Section Titles - Large
<h2 className="font-heading text-4xl md:text-5xl font-bold">
  Serviciile Noastre
</h2>

// Subsections - Medium
<h3 className="font-heading text-2xl md:text-3xl font-semibold">
  Despre Noi
</h3>

// Card Titles - Small
<h4 className="font-heading text-xl font-semibold">
  Petreceri Corporate
</h4>
```

### Body Text (folosesc Inter)

```tsx
// Paragraphs - Normal
<p className="font-sans text-base md:text-lg text-gray-700">
  Conținut principal...
</p>

// Lead Paragraph - Larger
<p className="font-sans text-lg md:text-xl text-gray-600">
  Introducere sau subheading important...
</p>

// Small Text
<p className="font-sans text-sm text-gray-600">
  Detalii secundare, footer text...
</p>
```

### Accente Elegante (folosesc Playfair)

```tsx
// Quotes / Testimonials
<blockquote className="font-serif text-xl md:text-2xl italic text-gray-700">
  "O experiență de neuitat!"
</blockquote>

// Special Highlights
<em className="font-serif text-lg italic">
  moment de suflet
</em>

// Decorative Numbers
<span className="font-serif text-6xl font-bold">
  200+
</span>
```

---

## 📐 Scale Tipografică

### Mobile (< 640px)
```
Hero:        text-4xl  (36px)
H1:          text-3xl  (30px)
H2:          text-2xl  (24px)
H3:          text-xl   (20px)
Body:        text-base (16px)
Small:       text-sm   (14px)
```

### Tablet (640px - 1024px)
```
Hero:        text-6xl  (60px)
H1:          text-5xl  (48px)
H2:          text-4xl  (36px)
H3:          text-2xl  (24px)
Body:        text-lg   (18px)
Small:       text-sm   (14px)
```

### Desktop (> 1024px)
```
Hero:        text-8xl  (96px)
H1:          text-7xl  (72px)
H2:          text-5xl  (48px)
H3:          text-3xl  (30px)
Body:        text-xl   (20px)
Small:       text-base (16px)
```

---

## 🎨 Combinații Recomandate

### 1. Hero Section
```tsx
<section className="hero">
  {/* Main heading - Poppins */}
  <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold 
                 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
    Event Venue Buzău
  </h1>
  
  {/* Subheading - Inter */}
  <p className="font-sans text-xl md:text-2xl text-blue-100 font-light">
    Spațiul perfect pentru evenimente memorabile
  </p>
</section>
```

### 2. Services Cards
```tsx
<div className="service-card">
  {/* Title - Poppins */}
  <h3 className="font-heading text-xl md:text-2xl font-bold text-gray-900">
    Petreceri Corporate
  </h3>
  
  {/* Description - Inter */}
  <p className="font-sans text-base text-gray-600 leading-relaxed">
    Conferințe, team building și evenimente profesionale...
  </p>
</div>
```

### 3. Testimonials (cu accent serif)
```tsx
<div className="testimonial">
  {/* Quote - Playfair */}
  <blockquote className="font-serif text-2xl italic text-gray-700 mb-4">
    "Spațiul perfect pentru nunta noastră de vis!"
  </blockquote>
  
  {/* Name - Poppins */}
  <cite className="font-heading text-lg font-semibold not-italic">
    Ana & Mihai
  </cite>
  
  {/* Details - Inter */}
  <p className="font-sans text-sm text-gray-500">
    Nuntă • Iulie 2024
  </p>
</div>
```

### 4. Story Section (mix elegant)
```tsx
<section className="story">
  {/* Title - Poppins */}
  <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
    Povestea noastră
  </h2>
  
  {/* Body - Inter */}
  <p className="font-sans text-lg text-gray-700 leading-relaxed mb-4">
    Suntem o afacere de familie...
  </p>
  
  {/* Highlight - Playfair pentru emphasis */}
  <p className="font-serif text-xl italic text-primary-700 border-l-4 
                border-primary-600 pl-6 py-4 bg-primary-50 rounded-r-xl">
    Punem suflet în fiecare detaliu pentru ca tu să te bucuri de 
    momente unice.
  </p>
</section>
```

### 5. Gallery Text Overlay
```tsx
{/* Title slide - Poppins Extra Bold */}
<h2 className="font-heading text-5xl md:text-7xl font-extrabold tracking-tight">
  Ce veți găsi la noi?
</h2>

{/* Feature slides - Poppins Bold */}
<h2 className="font-heading text-3xl md:text-5xl font-bold">
  O grădină plină de verdeață
</h2>
```

---

## 🎭 Font Weights & Styles

### Poppins Weights:
- **400** (Regular) - Rare, doar pentru text mai puțin important
- **500** (Medium) - Subheadings, navigation
- **600** (SemiBold) - Card titles, buttons
- **700** (Bold) - Main headings
- **800** (ExtraBold) - Hero, special emphasis

### Inter Weights (automatic):
- **400** (Regular) - Body text standard
- **500** (Medium) - Slightly emphasized text
- **600** (SemiBold) - Strong emphasis, UI elements
- **700** (Bold) - Very strong emphasis (rar)

### Playfair Weights:
- **400** (Regular) - Quotes, elegant text
- **700** (Bold) - Special numbers, decorative headers

---

## 🌈 Exemplu Pagină Completă

```tsx
export default function ExamplePage() {
  return (
    <div className="page">
      {/* Navigation - Poppins Medium */}
      <nav className="font-heading font-medium text-base">
        <a href="#services">Servicii</a>
      </nav>

      {/* Hero - Poppins ExtraBold */}
      <h1 className="font-heading text-7xl font-extrabold">
        Evenimentul Tău Perfect
      </h1>
      
      {/* Hero Subtitle - Inter Light */}
      <p className="font-sans text-2xl font-light text-gray-100">
        Începe aici
      </p>

      {/* Section Title - Poppins Bold */}
      <h2 className="font-heading text-5xl font-bold">
        Servicii Premium
      </h2>

      {/* Body Content - Inter Regular */}
      <p className="font-sans text-lg leading-relaxed">
        Oferim servicii complete pentru organizarea evenimentului tău...
      </p>

      {/* Special Quote - Playfair Italic */}
      <blockquote className="font-serif text-2xl italic">
        "Un spațiu de vis pentru evenimente de neuitat"
      </blockquote>

      {/* CTA Button - Poppins SemiBold */}
      <button className="font-heading font-semibold text-lg">
        Rezervă Acum
      </button>
    </div>
  )
}
```

---

## ⚡ Performance Tips

1. **Font Loading:**
   - Toate fonturile folosesc `display: 'swap'`
   - Se încarcă asincron fără să blocheze render-ul
   - Fallback fonts sunt similare (system-ui, sans-serif)

2. **Font Subsetting:**
   - Doar Latin subset (suficient pentru română)
   - Reduce dimensiunea fișierelor
   - Loading mai rapid

3. **Variable Fonts:**
   - Poppins are multiple weights preloaded
   - Un singur request pentru toate weight-urile
   - Optimizat pentru performance

---

## 🎨 Color + Typography Combos

### Primary Theme (Blue)
```tsx
<h2 className="font-heading text-primary-600">
<p className="font-sans text-primary-700">
```

### Secondary Theme (Purple)  
```tsx
<h2 className="font-heading text-secondary-600">
<p className="font-sans text-secondary-700">
```

### Accent (Gold/Amber)
```tsx
<span className="font-heading text-accent-500 font-bold">
```

### Neutral (Gray)
```tsx
<h2 className="font-heading text-gray-900">
<p className="font-sans text-gray-700">
<small className="font-sans text-gray-500">
```

---

## 📱 Mobile-Specific

```tsx
// Mobile: Poppins mai compact
<h1 className="font-heading text-4xl leading-tight">

// Desktop: Poppins expansiv  
<h1 className="font-heading lg:text-7xl lg:tracking-tight">

// Body: Inter cu line-height optim
<p className="font-sans leading-relaxed md:leading-loose">
```

---

## ✨ Special Effects

### Gradient Text
```tsx
<h1 className="font-heading text-5xl font-bold 
               bg-gradient-to-r from-primary-600 to-secondary-600 
               bg-clip-text text-transparent">
  Text cu gradient
</h1>
```

### Text Shadow (pentru text pe imagini)
```tsx
<h2 className="font-heading text-white" 
    style={{ 
      textShadow: '0 4px 20px rgba(0,0,0,0.8), 0 8px 40px rgba(0,0,0,0.5)' 
    }}>
  Text citibil pe orice background
</h2>
```

### Letter Spacing
```tsx
// Tight pentru headings mari
<h1 className="font-heading tracking-tight">

// Normal pentru body
<p className="font-sans tracking-normal">

// Wide pentru emphasis
<span className="font-heading tracking-wide uppercase text-sm">
```

---

## 🎯 Checklist Implementare

- [x] Instalat Poppins pentru headings
- [x] Instalat Playfair Display pentru accente
- [x] Configurat Tailwind cu noile fonturi
- [x] Aplicat în CSS global
- [x] Testat în Gallery component
- [ ] Aplicat în Hero section (recomandat)
- [ ] Aplicat în Services cards (recomandat)
- [ ] Aplicat în Story section (recomandat)
- [ ] Aplicat în Testimonials (recomandat)

---

**Pro Tip:** 
Pentru consistency, folosește întotdeauna:
- `font-heading` pentru h1-h6
- `font-sans` pentru paragraphs
- `font-serif` doar pentru accente speciale (quotes, highlights)

Acest sistem creează o ierarhie vizuală clară și profesională! 🎨
