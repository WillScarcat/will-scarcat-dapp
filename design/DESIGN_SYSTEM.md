# Will Scarcat — Design System v1.0
*Awwwards-grade design language for a crypto-native AI trading terminal.*

---

## KARAR: Tema

**Koyu tema kalıyor. Neden:**
Kullanıcılar gece saatlerinde ekrana bakarak trade yapıyor. Crypto terminalleri 24/7 açık.
Rakipler (DexScreener, Birdeye, Kaito) hep karanlık — kullanıcı beklentisi bu.
#CCFF00 asit yeşil, karanlık zemin üzerinde maksimum kontrast + enerji veriyor.
Aydınlık temada bu renk itici olurdu.

---

## 1. COLOR PALETTE

### Foundation — Smoke Scale

Zemin renkleri tek bir aileden türetildi. Amaç: derinlik hissi, ama gereksiz kontrast olmadan.

```
--smoke-0: #08090a    /* En derin arka plan — body */
--smoke-1: #0f0f12    /* Ana arka plan */
--smoke-2: #14141a    /* Sidebar, panel bg */
--smoke-3: #1a1a24    /* Card bg */
--smoke-4: #20202c    /* Card hover bg */
--smoke-5: #282838    /* Border normal */
--smoke-6: #363650    /* Border hover / input bg */
--smoke-7: #4a4a70    /* Disabled text, subtitle */
--smoke-8: #8888a8    /* Muted text */
--smoke-9: #ffffff    /* Primary text */
```

**Neden 9 adım?** Linear ve Stripe da benzer deep smoke skalası kullanıyor.
Her adım birbirinden ~7% brightness fark ediyor. Göz bu skaladaki hiyerarşiyi doğal okur.

### Brand — Acid Lime

```
--green:      #CCFF00    /* Primary — CTA, active state, selected */
--green-90:   #c7f500    /* Hover state */
--green-80:   #b8e500    /* Pressed state */
--green-10:   rgba(204,255,0,0.10)   /* Surface tint */
--green-6:    rgba(204,255,0,0.06)   /* Ambient glow */
--green-3:    rgba(204,255,0,0.03)   /* Ultra-subtle bg */
```

**Kullanım kuralı:** #CCFF00 sadece 3 yerde kullanılır:
1. Primary CTA butonları (Claim, Switch Chain, Connect)
2. Aktif/seçili state (selected cat, active nav item)
3. Kritik sayısal veri ($WILL balance, reward amount)

Her yerde kullanılırsa değer kaybeder. Sparing use = impact.

### Cat Faction Colors

Her kedi kendi renk ailesine sahip. Bu renkler sadece kedi kartlarında ve o
kedi seçildiğinde kullanılır — asla genel UI'da değil.

```
--cat-cashcat: #CCFF00    /* Acid lime — dominant, para */
--cat-meow:    #a855f7    /* Purple — mystical */
--cat-gmeow:   #38bdf8    /* Sky blue — chill */
--cat-shibcat: #f97316    /* Orange — meme energy */
--cat-buffcat: #4ade80    /* Mint green — growth */
--cat-applcat: #f87171    /* Coral red — tech */
--cat-helia:   #ff6b6b    /* Hot coral — fire */
--cat-swink:   #4ecdc4    /* Teal — cool */
--cat-kitty:   #ffe66d    /* Warm yellow — playful */
```

### Semantic Colors

```
--success:  #22c55e    /* Green — tx confirmed */
--warning:  #f59e0b    /* Amber — low gas, risk */
--danger:   #ef4444    /* Red — tx failed, error */
--info:     #60a5fa    /* Blue — pending, info */

/* Ambient versions (backgrounds) */
--success-bg: rgba(34,197,94,0.08)
--warning-bg: rgba(245,158,11,0.08)
--danger-bg:  rgba(239,68,68,0.08)
--info-bg:    rgba(96,165,250,0.08)
```

**Neden bu renkler?** Tailwind semantic palette — kullanıcılar tanıdık. Özellikle
kırmızı/yeşil semantiği kripto dünyasında evrensel: yeşil = iyi/kazanç, kırmızı = kayıp.

---

## 2. TYPOGRAPHY SCALE

### Fontlar

```
Display (hero, big numbers):  "Geist Mono" — vscode.dev, vercel.com kullanıyor
Body (UI, descriptions):      "Inter Variable" — endüstri standardı
Terminal (tickers, badges):   "Berkeley Mono" veya fallback "Courier New"
```

**Neden Geist Mono display'de?** Vercel'in kendi fontunu kendi dApp'inde görmek
kullanıcıya "profesyonel altyapı" sinyali veriyor. Terminal hissini korurken
Courier'dan çok daha temiz ve okunabilir. Linear'ın Berkeley Mono kullanımından ilham.

