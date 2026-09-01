"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
import { submitEntry } from "@/lib/content";
import { VenueItem } from "@/lib/types";

interface Props {
  item: VenueItem;
  onClose: () => void;
}

export default function EntryModal({ item, onClose }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [step, setStep] = useState<"picks" | "details" | "done">("picks");
  const [details, setDetails] = useState({
    name: "",
    email: "",
    mobile: ""
  });
  const [loading, setLoading] = useState(false);
  const config = item.config as Record<string, any>;

  const requiredPickCount = useMemo(() => {
    if (item.sport === "RACING") return (config.races || []).length;
    return item.sport === "UFC" ? 3 : 3;
  }, [item.sport, config.races]);

  const pickCount = Object.values(answers).filter(Boolean).length;

  async function saveEntry() {
    setLoading(true);
    try {
      await submitEntry({
        venue_slug: item.venue_slug,
        item_id: item.id,
        name: details.name,
        email: details.email,
        mobile: details.mobile,
        answers,
        consent: true
      });
      setStep("done");
    } catch (error) {
      alert("Entry could not be saved. Check the Supabase setup and try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card">
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {step === "picks" && (
          <>
            <div className="eyebrow">{item.sport}</div>
            <h2>{item.title}</h2>
            <p className="muted">{item.subtitle}</p>

            <div className="modal-fields">
              {item.sport === "AFL" && (
                <>
                  <Select
                    label="Match winner"
                    value={answers.winner || ""}
                    onChange={(v) => setAnswers({ ...answers, winner: v })}
                    options={[config.home, config.away, "Draw"]}
                  />
                  <Select
                    label="First goal scorer"
                    value={answers.firstGoal || ""}
                    onChange={(v) => setAnswers({ ...answers, firstGoal: v })}
                    options={config.scorers}
                  />
                  <Select
                    label="Winning margin"
                    value={answers.margin || ""}
                    onChange={(v) => setAnswers({ ...answers, margin: v })}
                    options={["1–12", "13–24", "25–36", "37+"]}
                  />
                </>
              )}

              {item.sport === "NRL" && (
                <>
                  <Select
                    label="Match winner"
                    value={answers.winner || ""}
                    onChange={(v) => setAnswers({ ...answers, winner: v })}
                    options={[config.home, config.away, "Draw"]}
                  />
                  <Select
                    label="First try scorer"
                    value={answers.firstTry || ""}
                    onChange={(v) => setAnswers({ ...answers, firstTry: v })}
                    options={config.scorers}
                  />
                  <Select
                    label="Winning margin"
                    value={answers.margin || ""}
                    onChange={(v) => setAnswers({ ...answers, margin: v })}
                    options={["1–6", "7–12", "13–18", "19+"]}
                  />
                </>
              )}

              {item.sport === "UFC" && (
                <>
                  <Select
                    label="Fight winner"
                    value={answers.winner || ""}
                    onChange={(v) => setAnswers({ ...answers, winner: v })}
                    options={[config.fighterA, config.fighterB]}
                  />
                  <Select
                    label="Method"
                    value={answers.method || ""}
                    onChange={(v) => setAnswers({ ...answers, method: v })}
                    options={config.methods}
                  />
                  <Select
                    label="Round"
                    value={answers.round || ""}
                    onChange={(v) => setAnswers({ ...answers, round: v })}
                    options={(config.rounds || []).map(String)}
                  />
                </>
              )}

              {item.sport === "RACING" &&
                (config.races || []).map((race: any, index: number) => (
                  <Select
                    key={race.label}
                    label={race.label}
                    value={answers[`race-${index}`] || ""}
                    onChange={(v) =>
                      setAnswers({ ...answers, [`race-${index}`]: v })
                    }
                    options={race.runners}
                  />
                ))}
            </div>

            <div className="modal-footer">
              <div className="muted small">
                {pickCount}/{requiredPickCount} picks complete
              </div>
              <button
                className="button button-dark"
                disabled={pickCount < requiredPickCount}
                onClick={() => setStep("details")}
              >
                Continue
              </button>
            </div>
          </>
        )}

        {step === "details" && (
          <>
            <div className="eyebrow">Final step</div>
            <h2>Save your entry</h2>
            <p className="muted">
              Demo data capture for the venue. Free to enter. T&amp;Cs apply.
            </p>

            <div className="modal-fields">
              <TextField
                label="Full name"
                value={details.name}
                onChange={(v) => setDetails({ ...details, name: v })}
              />
              <TextField
                label="Email"
                type="email"
                value={details.email}
                onChange={(v) => setDetails({ ...details, email: v })}
              />
              <TextField
                label="Mobile"
                value={details.mobile}
                onChange={(v) => setDetails({ ...details, mobile: v })}
              />
            </div>

            <label className="consent">
              <input type="checkbox" defaultChecked />
              <span>
                I agree to the competition terms and to receive venue communications.
              </span>
            </label>

            <div className="modal-footer">
              <button className="button button-ghost" onClick={() => setStep("picks")}>
                Back
              </button>
              <button
                className="button button-dark"
                disabled={!details.name || !details.email || loading}
                onClick={saveEntry}
              >
                {loading ? "Saving…" : "Submit entry"}
              </button>
            </div>
          </>
        )}

        {step === "done" && (
          <div className="success-state">
            <div className="success-mark">✓</div>
            <div className="eyebrow">Entry received</div>
            <h2>You’re in.</h2>
            <p className="muted">
              Your picks have been saved. Winners can be displayed in Venue Admin.
            </p>
            <button className="button button-dark" onClick={onClose}>
              Back to Brabham
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Select…</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextField({
  label,
  value,
  onChange,
  type = "text"
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={label}
      />
    </label>
  );
}
