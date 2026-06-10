import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => {
    const [pathLength, setPathLength] = useState(0);
    const pathRef = useRef<SVGPathElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [animated, setAnimated] = useState(false);

    const percentage = score / 100;

    useEffect(() => {
        if (pathRef.current) {
            setPathLength(pathRef.current.getTotalLength());
        }
    }, []);

    // M-Design color based on score
    const getColor = (score: number) => {
        if (score >= 70) return '#0fa336';
        if (score >= 50) return '#f4b400';
        return '#e22718';
    };

    const color = getColor(score);

    return (
        <div className="score-gauge" ref={containerRef}>
            <div className="score-gauge__outer">
                {/* M-stripe top accent */}
                <div className="score-gauge__stripe">
                    <div className="score-gauge__s1" />
                    <div className="score-gauge__s2" />
                    <div className="score-gauge__s3" />
                </div>

                <div className="score-gauge__inner">
                    <svg viewBox="0 0 100 55" className="score-gauge__svg">
                        {/* Background arc */}
                        <path
                            d="M8,52 A42,42 0 0,1 92,52"
                            fill="none"
                            stroke="#1a1a1a"
                            strokeWidth="6"
                            strokeLinecap="square"
                        />
                        {/* Progress arc */}
                        <path
                            ref={pathRef}
                            d="M8,52 A42,42 0 0,1 92,52"
                            fill="none"
                            stroke={color}
                            strokeWidth="6"
                            strokeLinecap="square"
                            strokeDasharray={pathLength}
                            strokeDashoffset={pathLength * (1 - percentage)}
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                values={`${pathLength};${pathLength * (1 - percentage)}`}
                                dur="1.8s"
                                fill="freeze"
                                begin="0s"
                            />
                        </path>
                    </svg>

                    {/* Score display */}
                    <div className="score-gauge__value">
                        <span className="score-gauge__number" style={{ color }}>{score}</span>
                        <span className="score-gauge__max">/ 100</span>
                    </div>
                </div>
            </div>

            <style>{`
                .score-gauge {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }
                .score-gauge__outer {
                    position: relative;
                    width: 180px;
                    background: #0d0d0d;
                    border: 1px solid #3c3c3c;
                    transition: border-color 0.3s ease;
                    overflow: hidden;
                }
                .score-gauge__outer:hover {
                    border-color: #7e7e7e;
                }
                .score-gauge__stripe {
                    display: flex;
                    height: 3px;
                    width: 100%;
                }
                .score-gauge__s1 { flex: 1; background: #0066b1; }
                .score-gauge__s2 { flex: 1; background: #1c69d4; }
                .score-gauge__s3 { flex: 1; background: #e22718; }
                .score-gauge__inner {
                    position: relative;
                    width: 100%;
                    height: 100px;
                    background: #000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .score-gauge__svg {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                }
                .score-gauge__value {
                    position: relative;
                    z-index: 10;
                    text-align: center;
                    margin-top: 16px;
                }
                .score-gauge__number {
                    display: block;
                    font-size: 32px;
                    font-weight: 700;
                    letter-spacing: -1px;
                    line-height: 1;
                }
                .score-gauge__max {
                    font-size: 11px;
                    color: #7e7e7e;
                    font-weight: 400;
                    letter-spacing: 0.5px;
                }
            `}</style>
        </div>
    );
};

export default ScoreGauge;