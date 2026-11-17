import Image from "next/image";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";
import { getFeaturedProjects } from "@/lib/data/projects";

export default function Projects() {
  return (
    <section id="projects" className="project-section site-container" aria-labelledby="projects-heading">
      <div className="section-intro">
        <div><p className="eyebrow text-accent">02 / Selected work</p><h2 id="projects-heading" className="section-title">Built around real problems.</h2></div>
        <p>From recoverable payments to computer vision. A closer look at the interfaces, decisions and tradeoffs behind the work.</p>
      </div>
      <div className="project-grid">
        {getFeaturedProjects().map((project, index) => {
          const preview = project.images?.[0];
          return (
            <article key={project.slug} className={`work-project${index === 0 ? " work-project-featured" : ""}`}>
              <div className="work-preview">
                {preview ? <Image src={preview.src} alt={preview.alt} fill sizes={index === 0 ? "(max-width: 800px) 100vw, 720px" : "(max-width: 700px) 100vw, 580px"} /> : <p className="work-no-image">{project.category}<br /><strong>{project.displayName}</strong></p>}
              </div>
              <div className="work-copy">
                <p className="eyebrow text-accent">{project.category}</p>
                <h3><Link href={`/projects/${project.slug}`} className="work-title-link">{project.displayName}<FiArrowUpRight aria-hidden="true" /></Link></h3>
                <p className="work-description">{project.shortDescription}</p>
                {project.slug === "swifttopup" && <p className="work-feature-note">Double-entry accounting. Durable jobs. Recovery after uncertain provider responses.</p>}
                <ul className="technology-list" aria-label={`${project.displayName} selected technologies`}>
                  {project.technologies.slice(0, index === 0 ? 5 : 4).map((tech) => <li key={tech}>{tech}</li>)}
                </ul>
                <span className="work-read" aria-hidden="true">Read the case study <span>↗</span></span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
