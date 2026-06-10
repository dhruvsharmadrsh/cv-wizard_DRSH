import React from 'react';

const ScoreCircle = ({ score = 75 }: { score: number }) => {
    const radius = 40;
    const stroke = 8;
    const normalizedRadius = radius - stroke / 2;
    const circumference = 2 * Math.PI * normalizedRadius;
    const progress = score / 100;
    const strokeDashoffset = circumference * (1 - progress);

    // M-Design color based on score
    const getColor = (score: number) => {
        if (score >= 70) return '#0fa336'; // success green
        if (score >= 50) return '#f4b400'; // warning yellow
        return '#e22718'; // m-red
    };

    const color = getColor(score);

    return (
        <div className="relative group flex items-center justify-center">
            <div className="relative w-[100px] h-[100px] bg-black border border-[#3c3c3c] rounded-full transition-all duration-300 group-hover:border-white">
                
                {/* Inner container */}
                <div className="relative w-full h-full rounded-full">
                    <svg
                        height="100%"
                        width="100%"
                        viewBox="0 0 100 100"
                        className="transform -rotate-90"
                    >
                        {/* Background circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={normalizedRadius}
                            stroke="#1a1a1a"
                            strokeWidth={stroke}
                            fill="transparent"
                        />
                        
                        {/* Progress circle */}
                        <circle
                            cx="50"
                            cy="50"
                            r={normalizedRadius}
                            stroke={color}
                            strokeWidth={stroke}
                            fill="transparent"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            className="transition-all duration-1000 ease-out"
                        >
                            <animate
                                attributeName="stroke-dashoffset"
                                values={`${circumference};${strokeDashoffset}`}
                                dur="1.5s"
                                fill="freeze"
                                begin="0s"
                            />
                        </circle>
                    </svg>

                    {/* Score display */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <div className="relative z-10">
                            <span 
                                className="font-bold text-[24px] leading-none"
                                style={{ color }}
                            >
                                {score}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreCircle;