import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ isNight, toggleTheme }) => {
    return (
        <button onClick={toggleTheme} className="icon-btn">
            {isNight ? <Sun /> : <Moon />}
        </button>
    );
};

export default ThemeToggle;
