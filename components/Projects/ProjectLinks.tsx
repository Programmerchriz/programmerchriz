import { FiExternalLink, FiGithub, FiLock } from "react-icons/fi";
import type { Project } from "@/lib/data/projects";

export default function ProjectLinks({ project }: { project: Pick<Project, "liveLink" | "repositories"> }) {
  if (!project.liveLink && !project.repositories?.length) return null;
  return <div className="project-destinations">
    {project.liveLink && <a className="button button-primary" href={project.liveLink.url} target="_blank" rel="noopener noreferrer">{project.liveLink.label}<FiExternalLink aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
    {!!project.repositories?.length && <ul className="repository-list" aria-label="Project source repositories">
      {project.repositories.map((repository) => <li key={repository.label}>
        {repository.visibility === "public" ? <a href={repository.url} target="_blank" rel="noopener noreferrer"><FiGithub aria-hidden="true" />{repository.label}<FiExternalLink aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a> : <span className="private-repository"><FiLock aria-hidden="true" /><span>{repository.label}<small>Private source</small></span></span>}
      </li>)}
    </ul>}
  </div>;
}
