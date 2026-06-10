import React from 'react'

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

/* M-Stripe Divider */
function MStripe() {
  return (
    <div className="ats-stripe">
      <div className="ats-stripe__s1" />
      <div className="ats-stripe__s2" />
      <div className="ats-stripe__s3" />
    </div>
  );
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  const getColor = (s: number) => {
    if (s > 69) return '#0fa336';
    if (s > 49) return '#f4b400';
    return '#e22718';
  };

  const getStatus = (s: number) => {
    if (s > 69) return { title: 'EXCELLENT ATS PERFORMANCE', desc: 'Your resume is highly optimized for applicant tracking systems.' };
    if (s > 49) return { title: 'GOOD ATS COMPATIBILITY', desc: 'Solid ATS optimization with room for targeted improvements.' };
    return { title: 'ATS OPTIMIZATION NEEDED', desc: 'Significant improvements needed for better ATS performance.' };
  };

  const color = getColor(score);
  const status = getStatus(score);

  return (
    <div className="ats-component">
      <div className="ats-card">
        <MStripe />

        <div className="ats-inner">
          {/* Header */}
          <div className="ats-header">
            <div className="ats-header__left">
              <div className="ats-header__icon">
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h2 className="ats-header__title">ATS COMPATIBILITY</h2>
                <p className="ats-header__sub">Applicant Tracking System Analysis</p>
              </div>
            </div>
            
            <div className="ats-header__score">
              <span className="ats-header__score-value" style={{ color }}>{score}</span>
              <span className="ats-header__score-max">/ 100</span>
            </div>
          </div>
          
          {/* Status */}
          <div className="ats-status" style={{ borderLeftColor: color }}>
            <div className="ats-status__header">
              <div className="ats-status__dot" style={{ backgroundColor: color }} />
              <h3 className="ats-status__title">{status.title}</h3>
            </div>
            <p className="ats-status__desc">{status.desc}</p>
          </div>
          
          {/* Suggestions */}
          <div className="ats-suggestions">
            <h4 className="ats-suggestions__title">
              <span className="ats-suggestions__slash">///</span> OPTIMIZATION INSIGHTS
            </h4>
            <div className="ats-suggestions__grid">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="ats-tip">
                  <div className="ats-tip__icon-wrap">
                    {suggestion.type === "good" ? (
                      <div className="ats-tip__icon ats-tip__icon--good">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    ) : (
                      <div className="ats-tip__icon ats-tip__icon--improve">
                        <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6v6m0 4h.01" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <p className={`ats-tip__text ${suggestion.type === "good" ? "ats-tip__text--good" : ""}`}>
                    {suggestion.tip}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ats-component { margin-bottom: 32px; }

        .ats-card {
          background: #1a1a1a;
          border: 1px solid #3c3c3c;
          overflow: hidden;
          transition: border-color 0.5s ease;
        }
        .ats-card:hover { border-color: #555; }

        .ats-stripe { display: flex; height: 4px; width: 100%; }
        .ats-stripe__s1 { flex: 1; background: #0066b1; }
        .ats-stripe__s2 { flex: 1; background: #1c69d4; }
        .ats-stripe__s3 { flex: 1; background: #e22718; }

        .ats-inner { padding: 0; }

        /* ---- Header ---- */
        .ats-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 24px 32px;
          border-bottom: 1px solid #262626;
          background: #000;
        }

        .ats-header__left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .ats-header__icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #3c3c3c;
          background: #1a1a1a;
          color: #fff;
          flex-shrink: 0;
        }

        .ats-header__title {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: -0.5px;
          line-height: 1;
          margin-bottom: 4px;
        }

        .ats-header__sub {
          font-size: 12px;
          font-weight: 300;
          color: #7e7e7e;
          letter-spacing: 0.5px;
        }

        .ats-header__score {
          display: flex;
          align-items: baseline;
          gap: 4px;
          padding: 12px 20px;
          background: #0d0d0d;
          border: 1px solid #3c3c3c;
        }

        .ats-header__score-value {
          font-size: 36px;
          font-weight: 700;
          letter-spacing: -1px;
          line-height: 1;
        }

        .ats-header__score-max {
          font-size: 14px;
          color: #7e7e7e;
          font-weight: 400;
        }

        /* ---- Status ---- */
        .ats-status {
          margin: 24px 32px;
          padding-left: 20px;
          border-left: 4px solid;
        }

        .ats-status__header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .ats-status__dot {
          width: 8px;
          height: 8px;
          flex-shrink: 0;
        }

        .ats-status__title {
          font-size: 16px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .ats-status__desc {
          font-size: 14px;
          font-weight: 300;
          color: #bbbbbb;
          line-height: 1.5;
          margin-left: 18px;
        }

        /* ---- Suggestions ---- */
        .ats-suggestions {
          padding: 24px 32px 32px;
          border-top: 1px solid #262626;
        }

        .ats-suggestions__title {
          font-size: 12px;
          font-weight: 700;
          color: #fff;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ats-suggestions__slash {
          color: #7e7e7e;
        }

        .ats-suggestions__grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        @media (max-width: 640px) {
          .ats-suggestions__grid { grid-template-columns: 1fr; }
          .ats-header { flex-direction: column; align-items: flex-start; gap: 16px; }
        }

        .ats-tip {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          background: #0d0d0d;
          border: 1px solid #262626;
          transition: border-color 0.3s ease;
        }

        .ats-tip:hover { border-color: #3c3c3c; }

        .ats-tip__icon-wrap { margin-top: 2px; flex-shrink: 0; }

        .ats-tip__icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .ats-tip__icon--good { color: #0fa336; }
        .ats-tip__icon--improve { color: #f4b400; }

        .ats-tip__text {
          font-size: 13px;
          font-weight: 300;
          color: #bbbbbb;
          line-height: 1.5;
        }

        .ats-tip__text--good { color: #e6e6e6; }
      `}</style>
    </div>
  )
}

export default ATS