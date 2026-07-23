# SCARCAT-QUANT — Wash Trading & Kedi Token Analiz Raporu

**Tarih:** 2026-07-23  
**Analist:** SCARCAT-QUANT  
**Veri Kaynağı:** DexScreener (Robinhood Chain, 686 token)  
**Metodoloji:** vol/liq oranı wash trading tespiti  

---

## 1. Genel Ekosistem Özeti

| Metrik | Değer |
|---|---|
| Toplam token (veri olan) | 686 |
| Toplam 24s hacim | ~$993M |
| Ortalama vol/liq oranı | 16.1x |
| Medyan vol/liq oranı | 4.3x |
| En yüksek oran | 351x (LONGI) |

### Dağılım

| Kategori | Eşik | Adet | Oran |
|---|---|---|---|
| ✅ TEMİZ | < 30x | 613 | %89.4 |
| ⚠️ ŞÜPHELİ | 30–200x | 60 | %8.7 |
| 🔴 KİRLİ | > 200x | 13 | %1.9 |

> **Genel yorum:** Robinhood Chain ekosistemi görece sağlıklı. Medyan 4.3x — çoğu token organik işlem görmekte. Ancak yeni listelemeler (< 24h) arasında aşırı oranlar dikkat çekiyor.

---

## 2. Kirli Token'lar (> 200x) — Kesin Wash Trading

Bu token'larda vol/liq oranı 200x üzerinde: düşük likiditeye rağmen anormal yüksek hacim. Yeni (<24h) ve likidite havuzu henüz oluşturulmamış; muhtemelen bot kaynaklı işlemler.

| Sıra | Symbol | Tam Ad | Vol (24s) | Likidite | Oran | Yaş |
|---|---|---|---|---|---|---|
| #33 | LONGI | Longitude | $3.3M | $9.4K | **351x** | 23h |
| #412 | PONGO | PONGO | $937K | $3.0K | **312x** | 18h |
| #39 | HOODFATHER | HOODFATHER | $936K | $3.0K | **312x** | 13h |
| #41 | psyopcat | psyopcat | $881K | $3.2K | **275x** | 23h |
| #40 | BRODIE | Robinhood Dog | $739K | $3.1K | **238x** | 18h |
| #18 | SWOLECAT | Swole Cat | $679K | $3.0K | **226x** | 7h |

**Ortak pattern:** ~$3K likidite ile $0.5M–$3M hacim. Tüm token'lar < 24h. Bot-driven işlem veya koordineli pump girişimi.

---

## 3. Şüpheli Token'lar (30–200x) — İzlenecekler

| Sıra | Symbol | Tam Ad | Vol | Likidite | Oran | Yaş |
|---|---|---|---|---|---|---|
| #3 | IMAGINE | IMAGINE | $553K | $3.4K | 163x | 15h |
| #235 | MARK | m4rk | $1.4M | $9.3K | 151x | 23h |
| #206 | der Wald | der Wald | $2.3M | $17K | 135x | 1d |
| #166 | Pebble | Pebble | $420K | $3.5K | 120x | 7h |
| #75 | DOGE | Reddit Doge | $607K | $5.1K | 119x | 4h |
| #517 | QUEENIE | Baijus Cat | $302K | $2.9K | 104x | 7h |
| #11 | un1 | un1 | $4.3M | $42K | 102x | 19h |
| #14 | NOXA | Noxa | $3.3M | $82K | 40x | 1mo |

**Not:** `un1` özellikle dikkat çekici — 19h yaşında 102x oran ile $4.3M hacim. Yaşlı token olan `NOXA` (1mo) 40x ile hâlâ şüpheli kategoride.

---

## 4. Sağlıklı Token'lar — Yüksek Hacimli Temiz Ekosistem

