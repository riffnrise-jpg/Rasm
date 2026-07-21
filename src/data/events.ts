export type EventKey = 'haldi' | 'sangeet' | 'mehandi' | 'baraat' | 'reception';

export type Screen = 'landing' | 'events' | 'details' | 'generating' | 'result';

export interface InvitationDetails {
  brideName: string;
  groomName: string;
  venue: string;
  address: string;
  eventDateTime: string;
}

export interface EventConfig {
  key: EventKey;
  name: string;
  tagline: string;
  description: string;
  accent: string; // tailwind color token base, e.g. 'haldi'
  hex: string;
  hexLight: string;
  hexDeep: string;
  motif: MotifKey;
  loadingMessages: string[];
  prompt: (d: InvitationDetails) => string;
}

export type MotifKey = 'marigold' | 'music' | 'henna' | 'dhol' | 'floral';

export const EVENTS: Record<EventKey, EventConfig> = {
  haldi: {
    key: 'haldi',
    name: 'Haldi',
    tagline: 'A golden blessing',
    description:
      'The morning of turmeric, laughter, and petals — where family paints the couple in sunlight.',
    accent: 'haldi',
    hex: '#e8a82b',
    hexLight: '#f6d27a',
    hexDeep: '#a8741a',
    motif: 'marigold',
    loadingMessages: [
      'Grinding fresh turmeric…',
      'Stringing marigold garlands…',
      'Setting the mandap in golden light…',
      'Scattering petals into the air…',
      'Adding the final golden touches…',
    ],
    prompt: (d) =>
      `Create a warm, joyful cinematic wedding invitation video for a traditional Indian Haldi ceremony. The scene shows a beautifully decorated outdoor mandap area with yellow marigold flower garlands, banana leaf decor, and soft golden-hour sunlight. Show stylized, tasteful representations of family members joyfully applying turmeric (haldi) paste to a bride and groom seated separately on decorated wooden stools, surrounded by petals and turmeric powder gently floating in the air. Include festive dhol drum rhythm energy in the visual movement and warm yellow, orange and green color tones throughout. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Haldi Ceremony", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background text or signage. The overall mood is warm, celebratory, authentic to Indian wedding traditions, cinematic and high-end, like a professional wedding videographer's highlight reel. Smooth camera movements, soft natural lighting, no jump cuts. Absolutely no spelling errors in any on-screen text.`,
  },
  sangeet: {
    key: 'sangeet',
    name: 'Sangeet',
    tagline: 'A night of music & light',
    description:
      'The evening of rhythm, jewels, and dancing — where two families become one celebration.',
    accent: 'sangeet',
    hex: '#8b5cf6',
    hexLight: '#c4b5fd',
    hexDeep: '#5b21b6',
    motif: 'music',
    loadingMessages: [
      'Tuning the instruments…',
      'Dimming the lights for the stage…',
      'Choreographing the first dance…',
      'Spinning the stage lights…',
      'Adding the final golden touches…',
    ],
    prompt: (d) =>
      `Create a vibrant, high-energy cinematic wedding invitation video for a traditional Indian Sangeet night. The scene is an elegantly lit evening venue with string lights, a dance floor, colorful uplighting in jewel tones (purple, pink, teal), and a joyful stylized crowd dancing to festive music. Show tasteful, non-specific stylized dancers and a dressed-up bride and groom sharing a joyful dance moment. Include swirling stage lights, confetti or light particle effects, and a celebratory, glamorous atmosphere. Elegant gold or white-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Sangeet Night", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is glamorous, festive, high-energy, cinematic, like a premium wedding film trailer. Smooth dynamic camera movement, rich saturated lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`,
  },
  mehandi: {
    key: 'mehandi',
    name: 'Mehandi',
    tagline: 'Henna, stories & quiet joy',
    description:
      'A soft afternoon of intricate henna, cushioned seating, and laughter among friends.',
    accent: 'mehandi',
    hex: '#2f7d4f',
    hexLight: '#7cc098',
    hexDeep: '#1a5230',
    motif: 'henna',
    loadingMessages: [
      'Mixing fresh henna paste…',
      'Tracing intricate patterns…',
      'Hanging the marigold strings…',
      'Arranging the floor cushions…',
      'Adding the final golden touches…',
    ],
    prompt: (d) =>
      `Create a soft, elegant cinematic wedding invitation video for a traditional Indian Mehandi ceremony. The scene shows a beautifully decorated daytime venue with green and white floral decor, hanging marigold strings, and comfortable floor seating with cushions. Show a stylized close-up of intricate henna (mehandi) patterns being applied to a bride's hands, with soft natural light, and a joyful, relaxed atmosphere with stylized family and friends seated around chatting and laughing. Use a calm palette of greens, whites, and soft gold. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Mehandi Ceremony", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is warm, intimate, artistic, and cinematic, like a boutique wedding videographer's short film. Smooth, slow camera pans, soft focus transitions, no abrupt cuts. Absolutely no spelling errors in any on-screen text.`,
  },
  baraat: {
    key: 'baraat',
    name: 'Baraat',
    tagline: 'A grand, triumphant arrival',
    description:
      'The procession of drums, horses, and dancing — the groom’s grand arrival, celebrated.',
    accent: 'baraat',
    hex: '#b91c1c',
    hexLight: '#f87171',
    hexDeep: '#7f1010',
    motif: 'dhol',
    loadingMessages: [
      'Polishing the dhol drums…',
      'Decorating the mare…',
      'Winding the safa turban…',
      'Lighting the procession path…',
      'Adding the final golden touches…',
    ],
    prompt: (d) =>
      `Create a grand, celebratory cinematic wedding invitation video for a traditional Indian Baraat procession. The scene shows a festive daytime or golden-hour street or venue entrance procession, with a decorated horse or vintage car, a stylized groom in traditional sherwani attire with a safa turban, surrounded by joyful stylized dancing family and friends, dhol drummers, and flower petals or confetti being thrown in celebration. Use a rich, vibrant palette of red, maroon, and gold. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Baraat", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is grand, triumphant, joyful, and cinematic, like an epic wedding film opening sequence. Dynamic but smooth camera movement, rich warm lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`,
  },
  reception: {
    key: 'reception',
    name: 'Reception',
    tagline: 'An elegant first look',
    description:
      'A glamorous evening of chandeliers, floral stages, and the couple’s grand entrance.',
    accent: 'reception',
    hex: '#c9a227',
    hexLight: '#e6cd7a',
    hexDeep: '#8a6b14',
    motif: 'floral',
    loadingMessages: [
      'Lighting the chandeliers…',
      'Arranging the floral centrepieces…',
      'Rolling out the stage carpet…',
      'Cueing the entrance music…',
      'Adding the final golden touches…',
    ],
    prompt: (d) =>
      `Create an elegant, glamorous cinematic wedding invitation video for a traditional Indian wedding Reception. The scene shows a luxurious evening banquet venue with elegant floral centerpieces, warm string and chandelier lighting, and a beautifully dressed bride and groom sharing an elegant first-look or entrance moment on a decorated stage, with stylized guests applauding warmly. Use a refined palette of gold, black, ivory, and deep jewel accents. Elegant gold or white-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Reception", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is refined, romantic, luxurious, and cinematic, like a high-end wedding film's closing scene. Smooth elegant camera movement, warm cinematic lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`,
  },
};

export const EVENT_LIST: EventConfig[] = [
  EVENTS.haldi,
  EVENTS.sangeet,
  EVENTS.mehandi,
  EVENTS.baraat,
  EVENTS.reception,
];
