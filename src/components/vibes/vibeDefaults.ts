export type FontPairing = 'serif-sans' | 'mono-serif' | 'mono-sans' | 'hand-sans' | 'hand-serif';
const fontPairings: FontPairing[] = ['serif-sans', 'mono-serif', 'mono-sans', 'hand-sans', 'hand-serif'];

export function getFontPairing(explicit?: string, slug?: string): FontPairing {
  if (explicit && fontPairings.includes(explicit as FontPairing)) return explicit as FontPairing;
  if (!slug) return 'serif-sans';
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return fontPairings[Math.abs(hash) % fontPairings.length];
}

export const vibeDefaults: Record<string, string> = {};

export function getVibeProps(vibe: string, overrides?: Record<string, string>): Record<string, string> {
  return { ...vibeDefaults, ...overrides };
}

function luminance(hex: string): number {
  const rgb = hex.replace('#', '').match(/.{2}/g)!.map(c => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

export function contrastRatio(bg: string, fg: string): number {
  const l1 = Math.max(luminance(bg), luminance(fg));
  const l2 = Math.min(luminance(bg), luminance(fg));
  return (l1 + 0.05) / (l2 + 0.05);
}

export function ensureContrast(bg: string, fg: string, minRatio = 4.5): string {
  if (contrastRatio(bg, fg) >= minRatio) return fg;
  return luminance(bg) > 0.5 ? '#1a1a1a' : '#f5f0eb';
}
