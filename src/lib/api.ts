import type { EventKey, InvitationDetails } from '@/data/events';

export interface GenerateResponse {
  videoUrl?: string;
  videoBase64?: string;
  mimeType?: string;
  error?: string;
}

/**
 * Calls the per-event serverless function to generate the invitation film.
 * Credentials stay server-side; the client only sends the wedding details.
 */
export async function generateFilm(
  event: EventKey,
  details: InvitationDetails,
): Promise<{ videoUrl: string } | { videoBase64: string; mimeType: string }> {
  const res = await fetch(`/api/generate-${event}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(details),
  });

  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const body = (await res.json()) as GenerateResponse;
      if (body.error) msg = body.error;
    } catch {
      /* ignore parse error */
    }
    throw new Error(msg);
  }

  const data = (await res.json()) as GenerateResponse;
  if (data.error) throw new Error(data.error);
  if (data.videoUrl) return { videoUrl: data.videoUrl };
  if (data.videoBase64) return { videoBase64: data.videoBase64, mimeType: data.mimeType ?? 'video/mp4' };
  throw new Error('No video returned from the studio.');
}
