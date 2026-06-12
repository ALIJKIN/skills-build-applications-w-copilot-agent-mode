export type ResourceItem = Record<string, unknown>;

const codespaceName = import.meta.env.VITE_CODESPACE_NAME?.trim();
export const VITE_CODESPACE_NAME = codespaceName || null;
export const apiHost = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : "http://localhost:8000";
export const apiBaseUrl = `${apiHost}/api`;

export function normalizeApiResponse(body: unknown): ResourceItem[] {
  if (Array.isArray(body)) {
    return body;
  }

  if (body && typeof body === "object") {
    const typedBody = body as Record<string, unknown>;
    const arrayKeys = ["data", "items", "results"];

    for (const key of arrayKeys) {
      const candidate = typedBody[key];
      if (Array.isArray(candidate)) {
        return candidate as ResourceItem[];
      }
    }

    return [typedBody];
  }

  return [];
}

export async function fetchResource(resource: string): Promise<ResourceItem[]> {
  const url = `${apiBaseUrl}/${resource}`;
  const response = await fetch(url);

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText} ${bodyText}`);
  }

  const payload = await response.json();
  return normalizeApiResponse(payload);
}
