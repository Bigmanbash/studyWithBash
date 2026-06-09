const BASE_URL = process.env.NEXT_PUBLIC_APP_URL ?? "";

export const apiFetch = async <T>(
  path: string,
  init?: RequestInit
): Promise<T> => {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with status ${res.status}`);
  }
  return res.json() as Promise<T>;
};
