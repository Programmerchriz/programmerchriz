const skillGroups = [
  {
    title: "Interfaces",
    description:
      "Responsive interfaces, reusable components and accessible interaction patterns.",
    skills: [
      "TypeScript & JavaScript",
      "React & Next.js",
      "Tailwind CSS",
      "HTML & CSS",
      "React Router",
    ],
  },
  {
    title: "APIs & application logic",
    description:
      "Clear service boundaries, validated requests and authentication workflows.",
    skills: [
      "Node.js & Express",
      "Python & FastAPI",
      "REST API design",
      "Authentication & roles",
      "Provider integrations",
    ],
  },
  {
    title: "Data & background work",
    description:
      "Relational models, server-state caching and recoverable asynchronous work.",
    skills: [
      "PostgreSQL & SQL",
      "Prisma & SQLAlchemy",
      "Redis Streams",
      "TanStack Query",
      "Durable jobs & outboxes",
    ],
  },
  {
    title: "AI integration & vision",
    description:
      "Recognition pipelines and model-assisted features with application-owned validation.",
    skills: [
      "YOLO & OpenCV",
      "EasyOCR",
      "Image preprocessing",
      "LLM API integration",
      "Structured intent handling",
    ],
  },
  {
    title: "Delivery & tooling",
    description:
      "Versioned changes, repeatable builds and the services that support shipped features.",
    skills: [
      "Git & GitHub",
      "Docker",
      "CI & CD workflows",
      "Cloudflare R2",
      "Oracle Cloud Infrastructure",
      "Resend",
    ],
  },
  {
    title: "Engineering practice",
    description:
      "Debugging real problems, reviewing changes and helping other developers progress.",
    skills: [
      "Performance optimization",
      "Code reviews",
      "Testing & debugging",
      "Team collaboration",
      "Developer mentoring",
    ],
  },
];

export default function Skills() {
  return (
    <section
      id="skills"
      className="site-container py-16 md:py-24"
      aria-labelledby="skills-heading"
    >
      <div className="section-intro">
        <div>
          <p className="eyebrow text-accent">04 / Tools & practice</p>
          <h2 id="skills-heading" className="section-title">
            The tools behind the work.
          </h2>
        </div>
        <p>
          Grouped by what I use them to build. These disciplines connect the
          interface, the underlying system and its delivery.
        </p>
      </div>

      <div className="grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-12">
        {skillGroups.map((group, index) => (
          <article
            key={group.title}
            className="border-t border-line py-7 md:py-8"
            aria-labelledby={`skill-group-${index}`}
          >
            <p
              className="font-mono text-[10px] text-accent"
              aria-hidden="true"
            >
              {String(index + 1).padStart(2, "0")}
            </p>
            <h3
              id={`skill-group-${index}`}
              className="mt-3 text-xl font-semibold leading-[1.4] tracking-[-0.035em] text-ink"
            >
              {group.title}
            </h3>
            <p className="mt-3 max-w-[360px] text-[13px] leading-[1.85] text-muted">
              {group.description}
            </p>
            <ul className="mt-5 space-y-2 text-[13px] leading-[1.7] text-ink">
              {group.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