**Pratik not:** Geist Mono Google Fonts'ta yok ama NPM'de `geist` paketi var.
Next.js `next/font/local` veya `@fontsource/geist-mono` ile yüklenebilir.
Yoksa şimdilik Courier New'i bırak, ayrı PR'da değiştir.

### Type Scale

```
--text-2xs:  9px  / line-height: 1.4  / tracking: 0.1em    /* Badges, labels */
--text-xs:   11px / line-height: 1.5  / tracking: 0.05em   /* Secondary info */
--text-sm:   13px / line-height: 1.6  / tracking: 0         /* Body small */
--text-base: 15px / line-height: 1.6  / tracking: -0.01em  /* Body */
--text-md:   17px / line-height: 1.5  / tracking: -0.015em /* Body large */
--text-lg:   20px / line-height: 1.4  / tracking: -0.02em  /* Section title */
--text-xl:   24px / line-height: 1.3  / tracking: -0.025em /* Card title */
--text-2xl:  32px / line-height: 1.2  / tracking: -0.03em  /* Page title */
--text-3xl:  48px / line-height: 1.1  / tracking: -0.04em  /* Hero stat */
--text-4xl:  64px / line-height: 1.0  / tracking: -0.05em  /* Hero display */
```

### Font Weights

```
400 — Body text, descriptions
500 — UI labels, nav items
600 — Section headings, card titles
700 — CTA labels, important numbers
800 — Hero numbers, reward amounts
900 — Display headlines only
```

**Neden negative tracking large sizes'da?** 32px+ boyutlarda harfler birbirinden
fazla uzaklaşıyor. -0.03em ile yeniden sıkıştırılınca Linear kalitesine ulaşılıyor.
Bu, "yapay zeka yaptı" değil "typographer yaptı" hissi veriyor.

### Typography Roles

```
Terminal data    → Geist Mono 400/600, uppercase, tight tracking
Cat tickers      → Geist Mono 700, uppercase, letter-spacing: 0.15em
Section labels   → Inter 500, uppercase, 9px, letter-spacing: 0.12em
Body copy        → Inter 400, 15px, normal
Big numbers      → Geist Mono 800, 32-48px, negative tracking
Hero             → Inter 900 or Geist Mono 700, 48-64px
```

---

## 3. SPACING SYSTEM (4px Grid)

Base unit: **4px**

```
--space-1:  4px
--space-2:  8px
--space-3:  12px
--space-4:  16px     /* Component padding standard */
--space-5:  20px
--space-6:  24px     /* Section gap standard */
--space-8:  32px
--space-10: 40px
--space-12: 48px
--space-16: 64px     /* Section margin */
--space-20: 80px
--space-24: 96px
```

**Kural:** Component içi padding her zaman `--space-4` (16px) veya katları.
Card gap'ler `--space-3` (12px) mobilde, `--space-4` (16px) desktop'ta.

---

## 4. BORDER RADIUS SYSTEM

```
--radius-sm:  6px     /* Badges, tags, small inputs */
--radius-md:  10px    /* Buttons */
--radius-lg:  14px    /* Cards — ana component radius */
--radius-xl:  20px    /* Modal, bottom sheet */
--radius-2xl: 28px    /* Hero cards, featured elements */
--radius-full: 9999px /* Pills, avatar circles */
```

**Neden bu değerler?** Rainbow.me'nin delightful feeling'i büyük ölçüde
generous border-radius'tan geliyor. 14px card radius kripto uygulamalarında
"güvenli ve modern" sinyali veriyor (Coinbase Wallet ile aynı range).

---

## 5. SHADOW / ELEVATION SYSTEM

Shadows karanlık temada görünmez — bunun yerine **border + glow** kullanılıyor.

```css
/* Elevation 1 — Default card */
box-shadow: 0 1px 3px rgba(0,0,0,0.4);
border: 1px solid var(--smoke-5);

/* Elevation 2 — Hover / focused card */
box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 1px 3px rgba(0,0,0,0.4);
border: 1px solid var(--smoke-6);

/* Elevation 3 — Modal / overlay */
box-shadow: 0 24px 64px rgba(0,0,0,0.8), 0 8px 24px rgba(0,0,0,0.6);
border: 1px solid var(--smoke-6);

/* Green glow — selected state, primary CTA */
box-shadow: 0 0 0 1px var(--green), 0 0 20px rgba(204,255,0,0.15);

/* Cat color glow — per faction */
box-shadow: 0 0 0 1px var(--cat-color), 0 0 24px var(--cat-color-20);

/* Danger state */
box-shadow: 0 0 0 1px var(--danger), 0 0 12px rgba(239,68,68,0.15);
```

**Neden glow-border?** Dark mode'da klasik drop shadow görünmez.
"0 0 0 1px color" yöntemi Stripe'ın form focus sistemiyle aynı approach —
hem hover'ı hem focus'u hemde selected state'i border-glow ile ifade ediyor.

