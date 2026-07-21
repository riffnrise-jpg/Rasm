/**
 * Shared Veo (Vertex AI) video-generation helper used by every
 * /api/generate-<event>.js serverless function.
 *
 * Credentials are read ONLY from server-side env vars and never
 * exposed to the client bundle.
 *
 * ─── TODO (fill in once model access is provisioned) ──────────────────
 * 1. Authenticate with the service account (GoogleAuthLibrary / @google-cloud/aiplatform).
 * 2. POST the prompt to the Veo generate endpoint.
 * 3. Long-poll / fetch the operation until the video is ready.
 * 4. Return the video as a URL or base64 (see return shape).
 * ─────────────────────────────────────────────────────────────────────
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

export function corsPreflight() {
  return new Response(null, { status: 200, headers: corsHeaders });
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders },
  });
}

/**
 * Build the Veo prompt by interpolating wedding details into the
 * event-specific template. `template` is a function that returns the
 * fully-assembled prompt string.
 */
export function buildPrompt(template, details) {
  return template(details);
}

/**
 * Call the Veo video-generation model on Vertex AI and return the video.
 *
 * TODO: implement once Vertex AI Veo access is provisioned.
 *
 * Expected return shape (one of):
 *   { videoUrl: "<signed GCS url>" }
 *   { videoBase64: "<base64>", mimeType: "video/mp4" }
 *
 * @param {string} prompt  - fully interpolated Veo prompt
 * @returns {Promise<{ videoUrl?: string, videoBase64?: string, mimeType?: string }>}
 */
export async function generateVeoVideo(prompt) {
  const projectId = process.env.GOOGLE_PROJECT_ID;
  const location = process.env.GOOGLE_LOCATION || 'us-central1';
  const modelId = process.env.VEO_MODEL_ID || 'veo-3.0-generate-preview';
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;

  if (!projectId || !serviceAccountKey) {
    throw new Error('Server is missing Google Vertex AI credentials.');
  }

  // TODO: 1. Parse the service account key and obtain an OAuth2 access token.
  //   const credentials = JSON.parse(serviceAccountKey);
  //   const accessToken = await getGoogleAccessToken(credentials); // @google-cloud/aiplatform or google-auth-library

  // TODO: 2. POST to the Veo generate endpoint, e.g.:
  //   const endpoint = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${modelId}:predictLongRunning`;
  //   const operation = await fetch(endpoint, {
  //     method: 'POST',
  //     headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  //     body: JSON.stringify({ instances: [{ prompt }], parameters: { /* sampleCount, aspectRatio, durationSeconds, ... */ } }),
  //   });

  // TODO: 3. Poll the long-running operation until done.
  //   const result = await pollOperation(operation.name, accessToken);

  // TODO: 4. Extract the generated video and return it.
  //   return { videoUrl: result.generatedSamples[0].video.uri };
  //   — or, if only base64 is available —
  //   return { videoBase64: result.generatedSamples[0].video.base64, mimeType: 'video/mp4' };

  // Placeholder so the app is runnable before Veo access is wired up.
  throw new Error(
    'Veo video generation is not yet configured. ' +
      'Add your Google Vertex AI credentials and complete the TODOs in api/_veo.js.',
  );
}
