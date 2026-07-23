# Will Scarcat — Mobile UX Specification
*Award-winning mobil deneyimi referans alarak hazırlanmıştır.*

---

## 1. NAVIGATION PATTERNS

### Bottom Tab Bar (Mevcut — İyileştirilecek)

**Sorunlar:**
- 5 tab çok fazla — kullanıcı karar yorgunluğu
- `Stats` ve `dApp` farkı belirsiz
- Tab labelları Türkçe kullanıcıya anlamsız (Home/Cats/dApp...)

**Öneri: 4 Tab**

```
[Home]    [Cats]    [Claim]    [Intel]
  🏠        🐱       💰          🔭
```

- `Home` → Ana sayfa, hero, stats
- `Cats` → Kedi seçimi ve mevcut kedinin detayı
- `Claim` → Reward dashboard (bu en yüksek değer eylem)
- `Intel` → SCARCAT terminal, fiyat, whale tracker

**Tasarım spec:**

```css
height: 56px;
padding-bottom: env(safe-area-inset-bottom);
background: rgba(8,9,10,0.92);
backdrop-filter: blur(20px) saturate(180%);
border-top: 1px solid rgba(255,255,255,0.06);

/* Tab item */
min-width: 44px;
min-height: 44px; /* Apple HIG minimum touch target */
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
gap: 4px;

/* Active indicator — Coinbase Wallet style */
/* Yeşil nokta değil, icon'un altında 2px yuvarlak çizgi */
.tab-active::after {
  content: '';
  width: 20px;
  height: 2px;
  background: #CCFF00;
  border-radius: 1px;
  position: absolute;
  bottom: 6px;
}
```

**Animasyon:** Tab geçişi `cubic-bezier(0.34, 1.56, 0.64, 1)` spring, 220ms.
Icon aktifleşince hafif scale(1.1) + 80ms snap. Rainbow.me'nin tab animasyonundan ilham.

### Gesture Navigation

```
Swipe Right → önceki sekme (yatay, %30+ sürükle)
Swipe Down (on card) → pull-to-refresh
Long press (cat card) → quick actions overlay
Swipe up (claim btn) → confirm modal açılır
```

**Önemli:** Swipe gesturelar Bottom Sheet ile çakışmamalı.
Bottom sheet sadece yukarı/aşağı, tab swipe yatay — bu çakışmıyor.

---

## 2. CARD INTERACTION PATTERNS

### Cat Card Touch States

```
Default →   Normal glass card, no shadow
Pressed →   scale(0.97), brightness(0.9), 100ms
Released →  spring geri dön, scale(1.0), 150ms spring
Long Press → overlay açılır, card slight blur + dim
Selected →  color border glow, animated pulse 2s infinite
```

**Fizik hissi:** Apple'ın UIKit animasyonu gibi — basınç hissi verdirecek scale.
`0.97` değeri "gerçekten bastım" hissini veriyor ama `0.93` kadar sert değil.

### Card Swipe Actions (Yeni özellik — opsiyonel)

Instagram ve Twitter pattern: kartı sağa kaydır = "Choose this cat"

```
Swipe threshold: 80px
Swipe reveal: yeşil arkaplan, checkmark icon
Swipe confirm: haptic feedback (navigator.vibrate([50, 30, 50]))
Swipe cancel: kart yerine döner, 300ms spring
```

### Scroll Behavior

```css
/* Momentum scrolling — iOS native feel */
-webkit-overflow-scrolling: touch;
scroll-behavior: smooth;

/* Card list — snapping */
scroll-snap-type: y mandatory; /* Grid modunda: x mandatory */
scroll-snap-align: start;
scroll-snap-stop: always; /* Bir seferde bir */
```

---

## 3. GESTURE DESIGN

### Pull to Refresh

Mevcut `PullToRefresh.tsx` var, spec'i şöyle olmalı:

```
Threshold: 80px sürükleme
Indicator: basit bir yeşil spinner değil —
           Will Scarcat maskot animasyonu: kedi pençesi yukarı çıkıyor

Phases:
  0-40px: No indicator (accidental drag zone)
  40-80px: Indicator görünür, "PULL" yazısı
  80px+:  "RELEASE" yazısı, spring bounce
  Release: Spinner, "CHECKING CHAIN..." yazısı
  Complete: 800ms → başarı/güncellendi
```

**Implementasyon notu:** `framer-motion` kullanmak bu animasyonu kolaylaştırır.
Şu an `framer-motion` yoksa useRef + transform ile manuel yapılabilir.

### Haptic Feedback Pattern

```javascript
// Claim başarısı
navigator.vibrate([50, 30, 50, 30, 100]); // Double tap + long

// Cat seçimi
navigator.vibrate([30, 20, 30]); // Soft confirm

// Hata
navigator.vibrate([100, 50, 100]); // Warning pattern

// Wallet connect
navigator.vibrate([20]); // Soft acknowledgment
```

---

## 4. LOADING STATES

### Skeleton Shimmer

Her kart skeleton olarak gösterilmeli, spinner değil.

```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.04) 25%,
    rgba(255,255,255,0.08) 50%,
    rgba(255,255,255,0.04) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s ease-in-out infinite;
  border-radius: var(--radius-md);
}
```

### Skeleton Layout — Cat Card