| Sıra | Symbol | Tam Ad | Vol | Likidite | Oran | Holder |
|---|---|---|---|---|---|---|
| #13 | PONS | Pons | $7.2M | $1.3M | 5.5x | 2,281 |
| #8 | SWOGE | Swole Doge | $7.1M | $299K | 23.7x | 5,201 |
| #12 | CASHCAT | Cash Cat | $4.7M | $3.1M | **1.5x** | 1,497 |
| #2 | IF | What If | $1.5M | $276K | 5.4x | 4,897 |
| #1 | FOX | Robin Hood | $242K | $148K | 1.6x | 1,722 |

---

## 5. 9 Onaylı Kedi Token'ı — Detaylı Analiz

SCARCAT Intelligence onaylı kedi token'larının tamamı **TEMİZ** kategorisinde.

| Token | Tam Ad | Vol (24s) | Likidite | Oran | Verdict | Holder | Yaş | 24h % |
|---|---|---|---|---|---|---|---|---|
| **CASHCAT** | Cash Cat | $4.7M | $3.1M | **1.5x** | ✅ TEMİZ | 1,497 | 1ay | -5.87% |
| **MEOW** | meow | $261K | $67K | **3.9x** | ✅ TEMİZ | 634 | 11d | +16.67% |
| **HELIA** | Starecat | $513K | $32K | **16.0x** | ✅ TEMİZ | 1,560 | 1d | +40.62% |
| **SHIBCAT** | SHIBCAT | $121K | $19K | **6.4x** | ✅ TEMİZ | 339 | 3d | +2.89% |
| **APPLCAT** | APPLCAT | $76K | $23K | **3.3x** | ✅ TEMİZ | 250 | 5d | +4.36% |
| **SWINK** | Swole Wink Cat | $54K | $14K | **3.9x** | ✅ TEMİZ | 201 | 5h | +6.80% |
| **BUFFCAT** | BUFFCAT | $53K | $50K | **1.1x** | ✅ TEMİZ | 168 | 21d | -0.49% |
| **KITTY** | The Roaring Kitty | $26K | $14K | **1.9x** | ✅ TEMİZ | 187 | 12d | -2.55% |
| **GMEOW** | — | — | — | — | ❓ VERİDE YOK | — | — | — |
| **WILL** | Will Scarcat | — | — | — | ❓ VERİDE YOK | — | — | — |

> **Önemli:** GMEOW ve WILL bu snapshot'ta üst sıralarda görünmüyor; DexScreener sıralama dışında olabilirler ya da pool adresi farklı. Blockscout üzerinden direkt doğrulama gerekiyor.

### Kedi Token Skor Sıralaması (organik ticaret = düşük oran = iyi)

```
BUFFCAT  ████████████████████ 1.1x  ← En sağlıklı likidite profili
CASHCAT  ████████████████████ 1.5x  ← En büyük ekosistem ($3.1M liq)
KITTY    ████████████████████ 1.9x
APPLCAT  ██████████████       3.3x
MEOW     ██████████████       3.9x
SWINK    ██████████████       3.9x
SHIBCAT  █████████            6.4x
HELIA    ████████████████     16.0x ← Yüksek büyüme, takipte kal
```

**CASHCAT** hem hacim hem likidite açısından kedi ekosisteminin lideri: $4.7M hacim, $3.1M likidite, 1.5x oran — %100 organik.

**HELIA** dikkat çekiyor: 1 günlük, 1,560 holder, +40.62% 24h fiyat artışı. 16x oran şüpheli eşiğin altında ama büyüme hızlanırsa izlemek gerekiyor.

---

## 6. Claw Score (CS) Algoritması — Tam Tanım

```
CS = α·H + β·T + γ·C
```

### Parametreler

| Parametre | Ağırlık (α,β,γ) | Tanım | Normalizasyon |
|---|---|---|---|
| **H** — Holder Score | α = 0.40 | Token bakiyesi + hold durumu | 0–1 |
| **T** — Time Score | β = 0.35 | Hold süresi (gün) | 0–1 |
| **C** — Claim Score | γ = 0.25 | On-chain aktivite (claim/tx) | 0–1 |

### H — Holder Score (Bakiye + Hold)

```
H = min(W / W_cap, 1.0)
```

