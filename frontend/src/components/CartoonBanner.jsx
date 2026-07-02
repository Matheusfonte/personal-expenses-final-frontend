export default function CartoonBanner() {
  return (
    <div className="cartoon-banner">
      <div className="cartoon-copy"></div>
      <div className="cartoon-art" aria-hidden="true">
        <svg viewBox="0 0 240 180" role="img">
          <rect x="24" y="28" width="192" height="128" rx="24" fill="#fff7d6" />
          <circle cx="92" cy="90" r="34" fill="#ff7a1a" />
          <circle cx="153" cy="90" r="34" fill="#3b82f6" />
          <rect x="58" y="22" width="124" height="28" rx="14" fill="#111111" />
          <rect x="70" y="120" width="74" height="14" rx="7" fill="#111111" />
          <rect x="152" y="120" width="34" height="14" rx="7" fill="#111111" />
          <circle cx="82" cy="90" r="8" fill="#111111" />
          <circle cx="143" cy="90" r="8" fill="#111111" />
          <path d="M96 112c12 12 35 12 48 0" stroke="#111111" strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M44 68l30-22" stroke="#ff3b30" strokeWidth="10" strokeLinecap="round" />
          <path d="M196 68l-30-22" stroke="#ffcd3c" strokeWidth="10" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
