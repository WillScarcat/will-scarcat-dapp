# Will Scarcat — Implementation Plan
*Hangi değişiklikleri ne sırayla yapmalısın? Önce quick wins.*

---

## ÖZET: Mevcut Durum Analizi

Mevcut tasarım aslında **oldukça iyi**. Panik yapılacak bir durum yok.
globals.css iyi düşünülmüş, komponentler çalışıyor.

Sorunlar sıralı önem sırasıyla:
1. **Tab navigation** — 5 tab çok, navigasyon belirsiz
2. **Loading states** — spinner yerine skeleton eksik
3. **Empty/error states** — yetersiz
4. **Typography** — Courier New'den Geist Mono'ya geçiş
5. **Animation timing** — bazı yerlerde tutarsız
6. **Toast sistemi** — yok
7. **Bottom sheet** — modal yerine

---

## TIER 1 — QUICK WINS (1-2 saat, çok fayda)

### QW1: Bottom Nav → 4 Tab

**Dosya:** `components/BottomNav.tsx`

```typescript
// Eskisi: 5 tab
const TABS = [
  { label: 'Home',  href: '/',          icon: Home },
  { label: 'Cats',  href: '/cats',       icon: Cat },
  { label: 'dApp',  href: '/dapp',       icon: LayoutDashboard },
  { label: 'Stats', href: '/dapp#stats', icon: BarChart2 },
  { label: 'Claim', href: '/dapp#claim', icon: Coins },
]

// Yeni: 4 tab
const TABS = [
  { label: 'Home',  href: '/',      icon: Home },
  { label: 'Cats',  href: '/cats',  icon: Cat },
  { label: 'Claim', href: '/dapp',  icon: Coins },
  { label: 'Intel', href: '/intel', icon: Terminal },
]
```

Active indicator değişikliği:
```css
/* Eskisi: color değişimi sadece */

/* Yeni: 2px pill indicator ekle */
.tab-active-indicator {
  position: absolute;
  bottom: 6px;
  width: 20px;
  height: 2px;
  background: #CCFF00;
  border-radius: 1px;
  transition: width 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Risk:** Düşük. Stats endpoint yoksa dapp sayfası zaten stats'ı gösteriyor.
**Etki:** Büyük — kullanıcı ne yapacağını anında anlıyor.

---

### QW2: Skeleton Loading

**Yeni dosya:** `components/ui/Skeleton.tsx`

```tsx
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`skeleton-pulse rounded-lg ${className}`}
    />
  )
}
```

**globals.css'e ekle:**
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}
.skeleton-pulse {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
}
```

**Kullan:** `useWillBalance`, `useCatStats` loading state'lerinde.

**Risk:** Sıfır. Additive değişiklik.
**Etki:** Orta — perceived performance çok iyileşiyor.

---

### QW3: Letter Spacing Düzeltmesi

**globals.css'de değiştir:**

```css
/* Şu an: Courier New */
.wc-mono { font-family: 'Courier New', Courier, monospace; }

/* Şimdilik bu satırı değiştirme — font PR'ı ayrı */
/* Ama tracking'i düzelt: */

/* Hero title tracking */
.hero-title {
  letter-spacing: -0.04em; /* ekle */
}

/* Stat values */
.stat-value {
  letter-spacing: -0.02em; /* ekle */
}
```

**Risk:** Sıfır. CSS only.
**Etki:** Küçük ama gözle görülür profesyonellik artışı.

---

### QW4: Body Background İyileştirmesi

**globals.css'de değiştir:**

```css
/* Şu an */
body {
  background-color: #0f0f12;
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, rgba(204,255,0,0.06) ...),
    radial-gradient(ellipse 60% 40% at 80% 80%, rgba(100,100,200,0.04) ...);
}

/* Yeni — daha derin, daha zengin */
body {
  background-color: #08090a; /* smoke-0 kullan */
  background-image:
    radial-gradient(ellipse 60% 40% at 50% -10%, rgba(204,255,0,0.05) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 90% 90%, rgba(100,100,200,0.03) 0%, transparent 60%),
    radial-gradient(ellipse 30% 20% at 10% 80%, rgba(204,255,0,0.02) 0%, transparent 50%);
}
```

