export type VibeName = 'contained-box' | 'binary-split' | 'saturated-field' | 'column-strips' | 'circle-reveal' | 'raw-frame';

export type FontPairing = 'serif-sans' | 'mono-serif' | 'mono-sans';
const fontPairings: FontPairing[] = ['serif-sans', 'mono-serif', 'mono-sans'];

export function getFontPairing(explicit?: string, slug?: string): FontPairing {
  if (explicit && fontPairings.includes(explicit as FontPairing)) return explicit as FontPairing;
  if (!slug) return 'serif-sans';
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = ((hash << 5) - hash) + slug.charCodeAt(i);
    hash |= 0;
  }
  return fontPairings[Math.abs(hash) % 3];
}

export const vibeDefaults: Record<VibeName, Record<string, string>> = {
  'contained-box': {
    frameColor: '#8b6914',
    frameWidth: '6',
    rotation: '-0.8',
    bgTexture: 'none',
  },
  'binary-split': {
    splitRatio: '38',
    leftBg: '#1a2744',
    rightBg: '#ffffff',
    leftContent: 'color',
    flip: 'false',
    leftRadius: '24',
  },
  'saturated-field': {
    fieldColor: '#2a5aa8',
    textColor: '#f5f0eb',
  },
  'column-strips': {
    stripWidths: '25,40,35',
    stripColors: '#1a2744,#f5f0eb,#ff6b35',
    stripContent: 'color,text,color',
  },
  'circle-reveal': {
    circleSize: '70',
    circleBg: '#f5f0eb',
    fieldBg: '#1a2744',
    circleOffset: '50,50',
  },
  'raw-frame': {
    frameBg: '#6b4423',
    shadowDepth: 'deep',
    innerOffset: '8',
    clipEdge: 'none',
  },
};

export function getVibeProps(vibe: VibeName, overrides?: Record<string, string>): Record<string, string> {
  return { ...vibeDefaults[vibe], ...overrides };
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
