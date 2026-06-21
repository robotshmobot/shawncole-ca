export type FontPairing = 'serif-sans' | 'sans-serif' | 'mono-serif' | 'mono-sans' | 'sans-sans' | 'hand-sans' | 'hand-serif';
const fontPairings: FontPairing[] = ['serif-sans', 'sans-serif', 'mono-serif', 'mono-sans', 'sans-sans', 'hand-sans', 'hand-serif'];

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
