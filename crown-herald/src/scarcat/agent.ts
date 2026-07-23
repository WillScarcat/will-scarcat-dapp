import Anthropic from '@anthropic-ai/sdk';
import type { WillMarketData } from './analysis.js';

const SYSTEM_PROMPT = `Sen SCARCAT Intelligence'sın — Will Scarcat ($WILL) projesinin AI analiz ajanı.
Robinhood Chain (id: 4663) üzerindeki $WILL token'ına odaklanırsın.
Kısa, net ve kedi temalı analizler yaparsın. Her mesajda 🐱 emojisi kullan.
Teknik ama eğlenceli ol. Türkçe yaz. Maksimum 3 paragraf, direkt ve özlü.
Wash trading gördüğünde açıkça uyar. Whale hareketlerini yorumla.`;

function buildPrompt(data: WillMarketData): string {
  const washInfo = `Wash trading skoru: ${data.washScore}/100 (${data.washVerdict})`;
  const whaleInfo = `Büyük transfer sayısı: ${data.whales.length}`;
  const catInfo = data.catCounts !== null
    ? `Kedi seçimleri: ${JSON.stringify(data.catCounts)}`
    : 'Kedi seçim verisi yok';

  return [
    `$WILL anlık piyasa verisi:`,
    `Fiyat (ETH): ${data.pair.priceNative}`,
    `24s değişim: ${data.pair.priceChangeH24.toFixed(2)}%`,
    `Hacim 24s: $${data.pair.volume24h.toLocaleString('en-US')}`,
    `Likidite: $${data.pair.liquidityUsd.toLocaleString('en-US')}`,
    washInfo,
    `Alım/satım 24s: ${data.pair.buys24h}/${data.pair.sells24h}`,
    `Sahip sayısı: ${data.stats.holderCount}`,
    whaleInfo,
    catInfo,
    ``,
    `Bu verilere dayanarak kısa bir piyasa yorumu yap.`,
  ].join('\n');
}

export async function generateScarcatComment(
  apiKey: string,
  data: WillMarketData,
): Promise<string> {
  const client = new Anthropic({ apiKey });

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: buildPrompt(data) }],
  });

  const block = response.content[0];
  if (block.type !== 'text') return '🐱 Analiz üretilemedi.';
  return block.text;
}
