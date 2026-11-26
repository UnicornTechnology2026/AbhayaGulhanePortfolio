import { useEffect, useRef, useState } from "react";
import { profile, works, categories, hero, tools } from "./data.js";

const clients = [...new Set(works.map((w) => w.client))];

function Headline({ text, delay = 0 }) {
  return (
    <span className="block">
      {text.split(" ").map((word, wi, arr) => (
        <span key={wi} className="mask">
          {[...word].map((ch, i) => (
            <span
              key={i}
              className="letter"
              style={{ animationDelay: `${delay + (wi * 5 + i) * 45}ms` }}
            >
              {ch}
            </span>
          ))}
          {wi < arr.length - 1 && "\u00A0"}
        </span>
      ))}
    </span>
  );
}

function Nav() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const f = () =>
      setP(window.scrollY / (document.body.scrollHeight - innerHeight));
    addEventListener("scroll", f, { passive: true });
    return () => removeEventListener("scroll", f);
  }, []);
  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-ink/60">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-10">
        <a
          href="#top"
          className="font-display text-lg font-extrabold tracking-tight"
        >
          Abhaya Gulhane
        </a>
        <div className="flex gap-6 text-sm">
          <a className="hover:text-marigold transition-colors" href="#work">
            Work
          </a>
          <a className="hover:text-marigold transition-colors" href="#about">
            About
          </a>
          <a className="hover:text-marigold transition-colors" href="#contact">
            Contact
          </a>
        </div>
      </nav>
      <div
        className="h-[2px] origin-left bg-marigold"
        style={{ transform: `scaleX(${p})` }}
      />
    </header>
  );
}

