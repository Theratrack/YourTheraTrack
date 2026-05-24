import { useNavigate, useSearchParams } from 'react-router-dom';

const GOOGLE_REVIEW_URL = '#';
const TRIPADVISOR_REVIEW_URL = '#';

export function ThankYou() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const mood = params.get('mood') === 'happy' ? 'happy' : 'sad';
  const name = params.get('name') ?? '';

  if (mood === 'happy') {
    return (
      <div className="mobile-shell happy-bg">
        <div className="mobile-card">
          <div className="thanks-body">
          <div className="emoji-big">🎉</div>
          <h2 className="thanks-title">
            Thank you{name ? `, ${name}` : ''}! We&rsquo;re so glad you enjoyed your stay.
          </h2>
          <p className="thanks-sub">
            Would you share your experience publicly? It helps our team and future guests.
          </p>

          <a className="review-btn google" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
            <span>Review on Google</span> <span>⭐</span>
          </a>
          <a
            className="review-btn tripadvisor"
            href={TRIPADVISOR_REVIEW_URL}
            target="_blank"
            rel="noreferrer"
          >
            <span>Review on TripAdvisor</span> <span>🦉</span>
          </a>

          <button className="link-btn" onClick={() => nav('/')}>
            Back to home
          </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-shell sad-bg">
      <div className="mobile-card">
        <div className="thanks-body">
        <div className="emoji-big soft">💙</div>
        <h2 className="thanks-title">Thank you{name ? `, ${name}` : ''} for your feedback.</h2>
        <p className="thanks-sub">
          We&rsquo;re sorry your experience wasn&rsquo;t perfect. Your feedback has been sent{' '}
          <strong>directly to our management team</strong>. We take every concern seriously and
          will follow up.
        </p>

        <div className="manager-card">
          <div className="manager-avatar">SM</div>
          <div>
            <div className="manager-name">Sophie Martin, GM</div>
            <div className="manager-sub">
              You can expect a personal response within a few hours.
            </div>
          </div>
        </div>

        <div className="secondary-block">
          <div className="secondary-label">You may also share your experience publicly:</div>
          <div className="secondary-row">
            <a className="secondary-link" href={GOOGLE_REVIEW_URL} target="_blank" rel="noreferrer">
              Google ⭐
            </a>
            <a
              className="secondary-link"
              href={TRIPADVISOR_REVIEW_URL}
              target="_blank"
              rel="noreferrer"
            >
              TripAdvisor 🦉
            </a>
          </div>
        </div>

        <button className="link-btn" onClick={() => nav('/')}>
          Back to home
        </button>
        </div>
      </div>
    </div>
  );
}
