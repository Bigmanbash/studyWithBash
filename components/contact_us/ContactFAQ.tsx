export function ContactFAQ() {
  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "Click on 'Forgot password?' on the login page and follow the instructions sent to your email.",
    },
    {
      question: "Can I switch between JAMB and WAEC prep?",
      answer: "Yes! You can update your target exam at any time from your dashboard settings.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major Nigerian bank cards, bank transfers, and USSD payments through Paystack.",
    },
    {
      question: "Is there a refund policy?",
      answer: "Yes, we offer a full refund within 7 days of purchase if you're not satisfied with our platform.",
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-(--card)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-[#17A546] font-bold tracking-wide uppercase text-sm">FAQ</span>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold tracking-tight text-(--heading)">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-base text-(--muted)">
            Can&apos;t find the answer? Reach out through the form above.
          </p>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-4">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-(--card) rounded-2xl p-6 border border-border shadow-sm"
            >
              <h3 className="text-base font-bold text-(--heading)">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--muted)">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