function Hero() {
  const ref = useRef(null);
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty(
      "--mx",
      ((e.clientX - r.left) / r.width - 0.5).toFixed(3),
    );
    ref.current.style.setProperty(
      "--my",
      ((e.clientY - r.top) / r.height - 0.5).toFixed(3),
    );
  };
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 md:pt-32"
      onMouseMove={move}
    >
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 md:grid-cols-[1.05fr_1fr] md:px-10 md:pb-24">
        <div>
          <p className="mb-5 text-paper/60">
            Graphic designer in {profile.city}
          </p>
          <h1 className="font-display text-[clamp(3.2rem,9vw,7.5rem)] font-extrabold leading-[0.92] tracking-tight">
            <Headline text="Abhaya" delay={200} />
            <span className="text-marigold">
              <Headline text="Gulhane" delay={500} />
            </span>
          </h1>
          <p className="mt-7 max-w-md text-lg leading-relaxed text-paper/75">
            I design posters, brand identities and print for restaurants,
            interior studios, salons and classes, so local businesses look as
            good as they work.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#work"
              className="rounded-full bg-marigold px-6 py-3 font-medium text-ink transition hover:-translate-y-0.5 hover:bg-paper"
            >
              See my work
            </a>
            <a
              href="#contact"
              className="rounded-full border border-paper/30 px-6 py-3 transition hover:border-marigold hover:text-marigold"
            >
              Start a project
            </a>
          </div>
        </div>
        <div
          ref={ref}
          className="relative mx-auto aspect-[4/5] w-full max-w-xl"
          style={{ "--mx": 0, "--my": 0 }}
        >
          {hero.map((h, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                width: `${h.w}%`,
                transform: `translate3d(calc(var(--mx) * ${h.d}px), calc(var(--my) * ${h.d}px), 0)`,
                transition: "transform .25s ease-out",
              }}
            >
              <img
                src={h.src}
                alt=""
                className="float-card w-full rounded-xl shadow-2xl shadow-black/60 ring-1 ring-paper/10"
                style={{
                  "--r0": `${h.r}deg`,
                  rotate: `${h.r}deg`,
                  animationDelay: `${700 + i * 140}ms`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="overflow-hidden border-y border-paper/10 py-4">
        <div className="marquee flex w-max gap-12 font-display text-xl text-paper/60">
          {[...clients, ...clients, ...clients, ...clients].map((c, i) => (
            <span key={i} className="whitespace-nowrap">
              {c}
              <span className="ml-12 text-marigold">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ w, onOpen, i }) {
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          ref.current.classList.add("in");
          io.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const tilt = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5,
      y = (e.clientY - b.top) / b.height - 0.5;
    e.currentTarget.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.02)`;
  };
  return (
    <button
      ref={ref}
      onClick={() => onOpen(w)}
      style={{ transitionDelay: `${(i % 3) * 80}ms` }}
      className="reveal group relative mb-5 block w-full break-inside-avoid overflow-hidden rounded-2xl text-left"
    >
      <div
        onMouseMove={tilt}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
        className="transition-transform duration-200"
      >
        <img
          src={w.src}
          alt={`${w.title}, ${w.client}`}
          loading="lazy"
          className="w-full"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/90 via-ink/10 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="font-display text-lg font-extrabold leading-tight">
            {w.client}
          </span>
          <span className="text-sm text-paper/70">{w.note}</span>
        </div>
      </div>
    </button>
  );
}

function Lightbox({ item, list, setItem }) {
  const idx = list.findIndex((x) => x.id === item.id);
  const go = (d) => setItem(list[(idx + d + list.length) % list.length]);
  useEffect(() => {
    const k = (e) => {
      if (e.key === "Escape") setItem(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => {
      removeEventListener("keydown", k);
      document.body.style.overflow = "";
    };
  });
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
      style={{ animation: "pop .3s both" }}
      onClick={() => setItem(null)}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(-1);
        }}
        aria-label="Previous"
        className="absolute left-3 rounded-full bg-paper/10 px-4 py-3 text-2xl hover:bg-marigold hover:text-ink md:left-8"
      >
        ‹
      </button>
      <figure
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-full flex-col items-center gap-4"
      >
        <img
          key={item.id}
          src={item.src}
          alt={item.title}
          className="max-h-[78vh] max-w-full rounded-xl"
          style={{ animation: "pop .35s both" }}
        />
        <figcaption className="text-center">
          <p className="font-display text-xl font-extrabold">{item.client}</p>
          <p className="text-paper/60">
            {item.title} · {item.note}
          </p>
        </figcaption>
      </figure>
      <button
        onClick={(e) => {
          e.stopPropagation();
          go(1);
        }}
        aria-label="Next"
        className="absolute right-3 rounded-full bg-paper/10 px-4 py-3 text-2xl hover:bg-marigold hover:text-ink md:right-8"
      >
        ›
      </button>
      <button
        onClick={() => setItem(null)}
        aria-label="Close"
        className="absolute right-4 top-4 rounded-full bg-paper/10 px-4 py-2 hover:bg-rose"
      >
        Close
      </button>
    </div>
  );
}

function Work() {
  const [cat, setCat] = useState("All");
  const [open, setOpen] = useState(null);
  const list = works.filter((w) => cat === "All" || w.cat === cat);
  return (
    <section id="work" className="mx-auto max-w-7xl px-5 py-24 md:px-10">
      <h2 className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
        Selected work
      </h2>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
            className={`rounded-full px-5 py-2 text-sm transition ${cat === c ? "bg-marigold text-ink" : "border border-paper/25 hover:border-marigold"}`}
          >
            {c}
          </button>
        ))}
      </div>
      <div
        key={cat}
        className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3"
      >
        {list.map((w, i) => (
          <Card key={w.id} w={w} i={i} onOpen={setOpen} />
        ))}
      </div>
      {open && <Lightbox item={open} list={list} setItem={setOpen} />}
    </section>
  );
}

function About() {
  const facts = [
    [works.length, "designs shown"],
    [clients.length, "clients"],
    [categories.length - 1, "industries"],
  ];
  return (
    <section id="about" className="bg-plum">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 md:grid-cols-2 md:px-10">
        <h2 className="font-display text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
          Design that gets a local business noticed in the feed and remembered
          on the street.
        </h2>
        <div>
          <p className="max-w-lg text-lg leading-relaxed text-paper/75">
            I'm Abhaya, a graphic designer based in {profile.city}. I turn a
            brief into clear, eye-catching creatives, from daily Instagram posts
            and offer banners to business cards and digital invitations, with
            contact details and calls to action built in so customers know what
            to do next.
          </p>
          <dl className="mt-10 grid grid-cols-3 gap-4">
            {facts.map(([n, l]) => (
              <div key={l} className="rounded-2xl border border-paper/10 p-4">
                <dt className="font-display text-4xl font-extrabold text-marigold">
                  {n}
                </dt>
                <dd className="text-sm text-paper/60">{l}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10">
            <h3 className="font-display text-xl font-extrabold">
              Tools I design with
            </h3>
            <ul className="mt-4 space-y-3">
              {tools.map((t) => (
                <li
                  key={t.name}
                  className="flex items-center gap-4 rounded-2xl border border-paper/10 p-4 transition hover:border-marigold"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-rose to-marigold font-display text-2xl font-extrabold text-ink">
                    {t.name[0]}
                  </span>
                  <div>
                    <p className="font-display text-lg font-extrabold">
                      {t.name}
                    </p>
                    <p className="text-sm text-paper/65">{t.use}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <section
      id="contact"
      className="mx-auto max-w-7xl px-5 py-28 text-center md:px-10"
    >
      <h2 className="font-display text-[clamp(2.6rem,8vw,6.5rem)] font-extrabold leading-none tracking-tight">
        Have a brand to <span className="text-rose">brighten?</span>
      </h2>
      <p className="mx-auto mt-6 max-w-md text-lg text-paper/70">
        Tell me about your business and I'll reply with ideas and a quote.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a
          href={`tel:${profile.phone.replace(/\s/g, "")}`}
          className="rounded-full bg-marigold px-7 py-3 font-medium text-ink transition hover:-translate-y-0.5"
        >
          Call {profile.phone}
        </a>
        <a
          href={`mailto:${profile.email}`}
          className="rounded-full border border-paper/30 px-7 py-3 transition hover:border-marigold hover:text-marigold"
        >
          Email me
        </a>
        <button
          onClick={copy}
          className="rounded-full border border-paper/30 px-7 py-3 transition hover:border-marigold hover:text-marigold"
        >
          {copied ? "Email copied" : "Copy email"}
        </button>
      </div>
      <p className="mt-20 text-sm text-paper/40">
        © {new Date().getFullYear()} {profile.name}
      </p>
    </section>
  );
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Work />
        <About />
        <Contact />
      </main>
    </>
  );
}
