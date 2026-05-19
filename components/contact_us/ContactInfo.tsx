import { Mail, Phone, MapPin, Clock } from "lucide-react";

const contactMethods = [
  {
    title: "Email Us",
    description: "Our team typically responds within 24 hours.",
    value: "support@bashacademy.com",
    href: "mailto:support@bashacademy.com",
    icon: Mail,
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Call Us",
    description: "Mon–Fri from 8am to 5pm WAT.",
    value: "+234 800 000 0000",
    href: "tel:+2348000000000",
    icon: Phone,
    color: "bg-[#17A546]/10 text-[#17A546]",
  },
  {
    title: "Visit Us",
    description: "Come say hello at our office.",
    value: "Lagos, Nigeria",
    href: "#",
    icon: MapPin,
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    title: "Office Hours",
    description: "We're available during these times.",
    value: "Mon – Fri, 8am – 5pm WAT",
    href: "#",
    icon: Clock,
    color: "bg-purple-500/10 text-purple-500",
  },
];

export function ContactInfo() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
      {contactMethods.map((method) => (
        <a
          key={method.title}
          href={method.href}
          className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group block"
        >
          <div className={`h-11 w-11 rounded-xl ${method.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
            <method.icon className="h-5 w-5" />
          </div>
          <h3 className="text-base font-bold text-[#0A1B39]">{method.title}</h3>
          <p className="text-xs text-[#98A2B3] mt-1">{method.description}</p>
          <p className="text-sm font-medium text-[#0A1B39] mt-3">{method.value}</p>
        </a>
      ))}
    </div>
  );
}
