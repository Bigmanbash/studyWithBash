/**
 * Shared fetch wrapper for client-side API calls.
 * Uses relative URLs on the client for maximum reliability.
 */
export const apiFetch = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(path, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    // Try to extract a useful error message
    const contentType = res.headers.get("content-type") || "";
    let message = `Request failed with status ${res.status}`;

    if (contentType.includes("application/json")) {
      try {
        const json = await res.json();
        message = json.error || json.message || message;
      } catch {
        // ignore parse failure
      }
    } else {
      // Likely HTML 404 page — don't dump the whole HTML into the error
      const text = await res.text();
      if (text.length < 200) {
        message = text || message;
      }
    }

    throw new Error(message);
  }

  // Handle empty responses (e.g. 204 No Content)
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return undefined as unknown as T;
  }

  return res.json() as Promise<T>;
};
