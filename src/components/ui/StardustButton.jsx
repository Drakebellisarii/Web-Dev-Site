import React from 'react';

const css = `
  .pearl-button {
    -webkit-backdrop-filter: blur(20px) saturate(160%);
    backdrop-filter: blur(20px) saturate(160%);
  }

  .pearl-button .wrap::before,
  .pearl-button .wrap::after {
    content: "";
    position: absolute;
    transition: all 0.35s ease;
  }

  /* Top mirror reflection */
  .pearl-button .wrap::before {
    left: 8%;
    right: 8%;
    top: 0;
    height: 45%;
    border-radius: 100px 100px 60% 60%;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.22) 0%,
      rgba(255, 255, 255, 0.06) 55%,
      transparent 100%
    );
  }

  /* Bottom inner rim */
  .pearl-button .wrap::after {
    left: 12%;
    right: 12%;
    bottom: 0;
    height: 30%;
    border-radius: 0 0 100px 100px;
    background: linear-gradient(
      0deg,
      rgba(255, 255, 255, 0.10) 0%,
      transparent 100%
    );
  }

  .pearl-button .wrap p span:nth-child(2) {
    display: none;
  }

  .pearl-button:hover .wrap p span:nth-child(1) {
    display: none;
  }

  .pearl-button:hover .wrap p span:nth-child(2) {
    display: inline-block;
  }

  .pearl-button:hover {
    background-color: rgba(255, 255, 255, 0.14) !important;
    border-color: rgba(255, 255, 255, 0.30) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 0 rgba(255, 255, 255, 0.10),
      0 0 28px rgba(255, 255, 255, 0.12),
      0 12px 40px rgba(0, 0, 0, 0.28) !important;
  }

  .pearl-button:hover .wrap::before {
    opacity: 0.6;
    transform: translateY(-6%);
  }

  .pearl-button:hover .wrap::after {
    opacity: 1.2;
    transform: translateY(4%);
  }

  .pearl-button:hover .wrap p {
    transform: translateY(-4%);
  }

  .pearl-button:active {
    transform: translateY(3px);
    background-color: rgba(255, 255, 255, 0.10) !important;
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.35),
      0 4px 16px rgba(0, 0, 0, 0.25) !important;
  }
`;

export function StardustButton({ children = 'Launching Soon', onClick, className = '', ...props }) {
  const buttonStyle = {
    '--radius': '100px',
    outline: 'none',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.18)',
    position: 'relative',
    borderRadius: 'var(--radius)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    transition: 'all 0.25s ease',
    boxShadow: `
      inset 0 1px 0 rgba(255, 255, 255, 0.35),
      inset 0 -1px 0 rgba(255, 255, 255, 0.06),
      0 0 18px rgba(255, 255, 255, 0.06),
      0 8px 32px rgba(0, 0, 0, 0.22)
    `,
  };

  const wrapStyle = {
    fontSize: '18px',
    fontWeight: 500,
    color: 'rgba(239, 232, 216, 0.95)',
    padding: '20px 36px',
    borderRadius: 'inherit',
    position: 'relative',
    overflow: 'hidden',
    letterSpacing: '0.01em',
  };

  const pStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    margin: 0,
    transition: 'all 0.25s ease',
    transform: 'translateY(2%)',
    textShadow: '0 1px 8px rgba(0, 0, 0, 0.35)',
  };

  return (
    <>
      <style>{css}</style>
      <button
        className={`pearl-button ${className}`}
        style={buttonStyle}
        onClick={onClick}
        {...props}
      >
        <div className="wrap" style={wrapStyle}>
          <p style={pStyle}>
            <span>✧</span>
            <span>✦</span>
            {children}
          </p>
        </div>
      </button>
    </>
  );
}