```
┌─────────────────────────────────┐
│  [56px sq]  [████████  12px]   │
│             [██████    9px ]   │
│             [████████████  ]   │  weight bar
│                                 │
│  [████████████]  [███████████] │  buttons
└─────────────────────────────────┘
```

### Transaction States

En önemli loading state: blockchain işlemi.

```
State 1: Idle
  → Normal buton

State 2: Pending (kullanıcı imzaladı, TX gönderildi)
  → Buton disabled
  → "SUBMITTING..." yazısı + spinner
  → Border pulse animasyonu (yeşil glow)

State 3: Mining (TX mined, confirmation bekleniyor)
  → "CONFIRMING..." yazısı
  → Progress indicator: 3 nokta artar
  → Estimated time göster (Robinhood Chain ~2s block time)

State 4: Confirmed
  → Success animasyonu (checkmark scale-in)
  → "CLAIMED! 47.3 MEOW" yazısı
  → Confetti particles (CSS only, lightweight)
  → Vibrate pattern

State 5: Failed
  → Error shake animation
  → Red border flash
  → "TX FAILED — TRY AGAIN" yazısı
  → Error code collapse/expand toggle
```

### Inline Loading

Sayılar yüklenirken "—" değil, skeleton:

```jsx
// Kötü:
{balance ?? '—'}

// İyi:
{balance ? balance : <span className="skeleton w-16 h-4 inline-block" />}
```

---

## 5. EMPTY STATES

Her empty state 3 elementten oluşur: İkon + Başlık + CTA

### No Wallet Connected

```
Icon: Cat silhouette (Lucide `Cat`) — animated slow pulse
Title: "Connect to Join a Faction"
Subtitle: "Pick a cat, earn rewards on every $WILL block."
CTA: [Connect Wallet] — primary button, full width mobile
Footer: "No wallet? Just hold $WILL — CashCat auto-distributes."
```

### No Cat Selected

```
Icon: Paw print → dashed border circle (seçim bekleniyor)
Title: "No Cat Chosen"
Subtitle: "Join a faction and earn from each block reward."
CTA: [Browse Cats] → /cats'e yönlendir
```

### No Rewards

```
Icon: Empty chest / small cat sleeping
Title: "0 Claimable Rewards"
Subtitle: "Block rewards accumulate every ~12 seconds."
Info: Next block countdown (polling ile)
CTA: [View Activity] — secondary
```

### Wrong Network

```
Icon: Chain broken / AlertTriangle — pulsing amber
Title: "Wrong Network"
Subtitle: "Switch to Robinhood Chain (ID: 4663) to continue."
CTA: [Switch Network] — primary
Secondary: Network details collapsible
```

---

## 6. ERROR STATES

### Toast Notification System

Şu an hata mesajları inline gösteriliyor. Toast + inline ikisi birden olmalı.

```
Position: top-center (iOS convention) veya bottom (Android)
→ Mobilde bottom toast, nav'ın üstünde (bottom: 72px)

Variants:
  success  — green border-left, checkmark icon
  error    — red border-left, X icon
  warning  — amber border-left, warning icon
  info     — blue border-left, info icon

Duration:
  success: 3000ms auto-dismiss
  error:   6000ms + manual dismiss X button (hata kaybolan mesaj olmaz)
  warning: 4000ms
  info:    3000ms

Animation: slide-in-up 220ms spring, slide-out-down 150ms ease-in
```

```css
.toast {
  max-width: calc(100vw - 32px);
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--smoke-3);
  border: 1px solid var(--smoke-6);
  border-left: 3px solid var(--status-color);
  display: flex;
  gap: 12px;
  align-items: flex-start;
}
```

### Form Validation

```
Inline error — inputun altında, 11px, danger color
Shake animation: translateX(-4px) → 4px → -2px → 2px → 0, 300ms
Focus: border-color danger, glow rgba(239,68,68,0.12)
```

---

## 7. SUCCESS ANIMATIONS

### Claim Success — "Reward Moment"

Bu an dApp'in en önemli anı. Hayal kırıklığı değil, kutlama olmalı.

```
1. TX Confirmed trigger
2. Buton → checkmark scale-in (80ms instant → spring)
3. Amount counter-up: 0 → actual amount, 600ms ease-out
4. Confetti: 12 küçük CSS particle, cat faction renklerinde
5. Haptic: [50, 30, 50, 30, 100]
6. Toast: "🐾 47.3 MEOW claimed successfully!"
7. Balance güncellenir (counter animasyonu ile)
```

**Confetti spec (CSS only, no library):**
```css
@keyframes confetti-fall {
  0%   { transform: translateY(0) rotate(0); opacity: 1; }
  100% { transform: translateY(60px) rotate(720deg); opacity: 0; }
}
.confetti-particle {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 1px;
  animation: confetti-fall 800ms ease-out forwards;
}
/* 12 particle, farklı delays ve renkler */
```

### Cat Selection Success

```
1. Card → selected glow animasyonu başlar
2. "CHOSEN" badge scale-in with spring
3. Diğer kartlar dim olur (opacity: 0.4, 300ms)
4. "You joined the [Cat] faction!" banner slide-in (top veya bottom)
5. Haptic: [30, 20, 30]
```

### Wallet Connect Success

```
1. ConnectButton → checkmark
2. WILL balance counter-up
3. "Welcome to Robinhood Chain" subtle banner
4. Mevcut kedi varsa: "You're in [Cat] faction" banner
5. Haptic: [20]
```
