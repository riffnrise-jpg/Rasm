import { corsPreflight, jsonResponse, buildPrompt, generateVeoVideo } from './_veo.js';

/**
 * POST /api/generate-haldi
 * Body: { brideName, groomName, venue, address, eventDateTime }
 *
 * Generates a cinematic Haldi ceremony invitation film via Google Vertex AI Veo.
 * Credentials are read from server-side env vars only — never exposed to the client.
 */

const PROMPT_TEMPLATE = (d) =>
  `Create a warm, joyful cinematic wedding invitation video for a traditional Indian Haldi ceremony. The scene shows a beautifully decorated outdoor mandap area with yellow marigold flower garlands, banana leaf decor, and soft golden-hour sunlight. Show stylized, tasteful representations of family members joyfully applying turmeric (haldi) paste to a bride and groom seated separately on decorated wooden stools, surrounded by petals and turmeric powder gently floating in the air. Include festive dhol drum rhythm energy in the visual movement and warm yellow, orange and green color tones throughout. Elegant gold-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Haldi Ceremony", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background text or signage. The overall mood is warm, celebratory, authentic to Indian wedding traditions, cinematic and high-end, like a professional wedding videographer's highlight reel. Smooth camera movements, soft natural lighting, no jump cuts. Absolutely no spelling errors in any on-screen text.`;

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
