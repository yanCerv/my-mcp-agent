import { describe, expect, it, vi } from 'vitest';
import { MyApiRestClient } from '../src/api/my-api-rest.client.js';
import { ApiRequestError } from '../src/errors/api-request.error.js';

describe('MyApiRestClient', () => {
  const baseUrl = new URL('http://localhost:3000');
  const token = 'local-access-token';

  it('sends a bearer token and returns the safe profile', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 'user-id',
      email: 'person@example.com',
      isActive: true,
      createdAt: '2026-09-25T00:00:00.000Z',
      profile: {
        firstName: 'Yan',
        lastName: null,
        avatarUrl: 'https://example.com/avatar.jpg',
        locale: 'es-MX',
      },
    }), { status: 200 })) as typeof fetch;
    const client = new MyApiRestClient(baseUrl, token, fetcher);
    await expect(client.getCurrentUser()).resolves.toMatchObject({
      id: 'user-id',
      email: 'person@example.com',
      profile: { firstName: 'Yan', lastName: null, locale: 'es-MX' },
    });
    expect(fetcher).toHaveBeenCalledWith(new URL('http://localhost:3000/api/v1/users/me'), { headers: { Authorization: 'Bearer local-access-token' } });
  });

  it('supports users without an optional profile', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({
      id: 'user-id',
      email: 'person@example.com',
      isActive: true,
      createdAt: '2026-09-25T00:00:00.000Z',
      profile: null,
    }), { status: 200 })) as typeof fetch;
    const client = new MyApiRestClient(baseUrl, token, fetcher);

    await expect(client.getCurrentUser()).resolves.toMatchObject({ id: 'user-id', profile: null });
  });

  it('preserves the standard API error code', async () => {
    const fetcher = vi.fn().mockResolvedValue(new Response(JSON.stringify({ statusCode: 401, code: 'AUTH_UNAUTHORIZED', message: 'Not authorized.' }), { status: 401 })) as typeof fetch;
    const client = new MyApiRestClient(baseUrl, token, fetcher);
    await expect(client.getCurrentUser()).rejects.toEqual(new ApiRequestError(401, 'AUTH_UNAUTHORIZED', 'Not authorized.'));
  });
});
