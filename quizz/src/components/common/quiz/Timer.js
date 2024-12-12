import React, { useEffect } from 'react';
import './Timer.css';

const Timer = ({ timeRemaining, setTimeRemaining }) => {
    useEffect(() => {
        if (timeRemaining === null || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, setTimeRemaining]);

    const formatTime = (seconds) => {
        if (seconds === null) return '00:00:00';
        
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes
            .toString()
            .padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`timer ${timeRemaining < 300 ? 'warning' : ''}`}>
            <div className="timer-content">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">{formatTime(timeRemaining)}</span>
            </div>
        </div>
    );
};

export default Timer;