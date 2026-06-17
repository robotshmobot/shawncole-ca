export type VibeName =
  | 'contained-box' | 'binary-split' | 'saturated-field'
  | 'column-strips' | 'circle-reveal' | 'raw-frame'
  | 'type-wall' | 'data-dense' | 'stripe-rhythm' | 'dot-screen';

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

export const vibeDefaults: Record<VibeName, Record<string, string>> = {
  'contained-box': {
    frameWidth: '6',
    rotation: '-0.8',
    bgTexture: 'none',
  },
  'binary-split': {
    splitRatio: '38',
    leftContent: 'color',
    flip: 'false',
    leftRadius: '24',
    splitAxis: 'vertical',
  },
  'saturated-field': {},
  'column-strips': {
    stripCount: '3',
    stripRatios: '30,40,30',
    stripPattern: 'solid',
    activeStrip: '2',
  },
  'circle-reveal': {
    maskShape: 'circle',
    maskSize: '65',
    maskPosition: 'center',
  },
  'raw-frame': {
    layers: '2',
    offsetX: '12',
    offsetY: '8',
    shadowDepth: 'medium',
  },
  'type-wall': {
    typeMode: 'stacked',
    typeFill: 'true',
    typeOpacity: '1',
    lineCount: 'auto',
  },
  'data-dense': {
    accentScale: '4',
    gridDensity: 'tight',
    dataSource: 'meta',
  },
  'stripe-rhythm': {
    stripeDirection: 'vertical',
    stripeWidths: 'equal',
    stripeCount: '8',
    textAnchor: 'bottom-left',
    textBackdrop: 'none',
  },
  'dot-screen': {
    patternType: 'halftone',
    patternScale: 'medium',
    patternDensity: '0.6',
    textTreatment: 'knockout',
  },
};

export function getVibeProps(vibe: VibeName, overrides?: Record<string, string>): Record<string, string> {
  return { ...vibeDefaults[vibe], ...overrides };
}

export interface CompositionProps {
  titleScale: string;
  titlePosition: string;
  titleRotation: string;
  titleBlend: string;
  titleWeight: string;
  titleCase: string;
  titleLeading: string;
  titleStyle: string;
  overlayText: string;
  overlayScale: string;
  overlayColor: string;
  overlayBlend: string;
  clipShape: string;
  clipSize: string;
  contentGravity: string;
  bleed: string;
  density: string;
  dividerStyle: string;
  compositionRotation: string;
  colorMode: string;
}

const compositionDefaults: CompositionProps = {
  titleScale: '1',
  titlePosition: 'default',
  titleRotation: '0',
  titleBlend: 'normal',
  titleWeight: '',
  titleCase: 'preserve',
  titleLeading: 'default',
  titleStyle: 'default',
  overlayText: '',
  overlayScale: '20',
  overlayColor: '',
  overlayBlend: 'soft-light',
  clipShape: 'none',
  clipSize: '80',
  contentGravity: 'default',
  bleed: 'false',
  density: 'default',
  dividerStyle: 'none',
  compositionRotation: '0',
  colorMode: 'analog',
};

export function getCompositionProps(vibeProps: Record<string, string>): CompositionProps {
  const result = { ...compositionDefaults };
  for (const key of Object.keys(compositionDefaults) as (keyof CompositionProps)[]) {
    if (vibeProps[key] !== undefined) {
      result[key] = vibeProps[key];
    }
  }
  return result;
}

export function compositionStyles(cp: CompositionProps): string {
  const styles: string[] = [];

  if (cp.titleScale !== '1') styles.push(`--title-scale: ${cp.titleScale}`);
  if (cp.titleRotation !== '0') styles.push(`--title-rotation: ${cp.titleRotation}deg`);
  if (cp.titleBlend !== 'normal') styles.push(`--title-blend: ${cp.titleBlend}`);
  if (cp.titleWeight) styles.push(`--title-weight: ${cp.titleWeight}`);
  if (cp.compositionRotation !== '0') styles.push(`--comp-rotation: ${cp.compositionRotation}deg`);
  if (cp.overlayScale !== '20') styles.push(`--overlay-scale: ${cp.overlayScale}vw`);

  const leadingMap: Record<string, string> = { tight: '1.0', default: '1.15', loose: '1.4', crushed: '0.85' };
  if (cp.titleLeading !== 'default') styles.push(`--title-leading: ${leadingMap[cp.titleLeading] || '1.15'}`);
  if (cp.titleStyle === 'italic') styles.push('--title-style: italic');

  const densityMap: Record<string, string> = { packed: '0.5rem', default: '', airy: '4rem', dramatic: '8rem' };
  if (cp.density !== 'default' && densityMap[cp.density]) styles.push(`--density-pad: ${densityMap[cp.density]}`);

  return styles.join('; ');
}

export function compositionClasses(cp: CompositionProps): string {
  const classes: string[] = [];
  if (cp.titlePosition !== 'default') classes.push(`comp-title-${cp.titlePosition}`);
  if (cp.contentGravity !== 'default') classes.push(`comp-gravity-${cp.contentGravity}`);
  if (cp.bleed === 'true') classes.push('comp-bleed');
  if (cp.density !== 'default') classes.push(`comp-density-${cp.density}`);
  if (cp.titleCase !== 'preserve') classes.push(`comp-case-${cp.titleCase}`);
  if (cp.clipShape !== 'none') classes.push(`comp-clip-${cp.clipShape}`);
  if (cp.compositionRotation !== '0') classes.push('comp-rotated');
  if (cp.titleScale !== '1') classes.push('comp-scaled-title');
  if (cp.titleRotation !== '0') classes.push('comp-rotated-title');
  if (cp.titleBlend !== 'normal') classes.push('comp-blend-title');
  if (cp.titleStyle !== 'default') classes.push(`comp-style-${cp.titleStyle}`);
  if (cp.overlayText) classes.push('comp-has-overlay');
  return classes.join(' ');
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
