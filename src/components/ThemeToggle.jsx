import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isNight, toggleTheme }) => {
    return (
        <button onClick={toggleTheme} className="icon-btn" style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
            {isNight ? <Sun /> : <Moon />}
        </button>
    );
};

export default ThemeToggle;
