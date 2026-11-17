import { FiArrowDownRight } from "react-icons/fi";

// CV-reported outcomes. The detailed engineering-impact section belongs to Step 2.
const highlights = [
  { value: "~20%", label: "Faster OCR processing", detail: "16 seconds to under 13", href: "/projects/vehicle-license-app" },
  { value: "~35%", label: "Product-page improvement", detail: "Through image lazy loading", href: "/#experience" },
  { value: "100+", label: "Developers mentored", detail: "Web development fundamentals", href: "/#experience" },
];

export default function CredibilityStrip() {
  return (
    <section className="credibility-strip" aria-labelledby="credibility-title">
      <div className="site-container credibility-inner">
        <div className="credibility-heading">
          <p className="eyebrow" id="credibility-title">A few things{" "}<br />I&apos;ve worked on</p>
          <FiArrowDownRight aria-hidden="true" />
        </div>
        <ul className="credibility-list">
          {highlights.map((highlight) => (
            <li key={highlight.label}>
              <a href={highlight.href} className="credibility-item">
                <span className="credibility-value">{highlight.value}</span>
                <span className="credibility-copy"><strong>{highlight.label}</strong><span>{highlight.detail}</span></span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
