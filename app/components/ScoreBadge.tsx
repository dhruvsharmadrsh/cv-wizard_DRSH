import React from 'react';

const ScoreBadge = ({ score = 75, label = "SCORE" }: { score: number, label?: string }) => {
    const getColor = (score: number) => {
        if (score >= 70) return '#0fa336';
        if (score >= 50) return '#f4b400';
        return '#e22718';
    };

    const color = getColor(score);

    return (
        <div className="score-badge">
            <div className="score-badge__accent" style={{ backgroundColor: color }} />
            <span className="score-badge__label">{label}</span>
            <div className="score-badge__sep" />
            <span className="score-badge__value" style={{ color }}>{score}</span>

            <style>{`
                .score-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 10px;
                    padding: 6px 14px;
                    background: #0d0d0d;
                    border: 1px solid #3c3c3c;
                    position: relative;
                    overflow: hidden;
                    transition: border-color 0.3s ease;
                }
                .score-badge:hover {
                    border-color: #7e7e7e;
                }
                .score-badge__accent {
                    position: absolute;
                    left: 0;
                    top: 0;
                    bottom: 0;
                    width: 3px;
                }
                .score-badge__label {
                    font-size: 10px;
                    font-weight: 700;
                    letter-spacing: 1.5px;
                    color: #7e7e7e;
                    text-transform: uppercase;
                    margin-left: 4px;
                }
                .score-badge__sep {
                    width: 1px;
                    height: 16px;
                    background: #3c3c3c;
                }
                .score-badge__value {
                    font-size: 18px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
            `}</style>
        </div>
    );
};

export default ScoreBadge;