Neden? Üç gradyan katmanı arka planı çok daha derinlikli yapıyor.

**Risk:** Sıfır.
**Etki:** Küçük, subtle ambient quality artışı.

---

### QW5: Toast Notification

**Yeni dosya:** `components/ui/Toast.tsx`

Context + provider pattern. Kullanımı:

```tsx
const { toast } = useToast()
toast.success('47.3 MEOW claimed!')
toast.error('Transaction failed. Try again.')
toast.warning('Low gas — transaction may be slow.')
```

CSS:
```css
.toast-container {
  position: fixed;
  bottom: calc(72px + 16px); /* nav height + gap */
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: calc(100vw - 32px);
  width: 360px;
}

.toast {
  padding: 12px 16px;
  border-radius: 12px;
  background: #1a1a24;
  border: 1px solid #282838;
  display: flex;
  gap: 12px;
  align-items: flex-start;
  animation: toast-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

**Risk:** Düşük. Yeni bileşen, mevcut kodu bozmaz.
**Etki:** Büyük — feedback loop şu an yok.

---

## TIER 2 — MEDIUM EFFORT (1 gün, ciddi iyileştirme)

### ME1: Tailwind Config Güncellemesi

**`tailwind.config.ts`** (veya globals.css `@theme` bloğu):

```css
@theme {
  /* Smoke scale — tüm adımlar */
  --color-smoke-0: #08090a;
  --color-smoke-1: #0f0f12;
  --color-smoke-2: #14141a;
  --color-smoke-3: #1a1a24;
  --color-smoke-4: #20202c;
  --color-smoke-5: #282838;
  --color-smoke-6: #363650;
  --color-smoke-7: #4a4a70;
  --color-smoke-8: #8888a8;
  --color-smoke-9: #ffffff;

  /* Semantic colors */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-danger:  #ef4444;
  --color-info:    #60a5fa;

  /* Spacing (4px grid) */
  --spacing-1:  4px;
  --spacing-2:  8px;
  --spacing-3:  12px;
  --spacing-4:  16px;
  --spacing-6:  24px;
  --spacing-8:  32px;
  --spacing-12: 48px;
  --spacing-16: 64px;

  /* Border radius */
  --radius-sm:   6px;
  --radius-md:   10px;
  --radius-lg:   14px;
  --radius-xl:   20px;
  --radius-2xl:  28px;

  /* Duration */
  --duration-instant: 80ms;
  --duration-fast:    150ms;
  --duration-normal:  220ms;
  --duration-slow:    350ms;
  --duration-xslow:   500ms;
}
```

**Risk:** Orta — mevcut `wc-*` token'ları çift tutulacak migration süresi için.
Önce yeni token'ları ekle, sonra bileşenleri yavaş yavaş geçir.
**Etki:** Büyük — tüm gelecek geliştirme hızlanır.

---

### ME2: CatCard Refactor

`components/CatCard.tsx` — 3 variant props ekle:

```tsx
type Props = {
  cat: Cat
  variant?: 'grid' | 'list' | 'expanded'  // YENİ
  // ... mevcut props
}