---

## 6. ANIMATION PRINCIPLES

### Duration Scale

```
--dur-instant:  80ms    /* Checkbox, toggle — kullanıcı tıkladı, hemen */
--dur-fast:     150ms   /* Button hover, badge */
--dur-normal:   220ms   /* Card hover, nav transition */
--dur-slow:     350ms   /* Page transition, modal open */
--dur-xslow:    500ms   /* Chart appear, reward count-up */
--dur-lazy:     800ms   /* Skeleton shimmer cycle */
```

**Linear yaklaşımı:** 100ms, 160ms, 400ms. Biz benzer ama biraz daha
"delightful" (Rainbow.me etkisi) için 220ms normal seçtik.

### Easing Curves

```css
--ease-out:    cubic-bezier(0.0, 0.0, 0.2, 1)    /* Element enters */
--ease-in:     cubic-bezier(0.4, 0.0, 1.0, 1)    /* Element exits */
--ease-inout:  cubic-bezier(0.4, 0.0, 0.2, 1)    /* State changes */
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1) /* Playful — cat select, reward */
--ease-smooth: cubic-bezier(0.16, 1, 0.3, 1)     /* Expo out — modals */
```

**Neden spring?** Cat selection ve claim success gibi "delightful" momentlerde
fiziksel spring easing kullanmak kullanıcıya "ödül" hissi veriyor.
Uniswap'ın swap confirmation animasyonundan ilham.

### Motion Rules

1. **Hiçbir şey sadece "appear" etmesin** — her UI elemanı bir yönden geliyor
2. **Enter: translateY(8px) → 0 + opacity 0→1** (aşağıdan yukarı = uygulamalar gibi)
3. **Exit: opacity 1→0, translateY(0) → -4px** (yukarı kayboluyor = doğal)
4. **Stagger:** Liste elemanları 40ms aralıklı çıkıyor
5. **`prefers-reduced-motion`:** Tüm animasyonlar 0.01ms'e düşüyor

---

## 7. GLASSMORPHISM SPEC

Şu anda kullanılan glassmorphism iyileştirilmeli. Sorun: tüm kartlar aynı opaklıkta.

```css
/* Base glass — standard card */
background: rgba(255,255,255,0.03);
backdrop-filter: blur(12px) saturate(150%);
border: 1px solid rgba(255,255,255,0.07);

/* Active glass — selected / hover */
background: rgba(255,255,255,0.06);
backdrop-filter: blur(16px) saturate(180%);
border: 1px solid rgba(255,255,255,0.12);

/* Surface glass — nav, sidebar */
background: rgba(8,9,10,0.85);
backdrop-filter: blur(24px) saturate(200%);
border-top: 1px solid rgba(255,255,255,0.06);

/* Hero glass — featured section */
background: rgba(255,255,255,0.02);
backdrop-filter: blur(40px) saturate(200%);
border: 1px solid rgba(255,255,255,0.05);
```

---

## 8. COMPONENT VARIANTS

### Button System

```
Variant: primary
- bg: #CCFF00, color: #0f0f12
- hover: bg #c7f500, scale(1.01)
- active: bg #b8e500, scale(0.99)
- disabled: opacity 0.4, cursor not-allowed

Variant: ghost
- bg: transparent, color: rgba(255,255,255,0.7)
- border: 1px solid rgba(255,255,255,0.12)
- hover: bg rgba(255,255,255,0.06), color: white, border-color rgba(255,255,255,0.2)

Variant: cat (per faction color)
- bg: var(--cat-color) + 14 opacity
- border: 1px solid var(--cat-color) + 33 opacity
- color: var(--cat-color)
- hover: bg var(--cat-color) + 24 opacity

Variant: danger
- bg: rgba(239,68,68,0.1)
- border: 1px solid rgba(239,68,68,0.3)
- color: #ef4444
- hover: bg rgba(239,68,68,0.15)
```

**Sizes:**
```
xs: h-7, px-3, text-10px, radius-sm
sm: h-8, px-4, text-xs, radius-sm
md: h-10, px-5, text-sm, radius-md    /* default */
lg: h-12, px-6, text-base, radius-md
xl: h-14, px-8, text-md, radius-lg   /* CTA, full-width mobile */
```

### Input System

```css
/* Base state */
background: rgba(255,255,255,0.03);
border: 1px solid var(--smoke-5);
border-radius: var(--radius-md);
padding: 10px 14px;
color: white;
transition: border-color 150ms, box-shadow 150ms;

/* Focus state */
border-color: var(--green);
box-shadow: 0 0 0 3px rgba(204,255,0,0.12);
outline: none;

/* Error state */
border-color: var(--danger);
box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
```
