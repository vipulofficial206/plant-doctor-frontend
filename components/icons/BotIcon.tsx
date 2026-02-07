
import React from 'react';

const BotIcon: React.FC = () => (
    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[var(--tertiary-accent)] to-[var(--secondary-accent)] flex items-center justify-center flex-shrink-0">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3M5.636 5.636l-1.414-1.414M19.778 5.636l-1.414 1.414M18.364 18.364l1.414 1.414M4.222 18.364l1.414-1.414M12 12a3 3 0 100-6 3 3 0 000 6z" />
        </svg>
    </div>
);

export default BotIcon;