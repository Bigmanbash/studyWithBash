import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Single course",
    id: "tier-single",
    priceMonthly: "₦2,500",
    description: "Pick exactly what you need. Buy any subject for any term and own it forever.",
    features: [
      "One subject, one term",
      "Full PDF reading material",
      "Lifetime access after purchase",
      "Available for SS1 – SS3",
    ],
    featured: false,
    cta: "Browse courses",
    priceLabel: "/course",
  },
  {
    name: "Full term bundle",
    id: "tier-bundle",
    priceMonthly: "₦9,999",
    description: "Get all subjects for an entire term at a fraction of the individual price.",
    features: [
      "All subjects for one full term",
      "Full PDF reading materials",
      "Lifetime access after purchase",
      "Available for SS1 – SS3",
      "Save over 60% vs buying separately",
    ],
    featured: true,
    cta: "Get the bundle",
    priceLabel: "/term",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function Pricing() {
  return (
    <section className="py-24 bg-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-[#17A546] font-bold tracking-wide uppercase text-sm mb-2">Pricing</h2>
          <p className="text-3xl font-bold tracking-tight text-[#0A1B39] sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </p>
          <p className="mt-6 text-base md:text-lg leading-8 text-[#676E85]">
            Choose the plan that best fits your study needs. No hidden fees, cancel anytime.
          </p>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 sm:mt-20 sm:gap-8 lg:grid-cols-2 lg:max-w-4xl lg:mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={classNames(
                tier.featured
                  ? "relative bg-[#0A1B39] shadow-2xl ring-1 ring-[#17A546]/30"
                  : "bg-white ring-1 ring-neutral-200",
                "rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10"
              )}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#17A546] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-[#17A546]/30">
                    Most Popular
                  </span>
                </div>
              )}
              <h3
                id={tier.id}
                className={classNames(
                  tier.featured ? "text-brand-green" : "text-[#0A1B39]",
                  "text-base font-semibold leading-7"
                )}
              >
                {tier.name}
              </h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span
                  className={classNames(
                    tier.featured ? "text-white" : "text-[#0A1B39]",
                    "text-4xl sm:text-5xl font-bold tracking-tight"
                  )}
                >
                  {tier.priceMonthly}
                </span>
                <span className={classNames(tier.featured ? "text-neutral-400" : "text-neutral-500", "text-sm sm:text-base")}>
                  {tier.priceLabel} 
                </span>
              </p>
              <p className={classNames(tier.featured ? "text-neutral-300" : "text-[#676E85]", "mt-6 text-sm sm:text-base leading-7")}>
                {tier.description}
              </p>
              <ul
                role="list"
                className={classNames(
                  tier.featured ? "text-neutral-300" : "text-[#676E85]",
                  "mt-8 space-y-3 text-sm leading-6"
                )}
              >
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-x-3">
                    <Check
                      className="text-brand-green h-5 w-5 flex-none"
                      aria-hidden="true"
                    />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                variant={tier.featured ? "default" : "outline"}
                className={classNames(
                  "mt-8 w-full",
                  tier.featured
                    ? "bg-brand-green hover:bg-brand-green/90 text-white shadow-lg shadow-[#17A546]/20"
                    : "hover:border-[#17A546] hover:text-[#17A546]"
                )}
              >
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