// Variant'a göre render
if (variant === 'list') return <CatCardList {...} />
if (variant === 'expanded') return <CatCardExpanded {...} />
return <CatCardGrid {...} />  // default
```

Mobile'da otomatik `list` variant:
```tsx
const isMobile = useMediaQuery('(max-width: 768px)')
const effectiveVariant = variant ?? (isMobile ? 'list' : 'grid')
```

**Risk:** Orta — component API değişiyor, tüm kullanım yerlerini güncelle.
Mevcut: `PickYourCat.tsx`, `RewardsDashboard.tsx`
**Etki:** Büyük — mobil UX çok iyileşiyor.

---

### ME3: Bottom Sheet Component

**Yeni dosya:** `components/ui/BottomSheet.tsx`

Confirmation ve detail view için modal'ı replace eder:

```tsx
interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  snapPoints?: number[]  // % of screen height
}
```

Cat selection confirmation, Claim All confirmation için önce bu kullanılır.

**Risk:** Orta — yeni bileşen + modal replacement.
**Etki:** Büyük — mobile UX kalitesi 1 tier atlar.

---

### ME4: Transaction State Machine

`RewardsDashboard.tsx`'deki inline state yönetimini temizle:

```typescript
// hooks/useClaimWithStates.ts
type ClaimState = 
  | 'idle'
  | 'signing'     // Wallet modal açık
  | 'pending'     // TX submitted, mining
  | 'confirmed'   // Success
  | 'failed'      // Error

const { state, claim, reset } = useClaimWithStates(catId)
```

Her state için ayrı UI render:

```tsx
const buttonLabel = {
  idle:      `Claim ${cat.ticker}`,
  signing:   'Sign in Wallet...',
  pending:   'Confirming...',
  confirmed: '✓ Claimed!',
  failed:    'Failed — Retry?',
}[state]
```

**Risk:** Orta — refactor, mevcut mantığı değiştirme dikkat ister.
**Etki:** Büyük — kullanıcı her adımda ne olduğunu biliyor.

---

### ME5: Empty State Bileşenleri

**Yeni dosya:** `components/ui/EmptyState.tsx`

```tsx
type EmptyStateVariant = 
  | 'no-wallet'
  | 'no-cat'
  | 'no-rewards'
  | 'wrong-network'
  | 'loading'

<EmptyState variant="no-wallet" />
<EmptyState variant="wrong-network" onAction={() => switchChain(...)} />
```

Her variant için ikon, başlık, subtitle, CTA tanımlanmış.
**Risk:** Düşük — yeni bileşen.
**Etki:** Orta — polish artıyor.

---

## TIER 3 — BIG REDESIGN (2-3 gün, transformative)

### BR1: Geist Mono Font Migration

**`package.json`'a ekle:**
```bash
npm install geist
```

**`app/layout.tsx`'te:**
```tsx
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

// body className'e ekle: GeistMono.variable, GeistSans.variable
```

**globals.css `@theme`'de:**
```css
--font-sans: var(--font-geist-sans), 'Inter', sans-serif;
--font-mono: var(--font-geist-mono), 'Courier New', monospace;
```

Tüm `.wc-mono` class'ları güncellenir.

**Risk:** Orta-yüksek — font değişikliği layout'u etkileyebilir.
Önce dev ortamında test, spacing kontrol gerekli.
**Etki:** Çok büyük — "AI yaptı" yerine "typographer yaptı" hissi.

---

### BR2: /intel Sayfası (SCARCAT Terminal)

**Yeni sayfa:** `app/intel/page.tsx`

SCARCAT vision'dan gelen terminal özelliklerini UI'a taşı:
- Live price ticker (Robinhood Chain DEX)
- Whale alerts (büyük TX'ler)
- Wash trading score
- Cat weight distribution (pie chart veya bar)
- Recent blocks feed

**Tasarım:** Vercel + DexScreener hybrid aesthetic.
Dark terminal, monospace data, subtle green highlights.

**Risk:** Yüksek — yeni sayfa + yeni API calls.
**Etki:** Çok büyük — ürünü gerçek bir terminal yapar.

---

### BR3: Konfetti + Reward Moment

Claim success'i gerçek bir "moment" haline getir.

**`components/ClaimSuccess.tsx`:**
- CSS confetti particles (12 adet, cat faction renklerinde)
- Counter-up animation (0 → amount, 600ms)
- Haptic feedback
- Share prompt (Twitter/Farcaster)

```css
.confetti-container {
  position: fixed;
  top: 50%; left: 50%;
  pointer-events: none;
  z-index: 9999;
}
/* 12 keyframe tanımı, farklı açı ve renkler */
```

**Risk:** Düşük-orta — yeni bileşen, sadece claim success'te tetikleniyor.
**Etki:** Büyük — viral moment, kullanıcı paylaşmak ister.

---

### BR4: globals.css Refactor

Şu anki globals.css iyi ama büyük ve karmaşık bir dosya haline gelecek.

**Öneri: 4 dosyaya böl:**

```
styles/
  tokens.css      — CSS custom properties (@theme)
  base.css        — body, reset, scrollbar
  components.css  — reusable utilities (glass-card, wc-badge vs.)
  animations.css  — tüm @keyframes
