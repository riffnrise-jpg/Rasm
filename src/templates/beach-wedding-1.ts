import type { Template } from './types';

const teal = { primary: '#FFF3D0', secondary: '#E7B84E', accent: '#FFE6A0', background: '#8ccfd0' };
const rose = { primary: '#FFF1D2', secondary: '#F0B55A', accent: '#FFE7B0', background: '#e6b0ac' };
const gold = { primary: '#FFF9E6', secondary: '#FFD66B', accent: '#FFFFFF', background: '#f6df8d' };

export const beachWeddingTemplate: Template = {
  slug: 'beach-wedding-1',
  name: 'Riddhi Beach',
  category: 'Wedding',
  price: 449,
  originalPrice: 900,
  // Replace public/templates/beach-wedding-1/video.mp4 with the real file. The player uses it automatically when it exists, otherwise it shows the placeholder.
  videoSrc: '/templates/beach-wedding-1/video.mp4',
  width: 1080,
  height: 1920,
  fps: 30,
  posterTime: 5,
  fonts: [
    { family: 'Pinyon Script', weights: [400] },
    { family: 'Cormorant Garamond', weights: [600] },
    { family: 'Poppins', weights: [400] },
  ],
  fields: [
    { key: 'heading', label: 'Heading text', type: 'text', default: 'Wedding Invitation', maxLength: 30 },
    { key: 'groom', label: "Groom's name", type: 'text', default: 'Riddhi', maxLength: 24 },
    { key: 'bride', label: "Bride's name", type: 'text', default: 'Shyam', maxLength: 24 },
    { key: 'date', label: 'Wedding date', type: 'date', default: '2027-01-20' },
    { key: 'extraEnabled', label: 'Add venue or time line', type: 'toggle', default: false, optional: true },
    { key: 'extra', label: 'Venue / time', type: 'text', default: '', maxLength: 44, optional: true },
    { key: 'theme', label: 'Color theme', type: 'select', default: 'teal', options: [{ label: 'Teal', value: 'teal' }, { label: 'Rose', value: 'rose' }, { label: 'Gold', value: 'gold' }] },
  ],
  themes: [
    { id: 'teal', label: 'Teal', colors: teal },
    { id: 'rose', label: 'Rose', colors: rose },
    { id: 'gold', label: 'Gold', colors: gold },
  ],
  camera: { from: 2.2, to: 1, start: 1.2, end: 4, origin: [0.5, 0.12], easing: 'easeInOutCubic', applyToVideo: false },
  layers: [
    { type: 'text', id: 'heading', content: '{heading}', fontFamily: 'Pinyon Script', sizeRatio: 0.105, weight: 400, align: 'center', x: 0.5, y: 0.12, maxWidthRatio: 0.82, lineHeight: 1.05, fill: { from: 'primary', to: 'secondary' }, shadow: { color: '#170b06dd', blur: 14 }, animation: { kind: 'letterStagger', start: 0.2, duration: 0.9, spread: 1.8, seed: 19, blur: 8, rise: 18, easing: 'easeOutCubic' } },
    { type: 'ornament', id: 'divider', svgPath: 'M0 50 C35 8 70 92 108 50 C135 20 150 20 165 50 L180 35 L195 50 C210 20 225 20 252 50 C290 92 325 8 360 50', x: 0.5, y: 0.245, widthRatio: 0.3, strokeOrFill: 'stroke', color: 'secondary', animation: { kind: 'drawOn', start: 2.7, duration: 1.2, easing: 'easeOutCubic' } },
    { type: 'text', id: 'date', content: '{date}', fontFamily: 'Cormorant Garamond', sizeRatio: 0.05, weight: 600, align: 'center', x: 0.5, y: 0.295, letterSpacing: 1, fill: 'accent', shadow: { color: '#170b06dd', blur: 12 }, animation: { kind: 'scaleIn', start: 3.5, duration: 0.9, easing: 'easeOutCubic' } },
    { type: 'text', id: 'names', content: '{groom} & {bride}', fontFamily: 'Pinyon Script', sizeRatio: 0.095, weight: 400, align: 'center', x: 0.5, y: 0.36, maxWidthRatio: 0.86, fill: { from: 'primary', to: 'secondary' }, shadow: { color: '#170b06dd', blur: 14 }, animation: { kind: 'fadeUp', start: 4, duration: 1.2, rise: 24, easing: 'easeOutCubic' } },
    { type: 'text', id: 'extra', content: '{extra}', fontFamily: 'Poppins', sizeRatio: 0.026, weight: 400, align: 'center', x: 0.5, y: 0.42, maxWidthRatio: 0.8, fill: 'secondary', animation: { kind: 'fade', start: 4.8, duration: 0.8, easing: 'easeOutCubic' } },
    { type: 'image', id: 'corner-deco', src: '/templates/beach-wedding-1/deco-corner.png', x: 0.82, y: 0.02, widthRatio: 0.18, animation: { kind: 'sway', start: 0, duration: 1, easing: 'linear' } },
  ],
};
