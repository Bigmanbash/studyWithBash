export function AboutTeam() {
  const team = [
    { name: "Bashir", role: "Founder & CEO", initials: "B" },
    { name: "The Team", role: "Educators & Developers", initials: "T" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-(--card)">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-[#17A546] font-bold tracking-wide uppercase text-sm">Our Team</span>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-(--heading)">
            Built by educators and technologists
          </h2>
          <p className="mt-6 text-base md:text-lg leading-relaxed text-(--muted)">
            A dedicated team passionate about leveraging technology to improve learning outcomes.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {team.map((member) => (
            <div
              key={member.name}
              className="bg-(--card) rounded-2xl p-8 text-center border border-border hover:shadow-lg transition-shadow group"
            >
              <div className="mx-auto h-20 w-20 rounded-2xl bg-[#17A546]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-[#17A546] font-bold text-2xl">{member.initials}</span>
              </div>
              <h3 className="mt-5 text-lg font-bold text-(--heading)">{member.name}</h3>
              <p className="text-sm text-[#17A546] font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
