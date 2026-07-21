import { corsPreflight, jsonResponse, buildPrompt, generateVeoVideo } from './_veo.js';

/**
 * POST /api/generate-baraat
 * Body: { brideName, groomName, venue, address, eventDateTime }
 *
 * Generates a cinematic Baraat procession invitation film via Google Vertex AI Veo.
 * Credentials are read from server-side env vars only — never exposed to the client.
 */

const PROMPT_TEMPLATE = (d) =>
  `Create a grand, celebratory cinematic wedding invitation video for a traditional Indian Baraat procession. The scene shows a festive daytime or golden-hour street or venue entrance procession, with a decorated horse or vintage car, a stylized groom in traditional sherwani attire with a safa turban, surrounded by joyful stylized dancing family and friends, dhol drummers, and flower petals or confetti being thrown in celebration. Use a rich, vibrant palette of red, maroon, and gold. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Baraat", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is grand, triumphant, joyful, and cinematic, like an epic wedding film opening sequence. Dynamic but smooth camera movement, rich warm lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`;

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