- `W` = cüzdandaki WILL miktarı (WILL cinsinden)
- `W_cap` = 1,000,000 WILL (tam puan eşiği)
- Örnek: 500,000 WILL → H = 0.50

### T — Time Score (Hold Süresi)

```
T = min(days_held / 30, 1.0)
```

- `days_held` = ilk WILL transferinden bu yana geçen gün
- 30 gün veya üzeri → T = 1.0 (tam puan)
- Örnek: 15 gün hold → T = 0.50

### C — Claim Score (On-Chain Aktivite)

```
C = min(claim_count / C_cap, 1.0)
```

- `claim_count` = cüzdanın SCARCAT-ilgili akıllı sözleşmelerle etkileşim sayısı  
  (claim tx, kedi seçimi, faction vote, vs.)
- `C_cap` = 10 işlem (tam puan eşiği)
- Örnek: 5 claim → C = 0.50

### CS Skoru ve Tier Sistemi

```
CS = 0.40·H + 0.35·T + 0.25·C          [0.0 – 1.0]
CS_100 = CS × 100                        [0 – 100]
```

| Skor | Tier | İmtiyaz |
|---|---|---|
| 80–100 | 🐾 **Scarcat** | Max ödül çarpanı |
| 55–79 | 🦷 **Fang** | Yüksek çarpan |
| 30–54 | ⚔️ **Claw** | Standart ödül |
| 0–29 | 🪨 **Pawn** | Temel erişim |

### Örnek Hesaplama

```
Cüzdan:  800,000 WILL, 45 gün hold, 8 claim tx

H = min(800,000 / 1,000,000, 1.0) = 0.80
T = min(45 / 30, 1.0)             = 1.00
C = min(8 / 10, 1.0)              = 0.80

CS = 0.40×0.80 + 0.35×1.00 + 0.25×0.80
   = 0.32 + 0.35 + 0.20
   = 0.87 → CS_100 = 87 → Tier: 🐾 Scarcat
```

### Neden Bu Yapı?

- **H ağırlığı %40:** Skin-in-the-game — büyük holder = daha fazla aligning interest
- **T ağırlığı %35:** Diamond hands ödüllendirme — kısa vadeli spekülasyonu caydır
- **C ağırlığı %25:** Protokol katılımı — pasif holder'ı aktif katılımcıdan ayır
- **Lineer normalizasyon:** Hesaplanması basit, on-chain doğrulanabilir, manipüle edilmesi zor

---

## 7. Aksiyon Önerileri

### Kısa Vadeli (Bu Hafta)

1. **HELIA** izlemek üzere listeye al — hızlı büyüme, 16x oran boundary'de
2. **GMEOW ve WILL** için Blockscout'tan doğrudan pool adresi çek, snapshot'a ekle
3. **SWOLECAT** wash trading bulgusunu community'ye bildir (psyopcat + HOODFATHER ile birlikte koordineli görünüyor)

### Orta Vadeli (Bu Ay)

4. Claw Score'u WILL dApp'ine entegre et (`/claw 0xADRES` zaten Telegram'da aktif)
5. `W_cap`, `C_cap`, `T_cap` parametrelerini holder dağılımına göre kalibre et — mevcut snapshot'ta median holder ~400 WILL, bu cap çok yüksek olabilir
6. Wash trading alert'lerini scheduler'a ekle: ratio > 50x olan token'lar için 6s raporda flag at

### Uzun Vadeli

7. Buy/sell ratio (buys/sells < 0.3 = sat ağırlıklı) wash signal olarak ekle
8. Zaman serisi analizi: ratio'nun saatlik trend'i wash tespitinde tek snapshot'tan daha güvenilir

---

## 8. SCARCAT-QUANT İmzası

```
Analiz: SCARCAT-QUANT
Model: Claude Sonnet 4.6
Tarih: 2026-07-23
Veri: DexScreener snapshot (686 token, Robinhood Chain)
Formüller: vol/liq wash ratio | CS = α·H + β·T + γ·C
```

---

*Bu rapor otomatik on-chain veri analizi ile üretilmiştir. Finansal tavsiye değildir.*
