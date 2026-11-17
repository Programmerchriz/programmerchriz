import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import ProjectGallery from "@/components/Projects/ProjectGallery";
import ProjectLinks from "@/components/Projects/ProjectLinks";
import { getProjectBySlug, getFeaturedProjects, projects } from "@/lib/data/projects";
import { projectMetadata } from "@/lib/project-metadata";

interface ProjectDetailPageProps { params: Promise<{ slug: string }> }
// This portfolio publishes only the projects declared in the content model.
export const dynamicParams = false;
export const generateStaticParams = () => projects.map(({ slug }) => ({ slug }));
export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const project = getProjectBySlug((await params).slug);
  return project ? projectMetadata(project) : { title: "Project Not Found | Chris Nwachukwu", robots: { index: false } };
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const project = getProjectBySlug((await params).slug);
  if (!project) notFound();
  const ordered = getFeaturedProjects();
  const nextProject = ordered[(ordered.findIndex(({ slug }) => slug === project.slug) + 1) % ordered.length];
  return <main id="main-content" tabIndex={-1} className="case-page site-container">
    <Link href="/#projects" className="case-back"><FiArrowLeft aria-hidden="true" /> All projects</Link>
    <header className="case-introduction">
      <p className="eyebrow text-accent">Case study / {project.category}</p>
      <h1>{project.title}</h1><p className="case-deck">{project.shortDescription}</p>
      <div className="case-facts"><div><span className="eyebrow">My contribution</span><p>{project.contribution}</p></div><div><span className="eyebrow">Documented status</span><p>{project.status.label}</p></div></div>
      <ProjectLinks project={project} />
    </header>
    <ProjectGallery images={project.images} title={project.displayName} />
    <div className="case-body">
      <aside className="case-index"><nav aria-label="Case study sections"><span className="eyebrow">Inside this project</span><a href="#overview">Overview</a><a href="#functionality">Functionality</a><a href="#architecture">Architecture</a>{!!project.challenges?.length && <a href="#challenges">Challenges</a>}{!!project.outcomes?.length && <a href="#outcomes">Outcomes</a>}<a href="#status">Status & evidence</a><a href="#technology">Technology</a></nav></aside>
      <div className="case-content">
        <section id="overview" className="case-section"><p className="eyebrow text-accent">01 / The product</p><h2>Overview</h2><p className="case-prose">{project.description}</p></section>
        <section id="functionality" className="case-section"><p className="eyebrow text-accent">02 / What it does</p><h2>Functionality</h2><ul className="feature-list">{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></section>
        <section id="architecture" className="case-section"><p className="eyebrow text-accent">03 / Engineering decisions</p><h2>Architecture, with reasons.</h2><ol className="architecture-list">{project.architecturalDecisions.map((decision, index) => <li key={decision.title}><span className="decision-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span><div><h3>{decision.title}</h3><p>{decision.description}</p></div></li>)}</ol></section>
        {!!project.challenges?.length && <section id="challenges" className="case-section"><p className="eyebrow text-accent">04 / The hard parts</p><h2>Challenges & responses</h2><div className="case-notes">{project.challenges.map((note) => <article key={note.title}><h3>{note.title}</h3><p>{note.description}</p></article>)}</div></section>}
        {!!project.outcomes?.length && <section id="outcomes" className="case-section"><p className="eyebrow text-accent">05 / What changed</p><h2>Outcomes</h2><div className="outcome-list">{project.outcomes.map((note) => <article key={note.title}><h3>{note.title}</h3><p>{note.description}</p></article>)}</div></section>}
        <section id="status" className="case-section"><p className="eyebrow text-accent">06 / Scope & evidence</p><h2>Where the project stands</h2><div className="status-note"><h3>{project.status.label}</h3><p>{project.status.detail}</p></div>{!!project.limitations?.length && <><h3 className="case-subheading">Current limitations</h3><ul className="case-bullets">{project.limitations.map((note) => <li key={note}>{note}</li>)}</ul></>}{!!project.evidenceNotes?.length && <details className="evidence-notes"><summary>Sources & measurement notes</summary><ul className="case-bullets">{project.evidenceNotes.map((note) => <li key={note}>{note}</li>)}</ul></details>}</section>
        <section id="technology" className="case-section"><p className="eyebrow text-accent">07 / Tools used</p><h2>Technology</h2><ul className="technology-list case-technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></section>
      </div>
    </div>
    <footer className="case-next"><span className="eyebrow">Next project</span><Link href={`/projects/${nextProject.slug}`}>{nextProject.displayName}<FiArrowUpRight aria-hidden="true" /></Link><Link className="case-back" href="/#contact">Discuss a project <FiArrowUpRight aria-hidden="true" /></Link></footer>
  </main>;
}
