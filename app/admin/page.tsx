"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  CopyPlus,
  LogOut,
  Save,
  ShieldCheck,
  Trash2
} from "lucide-react";
import { deleteItem, loadAllItemsForAdmin, saveItem } from "@/lib/content";
import { DEMO_ITEMS, VENUE_SLUG } from "@/lib/demo-data";
import { isSupabaseReady, supabase } from "@/lib/supabase";
import { VenueItem, VenueItemKind } from "@/lib/types";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(!isSupabaseReady);
  const [items, setItems] = useState<VenueItem[]>([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tab, setTab] = useState<VenueItemKind | "all">("all");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!authenticated) return;
    loadAllItemsForAdmin().then(setItems);
  }, [authenticated]);

  const filtered = useMemo(
    () => (tab === "all" ? items : items.filter((x) => x.kind === tab)),
    [items, tab]
  );

  async function login(e: FormEvent) {
    e.preventDefault();
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setNotice(error.message);
      return;
    }
    setAuthenticated(true);
    setNotice("");
  }

  async function logout() {
    if (supabase) await supabase.auth.signOut();
    setAuthenticated(false);
  }

  async function updateItem(next: VenueItem) {
    await saveItem(next);
    setItems((current) =>
      current.some((x) => x.id === next.id)
        ? current.map((x) => (x.id === next.id ? next : x))
        : [...current, next]
    );
    setNotice(`Saved: ${next.title}`);
    setTimeout(() => setNotice(""), 2200);
  }

  async function remove(id: string) {
    if (!confirm("Delete this item?")) return;
    await deleteItem(id);
    setItems((current) => current.filter((x) => x.id !== id));
  }

  async function addTemplate(templateId: string) {
    const template = DEMO_ITEMS.find((x) => x.id === templateId);
    if (!template) return;
    const clone: VenueItem = {
      ...template,
      id: crypto.randomUUID(),
      title: `${template.title} Copy`,
      sort_order: items.length * 10 + 200
    };
    await updateItem(clone);
  }

  if (!authenticated) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-card">
          <div className="brand">
            <span>BRABHAM</span>
            <em>Hotel</em>
          </div>
          <div className="eyebrow">Venue Admin</div>
          <h1>Sign in to control the demo.</h1>
          <p className="muted">
            Supabase Auth is enabled. Use the venue admin account created for this
            deployment.
          </p>
          <form onSubmit={login} className="admin-login-form">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="field">
              <span>Password</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button className="button button-dark" type="submit">
              Sign in
            </button>
          </form>
          {notice && <div className="admin-notice error">{notice}</div>}
          <Link href="/" className="back-link">
            <ArrowLeft size={16} /> Back to public demo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-page">
      <header className="admin-header">
        <div>
          <div className="eyebrow">Venue Admin</div>
          <h1>Brabham Command Centre</h1>
          <p>Manage live content without changing code.</p>
        </div>
        <div className="admin-header-actions">
          <Link className="button button-light" href="/">
            <ArrowLeft size={16} /> Public demo
          </Link>
          {isSupabaseReady && (
            <button className="button button-dark" onClick={logout}>
              <LogOut size={16} /> Sign out
            </button>
          )}
        </div>
      </header>

      <section className="admin-kpis">
        <div>
          <span>Active items</span>
          <strong>{items.filter((x) => x.is_active).length}</strong>
        </div>
        <div>
          <span>Competitions</span>
          <strong>{items.filter((x) => x.kind === "competition").length}</strong>
        </div>
        <div>
          <span>Trivia packs</span>
          <strong>{items.filter((x) => x.kind === "trivia_pack").length}</strong>
        </div>
        <div>
          <span>Database</span>
          <strong>{isSupabaseReady ? "LIVE" : "DEMO"}</strong>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <div className="eyebrow">Quick templates</div>
            <h2>Add ready-made content</h2>
          </div>
          <ShieldCheck size={22} />
        </div>
        <div className="template-buttons">
          <button onClick={() => addTemplate("comp-afl")}>
            <CopyPlus size={17} /> AFL competition
          </button>
          <button onClick={() => addTemplate("comp-nrl")}>
            <CopyPlus size={17} /> NRL competition
          </button>
          <button onClick={() => addTemplate("comp-ufc")}>
            <CopyPlus size={17} /> UFC predictor
          </button>
          <button onClick={() => addTemplate("comp-racing")}>
            <CopyPlus size={17} /> Racing Pick 6
          </button>
          <button onClick={() => addTemplate("trivia-sports-mix")}>
            <CopyPlus size={17} /> Sports trivia
          </button>
          <button onClick={() => addTemplate("music-weekend")}>
            <CopyPlus size={17} /> Music schedule
          </button>
          <button onClick={() => addTemplate("prize-1")}>
            <CopyPlus size={17} /> Prize template
          </button>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel-header">
          <div>
            <div className="eyebrow">Content manager</div>
            <h2>What guests can see</h2>
          </div>
          {notice && (
            <div className="saved-notice">
              <CheckCircle2 size={17} />
              {notice}
            </div>
          )}
        </div>

        <div className="admin-tabs">
          {(["all", "competition", "trivia_pack", "event", "music", "prize"] as const).map(
            (value) => (
              <button
                key={value}
                className={tab === value ? "active" : ""}
                onClick={() => setTab(value)}
              >
                {value.replace("_", " ")}
              </button>
            )
          )}
        </div>

        <div className="admin-list">
          {filtered.map((item) => (
            <EditableItem
              key={item.id}
              item={item}
              onSave={updateItem}
              onDelete={() => remove(item.id)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function EditableItem({
  item,
  onSave,
  onDelete
}: {
  item: VenueItem;
  onSave: (item: VenueItem) => Promise<void>;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(item);

  useEffect(() => setDraft(item), [item]);

  return (
    <article className="admin-item">
      <div className="admin-item-top">
        <div>
          <span className="eyebrow">{draft.kind.replace("_", " ")}</span>
          <strong>{draft.sport || "GENERAL"}</strong>
        </div>
        <label className="toggle-row">
          <input
            type="checkbox"
            checked={draft.is_active}
            onChange={(e) =>
              setDraft({ ...draft, is_active: e.target.checked })
            }
          />
          <span>Live</span>
        </label>
      </div>

      <div className="admin-form-grid">
        <label className="field">
          <span>Title</span>
          <input
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Subtitle</span>
          <input
            value={draft.subtitle || ""}
            onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
          />
        </label>
        <label className="field admin-wide">
          <span>Description</span>
          <textarea
            value={draft.description || ""}
            onChange={(e) =>
              setDraft({ ...draft, description: e.target.value })
            }
          />
        </label>
        <label className="field">
          <span>Prize / reward</span>
          <input
            value={draft.prize || ""}
            onChange={(e) => setDraft({ ...draft, prize: e.target.value })}
          />
        </label>
        <label className="field">
          <span>Sort order</span>
          <input
            type="number"
            value={draft.sort_order}
            onChange={(e) =>
              setDraft({ ...draft, sort_order: Number(e.target.value) })
            }
          />
        </label>
      </div>

      <details className="json-editor">
        <summary>Advanced template settings</summary>
        <textarea
          value={JSON.stringify(draft.config, null, 2)}
          onChange={(e) => {
            try {
              setDraft({ ...draft, config: JSON.parse(e.target.value) });
            } catch {
              // Keep last valid JSON while typing invalid JSON.
            }
          }}
        />
      </details>

      <div className="admin-item-actions">
        <button className="button button-ghost danger" onClick={onDelete}>
          <Trash2 size={16} /> Delete
        </button>
        <button className="button button-dark" onClick={() => onSave(draft)}>
          <Save size={16} /> Save changes
        </button>
      </div>
    </article>
  );
}
