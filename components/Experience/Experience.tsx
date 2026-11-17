const workExperience = [
  {
    id: "apexbyte",
    company: "Apexbyte",
    title: "Front End Developer",
    start: "2024-09",
    startLabel: "September 2024",
    end: "2025-01",
    endLabel: "January 2025",
    description:
      "Built and maintained React and TypeScript applications, working with designers and backend engineers to deliver responsive product features.",
    contributions: [
      "Improved product-page load performance by approximately 35% through lazy loading: visible product images loaded first, with the rest loading as users scrolled.",
      "Contributed to debugging, code reviews and frontend performance improvements to keep shipped features reliable.",
    ],
    tools: "React · TypeScript · API integration · Performance",
  },
  {
    id: "flip-to-tech-frontend",
    company: "Flip To Tech",
    title: "Front End Developer",
    start: "2023-08",
    startLabel: "August 2023",
    end: "2023-09",
    endLabel: "September 2023",
    description:
      "Built responsive web interfaces with React, TypeScript and Tailwind CSS, integrating frontend features with backend APIs.",
    contributions: [
      "Organized shared interface patterns into reusable components to improve maintainability across features.",
      "Worked closely with the engineering team to connect user-facing workflows to application data.",
    ],
    tools: "React · TypeScript · Tailwind CSS · Reusable components",
  },
  {
    id: "flip-to-tech-junior",
    company: "Flip To Tech",
    title: "Junior Developer",
    start: "2023-03",
    startLabel: "March 2023",
    end: "2023-08",
    endLabel: "August 2023",
    description:
      "Helped senior engineers build and maintain web applications, implement features, debug production issues and review code.",
    contributions: [
      "Mentored over 100 aspiring developers in HTML, CSS, JavaScript and modern frontend development practices.",
      "Supported newcomers as they worked through web development fundamentals and practical projects.",
    ],
    tools: "HTML · CSS · JavaScript · Debugging · Mentoring",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="site-container py-16 md:py-24"
      aria-labelledby="experience-heading"
    >
      <div className="section-intro">
        <div>
          <p className="eyebrow text-accent">03 / Experience</p>
          <h2 id="experience-heading" className="section-title">
            Shipping with a team.
          </h2>
        </div>
        <p>
          Frontend delivery, performance work and mentoring. The roles that
          shaped how I collaborate and build.
        </p>
      </div>

      <ol className="border-t border-line">
        {workExperience.map((job) => (
          <li key={job.id} className="border-b border-line py-8 md:py-10">
            <article
              className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12"
              aria-labelledby={`${job.id}-heading`}
            >
              <div>
                <p className="text-[15px] font-semibold text-ink">
                  {job.company}
                </p>
                <p className="mt-2 text-xs leading-6 text-subtle">
                  <time dateTime={job.start}>{job.startLabel}</time>
                  {" – "}
                  <time dateTime={job.end}>{job.endLabel}</time>
                </p>
              </div>
              <div className="min-w-0">
                <h3
                  id={`${job.id}-heading`}
                  className="text-[23px] font-semibold leading-tight tracking-[-0.035em] text-ink md:text-[27px]"
                >
                  {job.title}
                </h3>
                <p className="mt-4 max-w-[720px] text-sm leading-[1.9] text-muted">
                  {job.description}
                </p>
                <ul className="mt-5 space-y-3">
                  {job.contributions.map((contribution) => (
                    <li
                      key={contribution}
                      className="flex gap-3 text-sm leading-[1.9] text-muted"
                    >
                      <span
                        className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-accent"
                        aria-hidden="true"
                      />
                      <span>{contribution}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 font-mono text-[10px] leading-[1.9] text-subtle">
                  {job.tools}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}
