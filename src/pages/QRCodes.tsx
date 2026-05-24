import { useState } from 'react';
import { DashboardNav } from '../components/DashboardNav';
import { DEPARTMENTS } from '../lib/types';

// Generate a QR image via a public renderer. The encoded URL is a real
// deep-link into the guest feedback flow with the department pre-selected.
function qrSrc(data: string, size = 220): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(
    data
  )}`;
}

export function QRCodes() {
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const [copied, setCopied] = useState<string | null>(null);

  const entries = [
    { dept: '', label: 'General (lobby / checkout)' },
    ...DEPARTMENTS.map((d) => ({ dept: d, label: d })),
  ];

  const linkFor = (dept: string) =>
    `${origin}/feedback${dept ? `?dept=${encodeURIComponent(dept)}` : ''}`;

  const copy = async (link: string) => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(link);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      setCopied(null);
    }
  };

  return (
    <div className="dashboard">
      <DashboardNav />
      <div className="dash-body">
        <h1 className="dash-title">QR Codes</h1>
        <p className="qr-intro">
          Print and place these in the matching areas. Scanning opens the guest
          feedback page with the department pre-selected — so feedback is routed
          and labelled automatically.
        </p>

        <div className="qr-grid">
          {entries.map(({ dept, label }) => {
            const link = linkFor(dept);
            return (
              <div className="qr-card" key={label}>
                <div className="qr-dept">{label}</div>
                <div className="qr-frame">
                  <img className="qr-img" src={qrSrc(link)} alt={`QR code for ${label}`} width={156} height={156} />
                </div>
                <div className="qr-link">{link}</div>
                <div className="qr-actions">
                  <button className="btn btn-outline btn-sm" onClick={() => copy(link)}>
                    {copied === link ? 'Copied ✓' : 'Copy link'}
                  </button>
                  <a className="btn btn-primary btn-sm" href={link} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
