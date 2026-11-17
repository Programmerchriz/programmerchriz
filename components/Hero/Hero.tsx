import Image from "next/image";
import Link from "next/link";
import { FiArrowDown, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import RoleTyping from "./RoleTyping";

export default function Hero() {
  return (
    <section id="hero" className="hero-section" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="site-container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow hero-location"><span className="location-dot" /> Lagos, Nigeria <span className="label-divider">/</span> Building for the web</p>
          <h1 id="hero-title" className="hero-name">Chris{" "}<br /><span>Nwachukwu.</span></h1>
          <p className="hero-role"><RoleTyping /></p>
          <p className="hero-description">I turn ideas into web applications, from the interface to the database. Working with TypeScript and Python, I build thoughtful user experiences and the systems behind them.</p>
          <div className="hero-actions">
            <Link href="/#projects" className="button button-primary">View my work <FiArrowRight aria-hidden="true" /></Link>
            <Link href="/#contact" className="button button-secondary">Get in touch <FiArrowUpRight aria-hidden="true" /></Link>
          </div>
          <p className="hero-stack"><span>Working across</span> React <i>·</i> Next.js <i>·</i> Node.js <i>·</i> FastAPI</p>
        </div>
        <figure className="portrait-card">
          <div className="portrait-heading"><span className="eyebrow">Behind the code</span><span className="portrait-index">01 / CHRIS</span></div>
          <div className="portrait-image">
            <Image src="/images/headline.jpg" alt="Chris Nwachukwu wearing a checked shirt, seated against a light wall"
              fill priority sizes="(min-width: 1280px) 410px, (min-width: 900px) 36vw, (min-width: 600px) 440px, 90vw" />
          </div>
          <figcaption className="portrait-caption">
            <div><strong>From frontend to backend.</strong><span>Curious about how it all fits together.</span></div>
            <span className="portrait-monogram" aria-hidden="true">CN<span>.</span></span>
          </figcaption>
        </figure>
        <Link href="/#projects" className="hero-scroll"><span><FiArrowDown aria-hidden="true" /></span> Explore the work</Link>
      </div>
    </section>
  );
}
