export type Easing = 'easeOutCubic' | 'easeInOutCubic' | 'linear';
export type AnimationKind = 'letterStagger' | 'fadeUp' | 'fade' | 'scaleIn' | 'drawOn' | 'sway' | 'pulse' | 'none';

export interface Animation {
  kind: AnimationKind;
  start: number;
  duration: number;
  easing: Easing;
  exit?: number;
  spread?: number;
  seed?: number;
  blur?: number;
  rise?: number;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'date' | 'toggle' | 'select';
  default: string | boolean;
  maxLength?: number;
  optional?: boolean;
  options?: { label: string; value: string }[];
}

export interface Theme {
  id: string;
  label: string;
  colors: { primary: string; secondary: string; accent: string; background?: string };
}

export interface TextLayer {
  type: 'text';
  id: string;
  content: string;
  fontFamily: string;
  sizeRatio: number;
  weight: number;
  align: CanvasTextAlign;
  x: number;
  y: number;
  maxWidthRatio?: number;
  lineHeight?: number;
  letterSpacing?: number;
  fill: string | { from: string; to: string };
  shadow?: { color: string; blur: number };
  animation?: Animation;
}

export interface OrnamentLayer {
  type: 'ornament';
  id: string;
  svgPath: string;
  x: number;
  y: number;
  widthRatio: number;
  strokeOrFill: 'stroke' | 'fill';
  color: string;
  animation?: Animation;
}

export interface ImageLayer {
  type: 'image';
  id: string;
  src: string;
  x: number;
  y: number;
  widthRatio: number;
  animation?: Animation;
}

export type Layer = TextLayer | OrnamentLayer | ImageLayer;

export interface Template {
  slug: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  videoSrc: string;
  width: number;
  height: number;
  fps: number;
  posterTime: number;
  duration?: number;
  fonts: { family: string; weights: number[] }[];
  fields: TemplateField[];
  themes: Theme[];
  camera?: { from: number; to: number; start: number; end: number; origin: [number, number]; easing: Easing; applyToVideo: boolean };
  layers: Layer[];
  music?: string;
}

export type TemplateData = Record<string, string | boolean | undefined>;
