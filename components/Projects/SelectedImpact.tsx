import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const impact = [
  { value: "86.8%", title: "Lower command-based Redis cost", project: "SwiftTopUp", description: "212.9 → 28 commands/minute in the recorded comparison. On Upstash pay-as-you-go, that means proportionally lower command charges at the same unit rate.", note: "Historical comparison · 10-minute lower-rate observation", href: "/projects/swifttopup#outcomes" },
  { value: "~20%", title: "Faster plate recognition processing", project: "Vehicle Recognition", description: "OCR processing fell from roughly 16 seconds to under 13 seconds after image-handling and OCR optimizations. The workflow also supports correction without rerunning recognition.", note: "CV-reported timing · not an independently reproduced benchmark", href: "/projects/vehicle-license-app#outcomes" },
  { value: "Resume", title: "An assessment worth coming back to", project: "Career Compass", description: "Saved responses and progress address an interrupted-assessment problem, so returning users can continue their assessment rather than start again.", note: "CV-reported outcome · implemented persistence", href: "/projects/career-guidance-app#outcomes" },
];

export default function SelectedImpact() {
  return (
    <section id="impact" className="impact-section site-container" aria-labelledby="impact-heading">
      <div className="section-intro">
        <div><p className="eyebrow text-accent">01 / Engineering impact</p><h2 id="impact-heading" className="section-title">Selected impact.</h2></div>
        <p>Selected results with their context, evidence and limits. Each one leads back to the work.</p>
      </div>
      <div className="impact-list">
        {impact.map((item) => <article className="impact-row" key={item.href}>
          <span className="impact-value">{item.value}</span>
          <div className="impact-result"><p className="eyebrow">{item.project}</p><h3><Link href={item.href}>{item.title}<FiArrowUpRight aria-hidden="true" /></Link></h3></div>
          <div className="impact-context"><p>{item.description}</p><span>{item.note}</span></div>
        </article>)}
      </div>
    </section>
  );
}
