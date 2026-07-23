# Will Scarcat — Component Specifications
*Her bileşen için pixel-perfect implementasyon rehberi.*

---

## 1. CAT CARD — 3 Variant

### Variant A: Grid Card (Desktop default)

Şu anki tasarım bu varianta yakın. Küçük iyileştirmeler:

```
Size: ~200px wide, height auto (min 180px)
Padding: 16px
Border-radius: 14px

Layout (top to bottom):
  ├── [Avatar 64×64px, radius-lg]
  ├── [Cat name — Inter 600, 15px]
  ├── [$TICKER — Geist Mono 700, 10px, uppercase, letter-spacing 0.15em]
  ├── [Weight bar — 4px height, full width]
  ├── [Claimable amount — Geist Mono 500, 12px]
  └── [Action buttons row]

Hover state:
  - border-color: var(--cat-color) at 30% opacity
  - box-shadow: 0 8px 24px rgba(0,0,0,0.4)
  - transform: translateY(-4px)  ← daha az (eskisi -8px çoktu)
  - img: scale(1.08)

Selected state:
  - border: 2px solid var(--cat-color)
  - box-shadow: 0 0 0 1px var(--cat-color), 0 0 24px var(--cat-color-20)
  - CHOSEN badge: top-right corner, absolute
```

### Variant B: List Card (Mobile default)

Mobil'de grid değil, list daha iyi taranabilirlik sağlıyor.

```
Size: Full width, height 80px
Padding: 12px 16px
Border-radius: 12px
Layout: horizontal flex

┌──────────────────────────────────────────────────────┐
│  [48×48]  [Name 15px bold]   [Weight]  [Claim btn] │
│           [$TICKER 10px]     [Bar]                   │
└──────────────────────────────────────────────────────┘

Left: Avatar 48×48, radius: 10px
Middle-left: Name + Ticker stack
Middle-right: Weight percentage + mini bar (64px wide)
Right: "Claim" button OR checkmark if selected (32px sq)

No hover translate on mobile (touch device check)
Active state: scale(0.98), 100ms
```

### Variant C: Expanded Card (Modal / Detail view)

Bir kedi seçildiğinde veya tap'lendiğinde açılır.

```
Trigger: Cat card long press OR arrow chevron tap
Presentation: Bottom sheet (iOS convention) veya full-screen modal

┌─────────────────────────────────────────────────────┐
│                    ████████████                     │
│              [Avatar 96×96px, center]               │
│              [Cat Name — 24px, bold]                │
│              [$TICKER — mono, 12px, color]          │
│                                                     │
│  ┌──────────────┬──────────────┬──────────────┐    │
│  │   HOLDERS    │    WEIGHT    │   24H CLAIM  │    │
│  │   1,247      │    23.4%     │   +12.8%     │    │
│  └──────────────┴──────────────┴──────────────┘    │
│                                                     │
│  [Weight bar — full width, 8px height]              │
│                                                     │
│  YOUR POSITION                                      │
│  Balance: 1,000 WILL → 0.08% weight                │
│  Claimable: [amount] [ticker]                       │
│                                                     │
│  [CHOOSE THIS CAT]  ← full width primary btn       │
│  or [CLAIM REWARDS] if selected + claimable         │
└─────────────────────────────────────────────────────┘
```

**Bottom Sheet spec:**
```css
.bottom-sheet {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  border-radius: 24px 24px 0 0;
  background: var(--smoke-2);
  border-top: 1px solid var(--smoke-5);
  max-height: 85vh;
  overflow-y: auto;
  padding: 0 20px 40px;
  /* Drag handle */
  &::before {
    content: '';
    display: block;
    width: 36px; height: 4px;
    background: var(--smoke-6);
    border-radius: 2px;
    margin: 12px auto 20px;
  }
}
/* Backdrop */
.sheet-backdrop {
  background: rgba(0,0,0,0.7);
  backdrop-filter: blur(4px);
}
```

---

## 2. BOTTOM NAVIGATION

### Final Spec (4 Tab)

