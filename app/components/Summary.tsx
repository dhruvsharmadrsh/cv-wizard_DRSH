import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

/* M-Stripe Divider */
function MStripe() {
    return (
        <div className="summary-stripe">
            <div className="summary-stripe__s1" />
            <div className="summary-stripe__s2" />
            <div className="summary-stripe__s3" />
        </div>
    );
}

const categoryIcons: Record<string, JSX.Element> = {
    "Tone & Style": (
        <svg className="summary-cat__icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
        </svg>
    ),
    "Content": (
        <svg className="summary-cat__icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
    ),
    "Structure": (
        <svg className="summary-cat__icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
    ),
    "Skills": (
        <svg className="summary-cat__icon-svg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
    ),
};

const Category = ({ title, score }: { title: string, score: number }) => {
    const getBarColor = (s: number) => {
        if (s >= 70) return '#0fa336';
        if (s >= 50) return '#f4b400';
        return '#e22718';
    };

    return (
        <div className="summary-cat">
            <div className="summary-cat__left">
                <div className="summary-cat__icon">
                    {categoryIcons[title] || categoryIcons["Content"]}
                </div>
                <div className="summary-cat__info">
                    <h3 className="summary-cat__title">{title}</h3>
                    {/* Mini progress bar */}
                    <div className="summary-cat__bar-track">
                        <div 
                            className="summary-cat__bar-fill" 
                            style={{ width: `${score}%`, backgroundColor: getBarColor(score) }}
                        />
                    </div>
                </div>
            </div>
            <ScoreBadge score={score} label="SCORE" />
        </div>
    );
};

const Summary = ({ feedback }: { feedback: any }) => {
    return (
        <div className="summary-component">
            <div className="summary-card">
                <MStripe />

                {/* Header */}
                <div className="summary-header">
                    <div className="summary-header__gauge">
                        <ScoreGauge score={feedback.overallScore} />
                    </div>

                    <div className="summary-header__info">
                        <h2 className="summary-header__title">YOUR RESUME SCORE</h2>
                        <p className="summary-header__desc">
                            Calculated from tone, content, structure, skills, and ATS compatibility metrics.
                        </p>

                        <div className="summary-header__badges">
                            <div className="summary-header__badge">
                                <div className="summary-header__badge-dot summary-header__badge-dot--green" />
                                <span>ANALYZED</span>
                            </div>
                            <div className="summary-header__badge-sep" />
                            <div className="summary-header__badge">
                                <div className="summary-header__badge-dot summary-header__badge-dot--blue" />
                                <span>AI POWERED</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories */}
                <div className="summary-categories">
                    <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
                    <Category title="Content" score={feedback.content.score} />
                    <Category title="Structure" score={feedback.structure.score} />
                    <Category title="Skills" score={feedback.skills.score} />
                </div>
            </div>

            <style>{`
                .summary-component { margin-bottom: 32px; }

                .summary-card {
                    background: #1a1a1a;
                    border: 1px solid #3c3c3c;
                    overflow: hidden;
                    transition: border-color 0.5s ease;
                }
                .summary-card:hover { border-color: #555; }

                .summary-stripe { display: flex; height: 4px; width: 100%; }
                .summary-stripe__s1 { flex: 1; background: #0066b1; }
                .summary-stripe__s2 { flex: 1; background: #1c69d4; }
                .summary-stripe__s3 { flex: 1; background: #e22718; }

                /* ---- Header ---- */
                .summary-header {
                    display: flex;
                    align-items: center;
                    gap: 32px;
                    padding: 32px;
                    border-bottom: 1px solid #262626;
                    background: #000;
                }

                @media (max-width: 640px) {
                    .summary-header {
                        flex-direction: column;
                        text-align: center;
                        padding: 24px;
                    }
                }

                .summary-header__gauge { flex-shrink: 0; }

                .summary-header__title {
                    font-size: 28px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: -0.5px;
                    line-height: 1;
                    margin-bottom: 8px;
                }

                .summary-header__desc {
                    font-size: 14px;
                    font-weight: 300;
                    color: #bbbbbb;
                    line-height: 1.5;
                    max-width: 400px;
                    margin-bottom: 12px;
                }

                .summary-header__badges {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .summary-header__badge {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #fff;
                    text-transform: uppercase;
                }

                .summary-header__badge-dot {
                    width: 6px;
                    height: 6px;
                }

                .summary-header__badge-dot--green { background: #0fa336; }
                .summary-header__badge-dot--blue { background: #1c69d4; }
                .summary-header__badge-sep { width: 1px; height: 12px; background: #3c3c3c; }

                /* ---- Categories ---- */
                .summary-categories { background: #0d0d0d; }

                .summary-cat {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px 32px;
                    border-bottom: 1px solid #262626;
                    transition: background 0.3s ease;
                }

                .summary-cat:last-child { border-bottom: none; }
                .summary-cat:hover { background: #1a1a1a; }

                .summary-cat__left {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    flex: 1;
                    min-width: 0;
                }

                .summary-cat__icon {
                    width: 36px;
                    height: 36px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid #3c3c3c;
                    background: #000;
                    flex-shrink: 0;
                    transition: border-color 0.3s ease;
                }

                .summary-cat:hover .summary-cat__icon { border-color: #7e7e7e; }

                .summary-cat__icon-svg {
                    width: 18px;
                    height: 18px;
                    color: #fff;
                }

                .summary-cat__info {
                    flex: 1;
                    min-width: 0;
                }

                .summary-cat__title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 6px;
                }

                .summary-cat__bar-track {
                    width: 100%;
                    max-width: 200px;
                    height: 3px;
                    background: #262626;
                    overflow: hidden;
                }

                .summary-cat__bar-fill {
                    height: 100%;
                    transition: width 1.5s ease-out;
                }
            `}</style>
        </div>
    );
};

export default Summary;