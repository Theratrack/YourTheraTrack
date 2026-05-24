import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DEPARTMENTS, HOTEL_NAME } from '../lib/types';
import { useStore } from '../lib/store';

export function GuestFeedback() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { addFeedback } = useStore();

  const presetDept = params.get('dept') ?? '';
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [department, setDepartment] = useState(
    DEPARTMENTS.includes(presetDept as never) ? presetDept : ''
  );
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (rating === 0 || submitting) return;
    setSubmitting(true);
    await addFeedback({ rating, department, comment, name, room });
    const mood = rating >= 4 ? 'happy' : 'sad';
    nav(`/thanks?mood=${mood}&name=${encodeURIComponent(name)}`);
  };

  return (
    <div className="mobile-shell">
      <div className="mobile-card">
        <button className="link-back" onClick={() => nav('/')}>
          ← Back
        </button>
        <div className="hotel-header">
          <div className="hotel-logo">GH</div>
          <div>
            <div className="hotel-name">{HOTEL_NAME}</div>
            <div className="hotel-sub">London · Mayfair</div>
          </div>
        </div>

        <h2 className="feedback-q">How was your stay?</h2>
        <p className="feedback-help">Tap a star — it only takes 20 seconds.</p>

        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => {
            const active = (hover || rating) >= n;
            return (
              <button
                key={n}
                className={`star-btn ${active ? 'active' : ''}`}
                onClick={() => setRating(n)}
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover(0)}
                aria-label={`${n} star${n > 1 ? 's' : ''}`}
              >
                ★
              </button>
            );
          })}
        </div>

        <label className="field-label">What area? (optional)</label>
        <div className="chip-row">
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              className={`chip ${department === d ? 'active' : ''}`}
              onClick={() => setDepartment(department === d ? '' : d)}
            >
              {d}
            </button>
          ))}
        </div>

        <label className="field-label">Tell us more (optional)</label>
        <textarea
          className="input"
          rows={4}
          placeholder="Share any details that would help us improve…"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="two-col">
          <div>
            <label className="field-label">Your name (optional)</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sam"
            />
          </div>
          <div>
            <label className="field-label">Room # (optional)</label>
            <input
              className="input"
              value={room}
              onChange={(e) => setRoom(e.target.value)}
              placeholder="e.g. 214"
            />
          </div>
        </div>

        <button
          className="btn btn-primary btn-block"
          disabled={rating === 0 || submitting}
          onClick={submit}
        >
          {submitting ? 'Sending…' : 'Send Feedback'}
        </button>

        <p className="privacy">🔒 Your feedback goes straight to the management team.</p>
      </div>
    </div>
  );
}
