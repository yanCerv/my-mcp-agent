import { ApiRequestError } from '../errors/api-request.error.js';

export interface CurrentUser { id: string; email: string; isActive: boolean; createdAt: string; }
interface ApiError { statusCode: number; code: string; message: string; }

export class MyApiRestClient {
  constructor(private readonly baseUrl: URL, private readonly accessToken: string, private readonly fetcher: typeof fetch = fetch) {}

  async getCurrentUser(): Promise<CurrentUser> {
    const response = await this.fetcher(new URL('/api/v1/users/me', this.baseUrl), {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    });
    if (!response.ok) {
      const error = await this.readError(response);
      throw new ApiRequestError(error.statusCode, error.code, error.message);
    }
    return (await response.json()) as CurrentUser;
  }

  private async readError(response: Response): Promise<ApiError> {
    try {
      const data = (await response.json()) as Partial<ApiError>;
      if (typeof data.code === 'string' && typeof data.message === 'string') {
        return { statusCode: typeof data.statusCode === 'number' ? data.statusCode : response.status, code: data.code, message: data.message };
      }
    } catch { /* myAPIRest did not return its standard error contract. */ }
    return { statusCode: response.status, code: 'API_REQUEST_FAILED', message: 'myAPIRest rejected the request.' };
  }
}
