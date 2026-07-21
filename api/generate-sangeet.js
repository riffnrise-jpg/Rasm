import { corsPreflight, jsonResponse, buildPrompt, generateVeoVideo } from './_veo.js';

/**
 * POST /api/generate-sangeet
 * Body: { brideName, groomName, venue, address, eventDateTime }
 *
 * Generates a cinematic Sangeet night invitation film via Google Vertex AI Veo.
 * Credentials are read from server-side env vars only — never exposed to the client.
 */

const PROMPT_TEMPLATE = (d) =>
  `Create a vibrant, high-energy cinematic wedding invitation video for a traditional Indian Sangeet night. The scene is an elegantly lit evening venue with string lights, a dance floor, colorful uplighting in jewel tones (purple, pink, teal), and a joyful stylized crowd dancing to festive music. Show tasteful, non-specific stylized dancers and a dressed-up bride and groom sharing a joyful dance moment. Include swirling stage lights, confetti or light particle effects, and a celebratory, glamorous atmosphere. Elegant gold or white-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Sangeet Night", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is glamorous, festive, high-energy, cinematic, like a premium wedding film trailer. Smooth dynamic camera movement, rich saturated lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`;

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
