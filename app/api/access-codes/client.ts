export async function fetchAccessCodes(params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
  const url = new URL("/api/access-codes", window.location.origin);
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.limit) url.searchParams.set("limit", params.limit.toString());
  if (params.search) url.searchParams.set("search", params.search);
  if (params.status && params.status !== "all") url.searchParams.set("status", params.status);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch access codes");
  }
  return res.json();
}

export async function expireAccessCode(accessCodeId: string) {
  const res = await fetch("/api/access-codes", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "expire", accessCodeId }),
  });
  if (!res.ok) {
    throw new Error("Failed to expire access code");
  }
  return res.json();
}