```
Height: 56px + safe-area-inset-bottom
Background: rgba(8,9,10,0.92)
Backdrop: blur(24px) saturate(200%)
Border-top: 1px solid rgba(255,255,255,0.06)

Tabs:
  [Home]  href: /
  [Cats]  href: /cats
  [Claim] href: /dapp (reward dashboard)
  [Intel] href: /intel (SCARCAT terminal — yeni sayfa)

Tab item (each):
  min-width: 25%
  padding: 8px 0
  display: flex, flex-col, center

Icon:
  Default: 20px, stroke-width 1.5, color rgba(255,255,255,0.35)
  Active:  20px, stroke-width 2.0, color #CCFF00

Label:
  Default: Geist Mono 8px, uppercase, tracking-wider, color rgba(255,255,255,0.35)
  Active:  Geist Mono 8px, uppercase, color #CCFF00

Active indicator:
  2px wide pill, bottom: 6px, background #CCFF00, border-radius 1px
  width animates: 0 → 20px (220ms spring)
  (NOT the full tab width — subtle Coinbase style)

Tab switch animation:
  Icon: scale(0.85) → scale(1.0), spring, 220ms
  Label: opacity 0.35 → 1.0, 150ms
  Indicator: width 0 → 20px, spring
```

### "Claim" Tab Badge (Unread indicator)

Claimable reward varken küçük yeşil nokta göster:

```css
.nav-badge {
  position: absolute;
  top: 6px; right: calc(50% - 14px);
  width: 6px; height: 6px;
  background: #CCFF00;
  border-radius: 50%;
  border: 1.5px solid rgba(8,9,10,0.92); /* nav bg rengi */
}
```

---

## 3. REWARD DASHBOARD — Layout

### Header Section

```
┌─────────────────────────────────────────────────────┐
│  $WILL BALANCE                    [ConnectButton]   │
│  ████,███.██ WILL                                   │
│  ≈ $XX.XX USD (opsiyonel)                           │
└─────────────────────────────────────────────────────┘
```

**$WILL sayısı:** Geist Mono 800, 32px, #CCFF00
Animasyon: Sayfa ilk yüklendiğinde 0'dan counter-up (600ms ease-out)

### Your Cat Section

```
┌─────────────────────────────────────────────────────┐
│  YOUR FACTION                                       │
│  ┌──────────────────────────────────────────────┐   │
│  │ [Avatar 48px] [Cat Name] [Ticker] [Weight] │   │
│  │               [Progress bar full width]     │   │
│  └──────────────────────────────────────────────┘   │
│  [Change Cat] ← ghost button, small, right-aligned  │
└─────────────────────────────────────────────────────┘
```

### Rewards Grid

Tüm kedilerin claimable miktarları grid halinde:

```
Mobile: 1 column (list mode)
Desktop: 2-3 column grid

Her satır (list mode):
┌─────────────────────────────────────────────────────┐
│ [Avatar 36px] [Name + Ticker]  [amount] [CLAIM btn] │
└─────────────────────────────────────────────────────┘

[CLAIM btn]:
  - Claimable > 0: primary cat-color button
  - Claimable = 0: disabled ghost, "0.00"
  - Pending: spinner, disabled
```

### Total + Claim All

```
Footer (sticky on mobile, above nav):
┌─────────────────────────────────────────────────────┐
│  TOTAL CLAIMABLE: ████.██ across X cats             │
│  [CLAIM ALL]  ← full width, #CCFF00, 56px height   │
└─────────────────────────────────────────────────────┘
```

---

## 4. WALLET CONNECTION FLOW

### Step 1: Not Connected

```
Screen: Centered empty state
  - Icon: Will Scarcat logo / mascot (animated pulse)
  - Title: "Connect to Join a Faction" (Inter 600, 24px)
  - Subtitle: "Pick a cat, earn $WILL block rewards." (Inter 400, 15px, muted)
  - [Connect Wallet] button — full width, primary, 56px
  - Footer: "No wallet yet? Just hold $WILL." (links to buy page)
```

### Step 2: Wrong Network

```
Screen: Alert state
  - Icon: Chain/Network icon + amber color
  - Title: "Wrong Network" (amber, 24px)
  - Current network shown: "Connected to: Ethereum Mainnet"
  - Target: "Required: Robinhood Chain (4663)"
  - [Switch to Robinhood Chain] — primary button
  - [Add Network Manually] — ghost, small, collapsible with RPC details
```

### Step 3: Connected, No Cat Selected

