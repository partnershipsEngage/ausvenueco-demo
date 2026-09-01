"use client";

import { useMemo, useState } from "react";
import { TriviaQuestion, VenueItem } from "@/lib/types";
import { submitEntry } from "@/lib/content";

export default function TriviaGame({ packs }: { packs: VenueItem[] }) {
  const [packId, setPackId] = useState(packs[0]?.id || "");
  const [started, setStarted] = useState(false);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [finished, setFinished] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const pack = useMemo(
    () => packs.find((x) => x.id === packId) || packs[0],
    [packs, packId]
  );

  const questions = ((pack?.config?.questions || []) as TriviaQuestion[]);
  const score = answers.reduce(
    (sum, answer, i) => sum + (questions[i]?.answer === answer ? 1 : 0),
    0
  );

  function answerQuestion(answer: number) {
    const next = [...answers, answer];
    setAnswers(next);
    if (index >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex(index + 1);
  }

  function reset() {
    setStarted(false);
    setFinished(false);
    setIndex(0);
    setAnswers([]);
    setName("");
    setEmail("");
  }

  async function saveScore() {
    if (!pack || !name || !email) return;
    await submitEntry({
      venue_slug: pack.venue_slug,
      item_id: pack.id,
      name,
      email,
      username: name,
      answers: { answers },
      score,
      consent: true
    });
    alert("Score saved.");
    reset();
  }

  if (!pack) return null;

  return (
    <div className="trivia-shell">
      {!started && (
        <div className="trivia-start">
          <div>
            <div className="eyebrow">Pick your trivia</div>
            <h3>Choose the content before you play.</h3>
            <p className="muted">
              Venue Admin can switch packs on or off for different nights.
            </p>
          </div>

          <div className="trivia-picker">
            {packs.map((item) => (
              <button
                key={item.id}
                className={`trivia-pack ${packId === item.id ? "active" : ""}`}
                onClick={() => setPackId(item.id)}
              >
                <strong>{item.title}</strong>
                <span>{item.subtitle}</span>
              </button>
            ))}
          </div>

          <button className="button button-dark" onClick={() => setStarted(true)}>
            Start 5-question sprint
          </button>
        </div>
      )}

      {started && !finished && questions[index] && (
        <div className="question-card">
          <div className="question-top">
            <span className="eyebrow">{pack.title}</span>
            <span className="question-number">
              {index + 1}/{questions.length}
            </span>
          </div>
          <h3>{questions[index].question}</h3>
          <div className="answer-grid">
            {questions[index].options.map((option, optionIndex) => (
              <button
                key={option}
                className="answer-button"
                onClick={() => answerQuestion(optionIndex)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}

      {started && finished && (
        <div className="trivia-result">
          <div className="score-ring">
            <strong>{score}</strong>
            <span>/ {questions.length}</span>
          </div>
          <div>
            <div className="eyebrow">Trivia complete</div>
            <h3>Save your leaderboard score.</h3>
          </div>
          <div className="inline-fields">
            <input
              placeholder="Name / username"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="button-row">
            <button className="button button-ghost" onClick={reset}>
              Play another pack
            </button>
            <button
              className="button button-dark"
              onClick={saveScore}
              disabled={!name || !email}
            >
              Save score
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
