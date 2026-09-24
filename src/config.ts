export interface AppConfig { apiBaseUrl: URL; accessToken: string; }

export function loadConfig(environment: NodeJS.ProcessEnv = process.env): AppConfig {
  const baseUrl = environment.MY_API_REST_BASE_URL?.trim();
  const accessToken = environment.MY_API_REST_ACCESS_TOKEN?.trim();
  if (!baseUrl) throw new Error('MY_API_REST_BASE_URL must be configured.');
  if (!accessToken || accessToken === 'replace-with-a-local-access-token') {
    throw new Error('MY_API_REST_ACCESS_TOKEN must be configured with a local access token.');
  }
  const apiBaseUrl = new URL(baseUrl);
  if (!['http:', 'https:'].includes(apiBaseUrl.protocol)) {
    throw new Error('MY_API_REST_BASE_URL must use http or https.');
  }
  return { apiBaseUrl, accessToken };
}
