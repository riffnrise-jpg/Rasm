import { corsPreflight, jsonResponse, buildPrompt, generateVeoVideo } from './_veo.js';

/**
 * POST /api/generate-reception
 * Body: { brideName, groomName, venue, address, eventDateTime }
 *
 * Generates a cinematic Reception invitation film via Google Vertex AI Veo.
 * Credentials are read from server-side env vars only — never exposed to the client.
 */

const PROMPT_TEMPLATE = (d) =>
  `Create an elegant, glamorous cinematic wedding invitation video for a traditional Indian wedding Reception. The scene shows a luxurious evening banquet venue with elegant floral centerpieces, warm string and chandelier lighting, and a beautifully dressed bride and groom sharing an elegant first-look or entrance moment on a decorated stage, with stylized guests applauding warmly. Use a refined palette of gold, black, ivory, and deep jewel accents. Elegant gold or white-script text overlays should display, in order: "${d.brideName} & ${d.groomName}", then "Reception", then the venue "${d.venue}", the address "${d.address}", and the date and time "${d.eventDateTime}". Text must be in clean, correctly spelled English only, matching exactly what is provided, with no invented names, no extra text, no foreign scripts, no watermarks, and no random background signage. The mood is refined, romantic, luxurious, and cinematic, like a high-end wedding film's closing scene. Smooth elegant camera movement, warm cinematic lighting, no jarring cuts. Absolutely no spelling errors in any on-screen text.`;

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