```

**`globals.css`:**
```css
@import './styles/tokens.css';
@import './styles/base.css';
@import './styles/components.css';
@import './styles/animations.css';
@import "tailwindcss";
```

**Risk:** Orta — import order önemli, Tailwind 4 ile test gerek.
**Etki:** Orta — maintainability. Şu an acil değil.

---

## UYGULAMA SIRASI ÖNERİSİ

```
Hafta 1:
  Day 1 AM: QW1 (Bottom Nav 4 tab)
  Day 1 PM: QW2 (Skeleton loading) + QW5 (Toast)
  Day 2:    QW3 + QW4 (Typography + Background tweaks)

Hafta 2:
  Day 3:    ME1 (Tailwind config)
  Day 4:    ME2 (CatCard 3 variants)
  Day 5:    ME3 (Bottom Sheet)

Hafta 3:
  Day 6:    ME4 (TX State Machine)
  Day 7:    ME5 (Empty States)

Hafta 4+:
  BR1 (Geist Mono)
  BR2 (/intel page)
  BR3 (Confetti moment)
  BR4 (CSS split) — son olarak
```

---

## TAILWIND CONFIG DEĞİŞİKLİKLERİ

**`globals.css` `@theme` bloğuna eklenecekler:**

```css
/* Mevcut token'lar korunur, YENİLER eklenir: */

/* Smoke scale tamamlanır */
--color-smoke-0: #08090a;
--color-smoke-2: #14141a;  /* yeni adım */
--color-smoke-4: #20202c;  /* yeni adım */
--color-smoke-6: #363650;  /* yeni adım */
--color-smoke-7: #4a4a70;  /* yeni adım */
--color-smoke-8: #8888a8;  /* yeni adım */

/* Semantic */
--color-success: #22c55e;
--color-warning: #f59e0b;
--color-danger:  #ef4444;
--color-info:    #60a5fa;

/* Radius system */
--radius-sm:   6px;
--radius-md:   10px;
--radius-lg:   14px;
--radius-xl:   20px;
--radius-2xl:  28px;
```

**Tailwind class örnekleri yeni token'larla:**
```
bg-smoke-0    → #08090a
bg-smoke-3    → #1a1a24
text-success  → #22c55e
border-danger → #ef4444
rounded-lg    → override: 14px (radius-lg)
```

---

## globals.css REFACTOR PLANI

Şu an tek dosya, büyüyecek. Bölünme planı:

**Şimdiki yapı:**
```
globals.css (225 satır)
  ├── @import url (Google Fonts)
  ├── @import "tailwindcss"
  ├── @theme { ... }
  ├── :root { ... }
  ├── base styles
  ├── utility classes (wc-mono, wc-badge, glass-card)
  ├── @keyframes (marquee, counter-up, pulse-dot)
  ├── Cat card styles
  ├── mobile media queries
  └── scrollbar styles
```

**Hedef yapı (100 satır üzeri olunca böl):**
```
globals.css → sadece import'lar + @theme
styles/
  animations.css → tüm @keyframes
  cat-cards.css  → cat-specific styles
  utilities.css  → wc-mono, glass-card, badge
```

Bu refactor en sona bırakılabilir — fonksiyonaliteyi değiştirmiyor.
