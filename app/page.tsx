"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Crown,
  Music2,
  ShieldCheck,
  Sparkles,
  Trophy
} from "lucide-react";
import { loadItems } from "@/lib/content";
import { VenueItem } from "@/lib/types";
import EntryModal from "@/components/EntryModal";
import TriviaGame from "@/components/TriviaGame";

export default function HomePage() {
  const [items, setItems] = useState<VenueItem[]>([]);
  const [selected, setSelected] = useState<VenueItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems()
      .then(setItems)
      .finally(() => setLoading(false));
  }, []);

  const competitions = useMemo(
    () => items.filter((x) => x.kind === "competition"),
    [items]
  );
  const events = useMemo(() => items.filter((x) => x.kind === "event"), [items]);
  const triviaPacks = useMemo(
    () => items.filter((x) => x.kind === "trivia_pack"),
    [items]
  );
  const prizes = useMemo(() => items.filter((x) => x.kind === "prize"), [items]);
  const music = useMemo(() => items.filter((x) => x.kind === "music"), [items]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Brabham Home">
          <span>BRABHAM</span>
          <em>Hotel</em>
        </a>
        <nav className="desktop-nav">
          <a href="#comps">Competitions</a>
          <a href="#trivia">Trivia</a>
          <a href="#events">What&apos;s On</a>
          <a href="#prizes">Prizes</a>
        </nav>
        <a href="#comps" className="button button-dark small-button">
          Play now
        </a>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="demo-chip">
            <span className="live-dot" />
            LIVE DEMO · BRABHAM VENUE MODE
          </div>
          <p className="hero-kicker">Your new local. Your game.</p>
          <h1>Watch it. Pick it. Win it.</h1>
          <p className="hero-copy">
            Free venue sports competitions, trivia, prizes and what&apos;s on —
            built to make game day easier, faster and more engaging.
          </p>
          <div className="hero-actions">
            <a href="#comps" className="button button-gold">
              Enter a competition <ArrowRight size={17} />
            </a>
            <a href="#events" className="button button-light">
              See what&apos;s on
            </a>
          </div>
        </div>
      </section>

      <section className="quick-strip">
        <div>
          <ShieldCheck size={20} />
          <span>Free to enter</span>
        </div>
        <div>
          <CheckCircle2 size={20} />
          <span>Venue-supplied prizes</span>
        </div>
        <div>
          <Sparkles size={20} />
          <span>No wagering required</span>
        </div>
        <div>
          <Trophy size={20} />
          <span>Easy staff admin</span>
        </div>
      </section>

      <section className="section" id="comps">
        <SectionHeading
          eyebrow="Live competitions"
          title="Choose your sport."
          copy="AFL, NRL, UFC and racing templates ready to switch live from Venue Admin."
        />

        {loading ? (
          <div className="loading-card">Loading venue content…</div>
        ) : (
          <div className="card-grid comps-grid">
            {competitions.map((item) => (
              <button
                className="competition-card"
                key={item.id}
                onClick={() => setSelected(item)}
              >
                <div className={`sport-badge sport-${item.sport?.toLowerCase()}`}>
                  {item.sport}
                </div>
                <div className="competition-body">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <div className="competition-meta">
                    <span>Prize</span>
                    <strong>{item.prize}</strong>
                  </div>
                </div>
                <div className="competition-footer">
                  <span>Open demo</span>
                  <ChevronRight size={19} />
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="section section-dark" id="trivia">
        <SectionHeading
          eyebrow="Brabham Trivia"
          title="Pick the content. Start the game."
          copy="Use AFL, racing or mixed-sport packs. Venue Admin can create themed trivia for any night."
          inverse
        />
        <TriviaGame packs={triviaPacks} />
      </section>

      <section className="section" id="events">
        <SectionHeading
          eyebrow="Upcoming at Brabham"
          title="Give people another reason to come back."
          copy="Blend the venue's real weekly events with sports activation and competition prompts."
        />
        <div className="event-grid">
          {events.map((item) => (
            <article className="event-card" key={item.id}>
              <div className="event-icon">
                <CalendarDays size={22} />
              </div>
              <div>
                <span className="eyebrow">{item.sport}</span>
                <h3>{item.title}</h3>
                <p className="event-date">{item.subtitle}</p>
                <p className="muted">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section section-cream" id="music">
        <SectionHeading
          eyebrow="Music & atmosphere"
          title="Sport when it’s on. Music when it’s not."
          copy="Keep the venue feed useful between matches with live music and weekly entertainment."
        />
        <div className="music-grid">
          {music.map((item) => {
            const schedule = (item.config?.schedule || []) as Array<{
              day: string;
              time: string;
              artist: string;
            }>;
            return (
              <article className="music-card" key={item.id}>
                <div className="music-header">
                  <Music2 size={26} />
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
                <div className="schedule-list">
                  {schedule.map((slot) => (
                    <div key={`${slot.day}-${slot.time}`}>
                      <strong>{slot.day}</strong>
                      <span>{slot.time}</span>
                      <em>{slot.artist}</em>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="section" id="prizes">
        <SectionHeading
          eyebrow="Prize templates"
          title="Keep prizes simple and venue-led."
          copy="Easy-to-fulfil rewards are built into the demo and can be changed from Venue Admin."
        />
        <div className="prize-grid">
          {prizes.map((item, index) => (
            <article className="prize-card" key={item.id}>
              <div className="prize-number">0{index + 1}</div>
              <Crown size={24} />
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>{item.prize}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <div className="eyebrow">Venue mode</div>
          <h2>One screen for sport, trivia, events and repeat visits.</h2>
          <p>
            The demo is designed to be QR-first, mobile-friendly and easy for staff
            to manage without touching code.
          </p>
        </div>
        <a href="#comps" className="button button-gold">
          Try the demo <ArrowRight size={17} />
        </a>
      </section>

      <footer className="site-footer">
        <div>
          <div className="brand footer-brand">
            <span>BRABHAM</span>
            <em>Hotel</em>
          </div>
          <p>45 Palfrey Street, Brabham WA 6055</p>
        </div>

        <div className="footer-links">
          <a href="#comps">Competitions</a>
          <a href="#trivia">Trivia</a>
          <a href="#events">What&apos;s On</a>
          <Link href="/admin" className="admin-link">
            Venue Admin Sign In <ArrowRight size={16} />
          </Link>
        </div>

        <div className="footer-legal">
          Demo concept. Competition participation is free. No wagering is offered
          through this platform. T&amp;Cs and eligibility settings should be
          finalised by the venue before public launch.
        </div>
      </footer>

      {selected && <EntryModal item={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}

function SectionHeading({
  eyebrow,
  title,
  copy,
  inverse = false
}: {
  eyebrow: string;
  title: string;
  copy: string;
  inverse?: boolean;
}) {
  return (
    <div className={`section-heading ${inverse ? "inverse" : ""}`}>
      <div className="eyebrow">{eyebrow}</div>
      <h2>{title}</h2>
      <p>{copy}</p>
    </div>
  );
}
