export async function fetchAffiliates(params: { page?: number; limit?: number; search?: string; status?: string } = {}) {
  const url = new URL("/api/affiliates", window.location.origin);
  if (params.page) url.searchParams.set("page", params.page.toString());
  if (params.limit) url.searchParams.set("limit", params.limit.toString());
  if (params.search) url.searchParams.set("search", params.search);
  if (params.status && params.status !== "all") url.searchParams.set("status", params.status);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch affiliates");
  }
  return res.json();
}

export async function fetchAffiliateStats() {
  const url = new URL("/api/affiliates", window.location.origin);
  url.searchParams.set("statsOnly", "true");
  
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error("Failed to fetch affiliate stats");
  }
  return res.json();
}

export async function approveAffiliate(affiliateId: string) {
  return updateAffiliateStatus(affiliateId, "approve");
}

export async function updateAffiliateStatus(affiliateId: string, action: "approve" | "reject" | "suspend" | "reactivate") {
  const res = await fetch("/api/affiliates", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, affiliateId }),
  });
  if (!res.ok) {
    throw new Error(`Failed to ${action} affiliate`);
  }
  return res.json();
}

export async function setCommissionRate(affiliateId: string, commissionRate: number) {
  const res = await fetch("/api/affiliates", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "set_rate", affiliateId, commissionRate }),
  });
  if (!res.ok) {
    throw new Error("Failed to update commission rate");
  }
  return res.json();
}

export async function updateAffiliateDetails(
  affiliateId: string,
  data: { commissionRate?: number; schoolName?: string; estimatedStudents?: number }
) {
  const res = await fetch("/api/affiliates", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "update_details", affiliateId, ...data }),
  });
  if (!res.ok) {
    throw new Error("Failed to update affiliate details");
  }
  return res.json();
}
