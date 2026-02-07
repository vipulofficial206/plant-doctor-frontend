import React from 'react';

interface ConfidenceMeterProps {
    confidence: number;
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ confidence }) => {
    const percentage = Math.round(confidence * 100);
    const radius = 48;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (confidence * circumference);

    const getColor = (value: number) => {
        if (value < 0.5) return '#F94144'; // Bright Red
        if (value < 0.75) return '#F9C74F'; // Bright Yellow
        return '#90BE6D'; // Bright Green
    };

    const color = getColor(confidence);

    return (
        <div className="relative flex items-center justify-center w-28 h-28">
            <svg className="w-full h-full" viewBox="0 0 110 110">
                <circle
                    className="text-gray-200"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="55"
                    cy="55"
                />
                <circle
                    strokeWidth="8"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx="55"
                    cy="55"
                    transform="rotate(-90 55 55)"
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out', filter: `drop-shadow(0 0 5px ${color})` }}
                />
            </svg>
            <span className="absolute text-2xl font-bold" style={{ color }}>
                {percentage}%
            </span>
        </div>
    );
};

export default ConfidenceMeter;