// ── Affiliates API barrel ─────────────────────────────────────────────────────

export type {
  AffiliateProfile,
  CommissionRecord,
  AccessCodeRecord,
  AffiliateStats,
  AffiliateListQuery,
  PaginatedAffiliates,
  PaginatedCommissions,
} from "./interface";

export {
  listAffiliates,
  getAffiliateByUserId,
  getAffiliateByCode,
  getAffiliateStats,
  getAffiliateCommissions,
  getAdminAffiliateStats,
} from "./queries";

export {
  createAffiliateApplication,
  approveAffiliate,
  rejectAffiliate,
  suspendAffiliate,
  reactivateAffiliate,
  setCommissionRate,
  creditCommission,
  markCommissionsPaid,
  linkReferral,
} from "./mutations";
