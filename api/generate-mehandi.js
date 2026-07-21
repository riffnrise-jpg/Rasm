import { corsPreflight, jsonResponse, buildPrompt, generateVeoVideo } from './_veo.js';

/**
 * POST /api/generate-mehandi
 * Body: { brideName, groomName, venue, address, eventDateTime }
 *
 * Generates a cinematic Mehandi ceremony invitation film via Google Vertex AI Veo.
 * Credentials are read from server-side env vars only — never exposed to the client.
 */

const PROMPT_TEMPLATE = (d) =>
  `Create a soft, elegant cinematic wedding invitation video for a traditional Indian Mehandi ceremony. The scene shows a beautifully decorated daytime venue with green and white floral decor, hanging marigold strings, and comfortable floor seating with cushions. Show a stylized close-up of intricate henna (mehandi) patterns being applied to a bride's hands, with soft natural light, and a joyful, relaxed atmosphere with stylized family and friends seated around chatting and laughing. Use a calm palette of greens, whites, and soft gold. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Mehandi Ceremony", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is warm, intimate, artistic, and cinematic, like a boutique wedding videographer's short film. Smooth, slow camera pans, soft focus transitions, no abrupt cuts. Absolutely no spelling errors in any on-screen text.`;

export default async function handler(req) {
  if (req.method === 'OPTIONS') return corsPreflight();
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { brideName, groomName, venue, address, eventDateTime } = body;
  if (!brideName || !groomName || !venue || !address || !eventDateTime) {
    return jsonResponse(
      { error: 'Missing required fields: brideName, groomName, venue, address, eventDateTime' },
      400,
    );
  }

  try {
    const prompt = buildPrompt(PROMPT_TEMPLATE, { brideName, groomName, venue, address, eventDateTime });
    // TODO: the actual Vertex AI Veo endpoint call + auth happens inside generateVeoVideo().
    const result = await generateVeoVideo(prompt);
    return jsonResponse(result);
  } catch (err) {
    return jsonResponse({ error: err?.message || 'Video generation failed' }, 500);
  }
}
