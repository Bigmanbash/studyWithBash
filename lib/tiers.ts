// ── lib/tiers.ts ─────────────────────────────────────────────────────────────
// Single source of truth for course tier definitions, pricing logic, and access rules.

export const TIER_ORDER = { basic: 0, standard: 1, premium: 2 } as const;
export type TierKey = keyof typeof TIER_ORDER;

export interface TierConfig {
  key: TierKey;
  label: string;
  description: string;
  features: string[];
  badge?: string;
  badgeBg: string;
  badgeText: string;
  accentColor: string;
  priceField: "price" | "standardPrice" | "premiumPrice";
  videoAccess: boolean;
}

export const TIERS: Record<TierKey, TierConfig> = {
  basic: {
    key: "basic",
    label: "Basic",
    description: "Essential study materials & comprehensive text notes",
    features: [
      "Full comprehensive topic notes",
      "Printable high-quality PDF format",
      "Lifetime access to course materials",
      "Standard student community access",
    ],
    badgeBg: "bg-neutral-100",
    badgeText: "text-neutral-600",
    accentColor: "#676E85",
    priceField: "price",
    videoAccess: false,
  },
  standard: {
    key: "standard",
    label: "Standard",
    description: "Notes plus introduction video lectures per topic",
    features: [
      "Everything included in Basic",
      "Topic introduction video lectures",
      "Visual & auditory learning breakdown",
      "Downloadable summary sheets",
    ],
    badge: "Popular",
    badgeBg: "bg-blue-50 border border-blue-200",
    badgeText: "text-blue-600",
    accentColor: "#3B82F6",
    priceField: "standardPrice",
    videoAccess: true,
  },
  premium: {
    key: "premium",
    label: "Premium",
    description: "Complete learning suite with maximum features & priority support",
    features: [
      "Everything included in Standard",
      "All video introduction lectures",
      "Priority tutor support & Q&A",
      "Free access to future course updates",
    ],
    badge: "Best Value",
    badgeBg: "bg-[#17A546]/10 border border-[#17A546]/20",
    badgeText: "text-[#17A546]",
    accentColor: "#17A546",
    priceField: "premiumPrice",
    videoAccess: true,
  },
};

/**
 * Returns available tiers for a course based on configured prices.
 * Basic is always available. Standard and Premium appear if their price is set (>0).
 */
export function getAvailableTiers(course: {
  price: number;
  standardPrice?: number | null;
  premiumPrice?: number | null;
}): TierKey[] {
  const tiers: TierKey[] = ["basic"];
  if (course.standardPrice && course.standardPrice > 0) tiers.push("standard");
  if (course.premiumPrice && course.premiumPrice > 0) tiers.push("premium");
  return tiers;
}

/**
 * Resolves price (in kobo) for a given tier.
 */
export function getTierPrice(
  course: {
    price: number;
    standardPrice?: number | null;
    premiumPrice?: number | null;
  },
  tier: TierKey
): number {
  if (tier === "standard" && course.standardPrice && course.standardPrice > 0) {
    return course.standardPrice;
  }
  if (tier === "premium" && course.premiumPrice && course.premiumPrice > 0) {
    return course.premiumPrice;
  }
  return course.price;
}

/**
 * Checks if a tier grants access to topic video lectures.
 */
export function hasVideoAccess(tier: TierKey | null | undefined): boolean {
  if (!tier) return false;
  return tier === "standard" || tier === "premium";
}

/**
 * Compares two tiers to determine if tierA is higher than tierB.
 */
export function isHigherTier(a: TierKey, b: TierKey): boolean {
  return TIER_ORDER[a] > TIER_ORDER[b];
}

/**
 * Calculates effective highest tier from a list of approved payment tier strings.
 */
export function getEffectiveTier(tiers: string[]): TierKey | null {
  if (!tiers || tiers.length === 0) return null;
  
  let highest: TierKey | null = null;
  for (const t of tiers) {
    const key = t as TierKey;
    if (key in TIER_ORDER) {
      if (!highest || TIER_ORDER[key] > TIER_ORDER[highest]) {
        highest = key;
      }
    }
  }
  return highest;
}
