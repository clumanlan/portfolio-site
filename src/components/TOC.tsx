import { useEffect, useState } from 'react';

interface Heading {
  id: string;
  text: string;
  level: number;
}

export default function TOC() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.prose h2, .prose h3'));
    const parsed = els.map((el) => ({
      id: el.id,
      text: el.textContent ?? '',
      level: el.tagName === 'H2' ? 2 : 3,
    }));
    setHeadings(parsed);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: '0px 0px -60% 0px', threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="font-kalam text-sm text-muted mb-3">
        On this page
      </p>
      <ul className="space-y-1.5">
        {headings.map((h) => (
          <li key={h.id} style={{ paddingLeft: h.level === 3 ? '0.75rem' : '0' }}>
            <a
              href={`#${h.id}`}
              className={`text-sm leading-snug no-underline block ${
                activeId === h.id ? 'text-ink font-semibold' : 'text-muted font-normal hover:text-ink'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