```
Screen: Onboarding state
  - "You're in! Now choose your faction." banner
  - Cat grid (all 9 cats, grid variant)
  - Sticky footer: "Choose a cat to start earning rewards"
```

### Step 4: Fully Connected

```
Screen: Normal dashboard
  - Reward dashboard layout (above)
  - Active cat banner
  - Claim buttons
```

---

## 5. CAT SELECTION FLOW

### Öncesi: Bilgi Ekranı

Kullanıcı cat seçmeden önce neyi seçtiğini anlamalı:

```
Step 0: Info Banner (once, dismissable)
┌─────────────────────────────────────────────────────┐
│  ℹ️  How Factions Work                              │
│  Your $WILL balance earns rewards in your chosen    │
│  cat's pool. You can switch cats anytime.           │
│  [Got it, show me the cats]                         │
└─────────────────────────────────────────────────────┘
```

### Selection Screen

```
Header: "Choose Your Faction" (sticky)
Subtitle: "Your $WILL earns in your chosen cat's pool"

Grid: 2 columns mobile, 3 columns tablet, auto desktop
Sort: By weight descending (güçlü kediler üstte)
Filter: opsiyonel (top 3 / all)

Each card: Grid Variant (see above)
Footer: "You have X WILL → ~Y rewards/day estimate" (opsiyonel)
```

### Confirmation Step

```
User taps "Choose [CatName]":

1. Confirmation bottom sheet açılır (NOT full page):
   ┌───────────────────────────────────────────┐
   │  [Avatar 64px]                            │
   │  Join [Cat Name] Faction?                 │
   │  Your [X] WILL → [Y]% weight             │
   │  Est. rewards: ~[Z] [TICKER]/block        │
   │                                           │
   │  [Cancel]    [Confirm & Sign]             │
   └───────────────────────────────────────────┘

2. User signs → TX pending state
3. TX confirmed → success animation
4. Navigate to /dapp (reward dashboard)
```

---

## 6. CLAIM FLOW

### Single Cat Claim

```
1. User taps [Claim MEOW]:
   - Button → "Signing..." + spinner
   - Wallet modal opens (Rainbow/MetaMask)

2. User signs:
   - Button → "Confirming..." + chain animation
   - Block confirmation (~2s Robinhood Chain)

3. Success:
   - Button → checkmark, green
   - Amount counter animates to 0 (claimed)
   - Toast: "✓ [amount] [TICKER] claimed!"
   - Vibrate: [50, 30, 50, 30, 100]
   - Balance counter-up (updated)

4. Error:
   - Button → "Failed, retry?" + red
   - Toast: "Transaction failed" + error code (collapsible)
   - Vibrate: [100, 50, 100]
   - Button resets after 3s
```

### Claim All Flow

```
1. User taps [CLAIM ALL]:
   Confirmation bottom sheet:
   ┌─────────────────────────────────────────────────┐
   │  Claim All Rewards?                             │
   │                                                 │
   │  [Cat1]: 47.3 MEOW                             │
   │  [Cat2]: 12.1 CASHCAT                          │
   │  [Cat3]: 0.9 BUFFCAT                           │
   │  ────────────────────────                       │
   │  Total: 3 transactions                          │
   │                                                 │
   │  [Cancel]    [Sign All (3 txs)]                │
   └─────────────────────────────────────────────────┘

2. Sequential TX signing (1 by 1, can't batch cross-cat)
3. Progress indicator: "2/3 claimed..."
4. Final success: Confetti + "All rewards claimed!"
```

---

## 7. STAT CARDS SYSTEM

Dashboard'daki istatistik kartları için standart spec:

```
Size: Flex, min 140px, auto grid
Height: 80px (compact) / 100px (standard) / 120px (featured)
Padding: 14px 16px
Radius: radius-lg (14px)
Background: glass-card (rgba(255,255,255,0.03))
Border: 1px solid var(--smoke-5)

Layout:
  Top: Label (Geist Mono 9px, uppercase, muted, tracking 0.1em)
  Middle: Value (Geist Mono 700-800, 24-32px, white or green)
  Bottom: Delta (11px, green if positive, red if negative, with arrow)

Example:
┌──────────────────────────┐
│  TOTAL HOLDERS           │
│  12,847                  │
│  ↑ +234 (24h)            │
└──────────────────────────┘
```
