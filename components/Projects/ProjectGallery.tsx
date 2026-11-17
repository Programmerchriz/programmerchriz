"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiPause, FiPlay } from "react-icons/fi";
import useReducedMotion from "@/components/Helper/useReducedMotion";
import type { ProjectImage } from "@/lib/data/projects";

export default function ProjectGallery({ images = [], title }: { images?: ProjectImage[]; title: string }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(true);
  const [failed, setFailed] = useState<string[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const reducedMotion = useReducedMotion();
  const currentIndex = Math.max(0, Math.min(index, images.length - 1));
  const current = images[currentIndex];
  const autoplay = playing && !reducedMotion && !hovered && visible && images.length > 1 && images.some((item) => !failed.includes(item.src));

  useEffect(() => {
    const onVisibility = () => {
      setVisible(!document.hidden);
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % images.length), 6000);
    return () => window.clearInterval(timer);
  }, [autoplay, images.length]);

  const select = (value: number) => {
    setPlaying(false);
    setIndex((value + images.length) % images.length);
  };

  if (!current) return <div className="gallery-empty"><p className="eyebrow">{title} / Interface</p><p>Screenshots have not been published for this project. The implementation and its scope are described below.</p></div>;

  const imageFailed = failed.includes(current.src);
  return (
    <section className="project-gallery" role="region" aria-roledescription={images.length > 1 ? "carousel" : undefined} aria-label={`${title} screenshots`} tabIndex={0}
      onFocusCapture={() => setPlaying(false)}
      onKeyDown={(event) => {
        if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || images.length < 2) return;
        const destinations: Record<string, number> = { ArrowLeft: currentIndex - 1, ArrowRight: currentIndex + 1, Home: 0, End: images.length - 1 };
        if (event.key in destinations) { event.preventDefault(); select(destinations[event.key]); }
      }}>
      <div className="gallery-media" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onTouchStart={(event) => {
        setPlaying(false);
        const touch = event.touches[0];
        touchStart.current = event.touches.length === 1 ? { x: touch.clientX, y: touch.clientY } : null;
      }} onTouchEnd={(event) => {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || images.length < 2) return;
        const touch = event.changedTouches[0];
        const dx = touch.clientX - start.x;
        const dy = touch.clientY - start.y;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 2) select(currentIndex + (dx < 0 ? 1 : -1));
      }} onTouchCancel={() => { touchStart.current = null; }}>
        {imageFailed ? <p className="gallery-image-error">This screenshot could not be loaded. You can select another image or continue with the case study.</p> : <Image key={current.src} src={current.src} alt={current.alt} fill priority sizes="(max-width: 1250px) 100vw, 1184px" onError={() => setFailed((previous) => [...previous, current.src])} />}
      </div>
      <div className="gallery-toolbar">
        <div className="gallery-caption" aria-live={autoplay ? "off" : "polite"} aria-atomic="true"><p className="eyebrow">Interface / {String(currentIndex + 1).padStart(2, "0")} of {String(images.length).padStart(2, "0")}</p><p>{current.caption}</p></div>
        <div className="gallery-controls">
          {!imageFailed && <a href={current.src} target="_blank" rel="noopener noreferrer" className="gallery-original">Full-size image <FiArrowUpRight aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>}
          {images.length > 1 && <>
            {!reducedMotion && <button className="icon-button" type="button" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause slideshow" : "Play slideshow"}>{playing ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}</button>}
            <button className="icon-button" type="button" onClick={() => select(currentIndex - 1)} aria-label="Previous screenshot"><FiChevronLeft aria-hidden="true" /></button>
            <button className="icon-button" type="button" onClick={() => select(currentIndex + 1)} aria-label="Next screenshot"><FiChevronRight aria-hidden="true" /></button>
          </>}
        </div>
      </div>
      {images.length > 1 && <div className="gallery-thumbnails" aria-label="Choose a screenshot">{images.map((item, itemIndex) => <button type="button" key={item.src} onClick={() => select(itemIndex)} aria-label={`Show screenshot ${itemIndex + 1}: ${item.alt}`} aria-current={currentIndex === itemIndex ? "true" : undefined}><span className="gallery-thumb-image">{failed.includes(item.src) ? <span className="gallery-thumb-error">Unavailable</span> : <Image src={item.src} alt="" fill sizes="120px" onError={() => setFailed((previous) => previous.includes(item.src) ? previous : [...previous, item.src])} />}</span><span>{String(itemIndex + 1).padStart(2, "0")}</span></button>)}</div>}
      {images.length > 1 && <p className="gallery-help">Use the arrows, select a preview or swipe. When focused, use ← →, Home or End. {reducedMotion ? "Slideshow is disabled for reduced motion." : "Slideshow is off by default and pauses over the image or on interaction."}</p>}
    </section>
  );
}
