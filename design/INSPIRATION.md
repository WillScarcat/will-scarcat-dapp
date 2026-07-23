# Will Scarcat — Design Inspiration & References
*Her referans için: neden iyi, ne alabiliriz, hangi spec'e uygulanır.*

---

## 1. Linear.app — Motion & Typography Master

**URL:** https://linear.app  
**Kategori:** SaaS / Productivity

**Neden iyi:**
Linear, "yavaş=güven" önyargısını kırdı. Interfacesi saniyenin altında yanıt veriyor
ama aynı zamanda estetik açıdan mükemmel. Karanlık tema endüstri benchmarkı haline geldi.
Özellikle typography: sıkı tracking, düşük weight spread, her boyut kasıtlı.

**Ne alıyoruz:**
- Smoke skalası (--smoke-0 → --smoke-9) doğrudan Linear'dan ilham
- Negative letter-spacing büyük başlıklarda (-0.03em to -0.05em)
- Tab geçişlerinde 220ms timing (Linear'ın 160-400ms bandından)
- "Border-only elevation" pattern: shadow değil, border parlaklığı
- Berkeley Mono font referansı (biz Geist Mono öneriyoruz, aynı kategori)

**Will Scarcat'a spesifik uygulama:**
Terminal veri görüntülemesi (blok numarası, TX hash, adres kısaltmaları)
tamamen Linear'ın monospace+uppercase badge pattern'ını kullanabilir.

---

## 2. Stripe.com — Trust Architecture

**URL:** https://stripe.com  
**Kategori:** Fintech / Payments

**Neden iyi:**
Stripe, finansal ürünlerde "seni dolandırmayacağım" duygusunu
design language ile veriyor. Hiyerarşi mükemmel: ne yapman gerektiği
her zaman tek bir yeşil CTA'da. Error handling sektörün en iyisi.
Form focus state'leri (ring + shadow) kripto dApp'lere doğrudan transfer olur.

**Ne alıyoruz:**
- Focus ring pattern: `box-shadow: 0 0 0 3px rgba(204,255,0,0.12)` (biz yeşile çevirdik)
- Input error state: shake animation + kırmızı border + glow
- "One primary action per screen" kuralı — Claim All butonu bunu takip ediyor
- Toast notification position ve z-index management
- "Confirm before irreversible" pattern (Claim All confirmation sheet)

**Will Scarcat'a spesifik uygulama:**
Wrong network, TX failed, insufficient balance gibi error state'ler
Stripe'ın error messaging kalitesinde olmalı: net, actionable, korkutucu değil.

---

## 3. Vercel.com — Dark Minimal Pro

**URL:** https://vercel.com  
**Kategori:** Dev Tools / Infrastructure

**Neden iyi:**
Geist typeface ailesini piyasaya süren firma. Deployment ve build UI'ı
crypto trading terminalleriyle aynı bilgi yoğunluğuna sahip. Status indicators,
progress bars, log outputs — hepsi çok temiz.

**Ne alıyoruz:**
- Geist Mono font (display typography için önerimizin kaynağı)
- Deployment status animasyonu → TX confirmation animasyonuna benzer
- Log output stili → SCARCAT terminal feed stiline uygulanabilir
- Stat cards: minimal label + big number formatı
- "Noise reduction" prensibi: gereksiz decoration yok, data konuşuyor

**Will Scarcat'a spesifik uygulama:**
/intel (SCARCAT terminal) sayfasının live feed'i tamamen Vercel deployment log
aesthetic'ini takip edebilir: monospace, subtle glow, streaming lines.

---

## 4. Rainbow.me — Delightful Wallet UX

**URL:** https://rainbow.me  
**Kategori:** Crypto Wallet / Mobile App

**Neden iyi:**
Kripto uygulamaları genellikle "ciddi" görünmeye çalışırken Rainbow
eğlenceli olmayı seçti. Smooth animations, playful colors, confetti on receive,
spring physics on everything. Apple Design Award aldı (2022).
Ama eğlence hiçbir zaman clarity'nin önüne geçmiyor.

**Ne alıyoruz:**
- Spring physics (`cubic-bezier(0.34, 1.56, 0.64, 1)`) tab geçişlerinde
- Confetti on claim success (CSS lightweight particles)
- Generous border radius (24px+ bottom sheet)
- Token/NFT card design: image dominant, data minimal, color from image
- Bottom sheet paradigması (modal değil, sheet)
- Haptic feedback mapping

**Will Scarcat'a spesifik uygulama:**
Claim success anı Rainbow'un "received ETH" confetti deneyiminden ilham alıyor.
Cat faction renklerinde parçacıklar düşüyor. Bu an kullanıcıya "kattı" duygusu veriyor.

---

## 5. Uniswap.org — DEX Clarity

**URL:** https://app.uniswap.org  
**Kategori:** DEX / DeFi

**Neden iyi:**
En karmaşık DeFi işlemini (token swap) en sade hale getirdi. Swap UI
inanılmaz derecede temiz. Price impact, slippage, route — hepsi orada ama
yüz yüze değil. Progressive disclosure mükemmel uygulanmış.
2023-2024 redesign ile "fun" elementler eklendi (animasyonlar, renk kullanımı).

**Ne alıyoruz:**
- "Confirm swap" bottom sheet design
- Token pair selector pattern (cat selection'a uygulanabilir)
- TX state management (pending → confirming → confirmed)
- "Route visualization" yaklaşımı → reward dağıtımını göstermek için
- Price impact warning (kırmızı gösterim) → claimable amount feedback için

**Will Scarcat'a spesifik uygulama:**
Choose cat confirmation sheet Uniswap'ın swap confirmation sheet'iyle aynı pattern:
özet göster, kullanıcı onaylasın, TX başlasın. Clear, no surprises.

---

## 6. Coinbase Wallet (Base App) — Mobile Crypto Standard

**URL:** https://wallet.coinbase.com  
**Kategori:** Mobile Wallet / L2

**Neden iyi:**
En mainstream mobile crypto UX. Onboarding çok iyi düşünülmüş.
Bottom navigation pattern'ı (4 tab, subtle active indicator) mükemmel.
Dark theme ile aydınlık tema arasında iyi bir orta yol bulmuş.
"Trust signals" her yerde: network badge, address format, USD values.

**Ne alıyoruz:**
- 4-tab bottom nav (Stats ve dApp'i birleştirme kararımızın referansı)
- Active tab indicator: 2px pill, NOT full-width glow (subtle)
- Address formatting: 0x1234...5678 (monospace, kullanıcı tanır)
- Network badge in header (Robinhood Chain label)
- USD value alongside token amount (isteğe bağlı)

**Will Scarcat'a spesifik uygulama:**
Bottom nav spec'i büyük ölçüde Coinbase Wallet'tan. Özellikle active state
indicator ve minimum touch target (44×44px) referansları doğrudan bu kaynaktan.

---

## 7. OpenSea.io — Card & Collection Design

**URL:** https://opensea.io  
**Kategori:** NFT Marketplace

**Neden iyi:**
NFT card tasarımında standardı belirledi. Aspect ratio consistency,
image-dominant layout, metadata hierarchy (name, price, collection).
Collection/grid page interaction patterns referans kalite.

**Ne alıyoruz:**
- Cat card grid layout (image dominant, data below)
- Grid/list toggle pattern (biz de iki mod sunabiliriz)
- Hover reveal actions (buttons appear on hover — şu an mevcut ama iyileştirilebilir)
- "Verified" badge pattern → "CHOSEN" badge için referans
- Collection header (cat faction page için)

**Will Scarcat'a spesifik uygulama:**
/cats sayfası OpenSea collection page gibi düşünülebilir:
header'da faction stats, altında grid, hover reveal + seçim.

---

## 8. Raycast.com — Premium Tool Aesthetic

**URL:** https://raycast.com  
**Kategori:** Productivity / Dev Tools

**Neden iyi:**
Piyasadaki en iyi dark tool aesthetic. Apple macOS native feel ama web'de.
Command palette pattern kripto terminallere çok uygun.
Typography scale ve spacing management örnek.

**Ne alıyoruz:**
- Command palette pattern → SCARCAT terminal search bar'ı için
- Keyboard shortcut badges (KBD element styling)
- Section dividers (subtle, not heavy lines)
- "Result list" item hover state (subtle bg shift, no borders)

**Will Scarcat'a spesifik uygulama:**
/intel sayfasında "search token / address" input Raycast command palette
aesthetic'ini alabilir: blur overlay, instant results, keyboard navigation.

---

## 9. Phantom.app — Gaming Wallet Vibe

**URL:** https://phantom.app  
**Kategori:** Solana Wallet

**Neden iyi:**
Solana'nın oyun/NFT ekosistemiyle uyumlu, eğlenceli ama güvenilir.
Purple brand color güçlü. Mobile app çok iyi polished. "Staking" UI
doğrudan referans. 2024-2025 period en hızlı büyüyen wallet.

**Ne alıyoruz:**
- Staking/reward UI pattern (claimable amounts grid)
- "Your stake" vs "Earned" ayrımı
- NFT collection grid (cat images için)
- Mobile swipe gestures (satış/alış gibi left-right)
- Dark purple + accent color pairing (biz dark+lime kullanıyoruz, aynı konsept)

**Will Scarcat'a spesifik uygulama:**
Reward dashboard layout Phantom'ın staking reward UI'ından ilham alıyor:
her cat/validator için ayrı satır, yanında claimable amount ve claim button.

---

## 10. DexScreener.com — Data Terminal

**URL:** https://dexscreener.com  
**Kategori:** DEX Analytics

**Neden iyi:**
Kripto veri terminallerinin en çok kullanılanı. Yoğun veriyi compact şekilde gösteriyor.
Mobile'da da çalışıyor (PWA). Live feed UX, price ticker, whale alert patterns.
Karmaşık ama öğrenilebilir.

**Ne alıyoruz:**
- Live price ticker (marquee) format (mevcut ama iyileştirilebilir)
- "Whale alert" notification style
- Price candlestick mini-chart approach (basit sparkline versiyonu)
- Pair stats row (24h volume, marketcap, holders)
- "NEW" / "HOT" badge pattern

**Will Scarcat'a spesifik uygulama:**
/intel SCARCAT terminal sayfasının data density'si DexScreener'ı referans alıyor.
Token fiyatı, marketcap, holder count, wash trading score — kompakt ama okunabilir.

---

## 11. Farcaster / Warpcast — Social Layer

**URL:** https://warpcast.com  
**Kategori:** Crypto Social / Web3 Social

**Neden iyi:**
Web3 sosyal uygulamaların en başarılısı. Feed UX, NFT sharing, frame embeds.
Mobile-first ama Farcaster protokolünü soyutluyor. Kullanıcı wallet bilmiyor.

**Ne alıyoruz:**
- "Share achievement" pattern (cat seçimini veya claim'i paylaş)
- Frame embed concept (SCARCAT frame'ler — opsiyonel future feature)
- Feed item card design (live feed için)
- Notification pattern (claiming başarısı → share prompt)

**Will Scarcat'a spesifik uygulama:**
Claim success momentinde "Share on Farcaster" veya Twitter butonu.
"I just claimed 47 MEOW on @WillScarcat! 🐾" — viral loop.

---

## 12. Apple Design Awards 2025 Winners — Mobile Excellence

**Referans:** developer.apple.com/design/awards/

**Kazananlardan öğrenilenler (2024-2025 kategoriler):**

**Delight and Fun kategori:**
→ Confetti, haptics, spring physics artık Apple standartları.
→ "Microinteraction kalitesi" = ödül kriteri.

**Inclusivity:**
→ 44×44px minimum touch target zorunlu.
→ Reduced motion alternatifi zorunlu.
→ Dynamic Type support.

**Visual Design:**
→ Adaptive color (dark/light) — biz dark seçtik, tutarlı olmalı.
→ "Pixel-perfect on all screen sizes" — Safe Area, notch, dynamic island.

**Will Scarcat'a spesifik uygulama:**
iOS safe area kurallarına uyum (mevcut `env(safe-area-inset-bottom)` doğru).
Dynamic Island uyumluluğu için header padding (iPhone 14 Pro+).
Reduced motion alternatifi tüm keyframes için (mevcut CSS'te var, genişletilmeli).
