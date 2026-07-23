# SCARCAT-UI — Faz 1 Progress Report
*Son güncelleme: 2026-07-23*

---

## TAMAMLANDI ✅

### Design System & Tokens
- [x] **9-adım Smoke scale** — `#08090a` → `#ffffff`, Tailwind v4 `@theme` token'larına kayıtlı
- [x] **Brand tokens** — `--color-green`, `--color-green-90/80/10/6/3/20`
- [x] **Semantic tokens** — `--color-success/warning/danger/info` + `-bg` variants
- [x] **Radius system** — `--radius-sm/md/lg/xl/2xl` (6→28px)
- [x] **Duration scale** — `--duration-instant/fast/normal/slow/xslow` (80→500ms)
- [x] **Cat faction colors** — 9 kedi × CSS var (`--cat-cashcat` … `--cat-kitty`)
- [x] **Easing curves** — `--ease-out/in/inout/spring/smooth` in `:root`

### Typography
- [x] **Geist Mono** — `geist` npm paketi kurulu, `GeistSans` + `GeistMono` layout.tsx'te
- [x] **Font tokens** — `--font-sans: var(--font-geist-sans)`, `--font-mono: var(--font-geist-mono)`
- [x] `.wc-mono` → Geist Mono'ya güncellendi (Courier New'den çıkarıldı)
- [x] **Letter spacing** — `.hero-title -0.04em`, `.stat-value -0.02em`

### Glassmorphism
- [x] `glass-card` — base (rgba 3%, blur 12px)
- [x] `glass-active` — hover/selected (rgba 6%, blur 16px, saturate 180%)
- [x] `glass-surface` — nav/sidebar (rgba 85%, blur 24px, saturate 200%)
- [x] `glass-hero` — featured (rgba 2%, blur 40px, saturate 200%)

### Elevation & Shadow
- [x] `elevation-1/2/3` — border + shadow system (dark mode appropriate)
- [x] `glow-green` / `glow-danger` — outline glow states
- [x] Per-faction glow via `--cat-color` CSS variable

### Animation
- [x] **Keyframes** — `enter-up`, `spring-pop`, `shimmer`, `toast-in`, `glow-pulse`, `confetti-*`, `reward-counter`, `nav-indicator-enter`
- [x] `cat-tilt` hover — `translateY(-4px)` + `rotateX(3deg)` (spec: -4px, eskisi -8px)
- [x] `cat-tilt:hover img` — `scale(1.08)` (spec: 1.08, eskisi 1.1)
- [x] **Stagger classes** — `.stagger-1` … `.stagger-6` (40ms interval)
- [x] `@media (prefers-reduced-motion)` — tüm animasyonlar 0.01ms

### Body Background
- [x] `#08090a` (smoke-0) — eskisi `#0f0f12`
- [x] 3-katman gradient (yeşil top-center, mor top-right, yeşil bottom-left ambient)

### Components
- [x] **BottomNav** — 4 tab (Home/Cats/Claim/Intel), 56px, blur/saturate glass, spring pill indicator
- [x] **Sidebar** — Intel (Terminal icon) eklendi, dApp→Claim rename
- [x] **Skeleton** — `SkeletonCard` + `SkeletonText`, CSS shimmer animation
- [x] **Toast** — Context + Provider, success/error/info, spring-in animation, CSS
- [x] **RewardMoment** — CSS confetti (12 particle), counter-up 600ms, haptic, Twitter+Farcaster share
- [x] **RewardsScrollFlow** — GSAP ScrollTrigger step animasyonları
- [x] **useClaim** — `isSigning` + `isConfirming` ayrı expose (TX state machine)
- [x] **RewardsDashboard** — 4-state claim button (idle/signing/confirming/confirmed), skeleton grid, toast

### Pages
- [x] **/intel** — SCARCAT Terminal scaffold (stat panels, live feed placeholder, wash trading score, tick counter)

### PWA
- [x] **manifest.json** — `background_color: #08090a`, `scope: /`, 3 shortcuts (Cats/Claim/Intel), icon purpose split (any vs maskable)
- [x] **sw.js** — CACHE bump `wc-v1 → wc-v2`, PRECACHE'e `/cats` + `/intel` eklendi
- [x] `sw-push.js` — push notification handler mevcut

---

## KALDI 🔲

### Tier 2 — Medium Effort

- [ ] **ME2: CatCard 3-variant** — `grid | list | expanded` prop sistemi, mobile'da otomatik `list`
- [ ] **ME3: BottomSheet component** — confirmation + detail view için modal replacement
- [ ] **ME5: EmptyState bileşenleri** — `no-wallet | no-cat | no-rewards | wrong-network` variants

### Tier 3 — Big Redesign

- [ ] **BR2: /intel canlı data** — Blockscout + DexScreener API entegrasyonu, SSE stream
- [ ] **BR3: Confetti polish** — faction renklerinde partiküller (şu an CSS placeholder var)
- [ ] **BR4: globals.css split** — `styles/tokens.css`, `animations.css`, `utilities.css`

### PWA / Infrastructure

- [ ] **PNG icon** — `willlogo.jpg` → `icon-192.png` + `icon-512.png` (maskable için gerekli)
- [ ] **apple-touch-icon** — 180×180 PNG
- [ ] **offline.html** polish — mevcut var, SCARCAT tema ile güncellenmeli

### Faz 2 Scope

- [ ] **Account Abstraction (EIP-4337)** — session key UX
- [ ] **Claw Score UI** — dashboard widget
- [ ] **Copy-trading UI** — signal source profiles
- [ ] **B2B API tiers** — landing page section
- [ ] **/intel live data** — Kafka/SSE pipeline tamamlandıktan sonra

---

## TEKNİK NOTLAR

| Konu | Durum |
|------|-------|
| Next.js | 16.2.11 (Turbopack) |
| Tailwind | v4 (`@theme` directive) |
| Geist font | `^1.7.2` kurulu, layout.tsx'te aktif |
| wagmi | v2.19.5 |
| viem | v2.55.5 |
| framer-motion | v12.42.2 |
| gsap | v3.15.0 |
| next-pwa | @ducanh2912/next-pwa 10.2.9 |
| Build | ✅ 11 sayfa, 0 hata |

---

## ÖNCELIK SIRASI (Sonraki Sprint)

```
Sprint 2:
  Day 1: ME2 — CatCard 3-variant + mobile list mode
  Day 2: ME3 — BottomSheet (cat confirmation + claim all)
  Day 3: ME5 — EmptyState bileşenleri
  Day 4: PNG icons + offline.html PWA polish
  Day 5: /intel skeleton → gerçek API bağlantısı (Blockscout)
```
