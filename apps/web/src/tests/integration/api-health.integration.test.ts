import { describe, expect, it } from 'vitest';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000';

describe('API integration', () => {
  it('health endpoint is reachable', async () => {
    const response = await fetch(`${apiBaseUrl}/health`);
    expect(response.ok).toBe(true);
    const payload = (await response.json()) as { status: string };
    expect(payload.status).toBe('ok');
  });
});
