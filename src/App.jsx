import React, { useState, useEffect } from 'react';
import { fetchQuote } from './services/quoteManager';
import { getFavorites, saveFavorite, removeFavorite, getSavedTheme, saveTheme } from './services/storage';
import QuoteCard from './components/QuoteCard';
import ThemeToggle from './components/ThemeToggle';
import FavoritesList from './components/FavoritesList';
import './App.css';

function App() {
  const [quote, setQuote] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isNight, setIsNight] = useState(false);
  const [loading, setLoading] = useState(false);

  // Initialize Theme
  useEffect(() => {
    const savedTheme = getSavedTheme();
    if (savedTheme === 'night') {
      setIsNight(true);
      document.body.classList.add('night');
      document.body.classList.remove('day');
    } else {
      setIsNight(false);
      document.body.classList.add('day');
      document.body.classList.remove('night');
    }
  }, []);

  // Initialize Favorites
  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  // Fetch Quote Function
  const fetchNewQuote = async () => {
    setLoading(true);
    const newQuote = await fetchQuote();
    setQuote(newQuote);
    setLoading(false);
  };

  // Initial Quote
  useEffect(() => {
    fetchNewQuote();
  }, []);

  // Notification Logic
  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    }

    if (Notification.permission !== "denied") {
      Notification.requestPermission();
    }

    const checkTimeAndNotify = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();

      // Notify at 9:00, 13:00, 16:00
      const notificationTimes = [9, 13, 16];

      if (notificationTimes.includes(hour) && minute === 0) {
        // Simple check to avoid multiple notifications in the same minute
        // In a real app, track 'lastNotified' timestamp in localStorage
        const lastNotified = localStorage.getItem('lastNotified');
        const currentPeriod = `${now.toDateString()}-${hour}`;

        if (lastNotified !== currentPeriod) {
          new Notification("Motivation Time!", {
            body: "Time for a productivity boost! Check your new quote.",
            icon: '/pwa-192x192.png'
          });
          fetchNewQuote();
          localStorage.setItem('lastNotified', currentPeriod);
        }
      }
    };

    const interval = setInterval(checkTimeAndNotify, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Event Handlers
  const toggleTheme = () => {
    const newMode = !isNight;
    setIsNight(newMode);
    saveTheme(newMode ? 'night' : 'day');
    document.body.className = newMode ? 'night' : 'day';
  };

  const handleLike = (q) => {
    if (saveFavorite(q)) {
      setFavorites(getFavorites());
    }
  };

  const handleRemoveFavorite = (qText) => {
    removeFavorite(qText);
    setFavorites(getFavorites());
  };

  return (
    <div className="App">
      <ThemeToggle isNight={isNight} toggleTheme={toggleTheme} />

      <h1>Daily Motivation</h1>

      <div style={{ minHeight: '300px' }}>
        {loading ? (
          <p>Consulting the Oracle of Productivity...</p>
        ) : (
          quote && (
            <QuoteCard
              quote={quote}
              onLike={handleLike}
              isLiked={favorites.some(f => f.quote === quote.quote)}
            />
          )
        )}
      </div>

      <button
        onClick={fetchNewQuote}
        disabled={loading}
        style={{ fontSize: '1.2em', padding: '0.8em 2em', opacity: loading ? 0.7 : 1, cursor: loading ? 'not-allowed' : 'pointer' }}
      >
        {loading ? 'Generating...' : 'New Quote'}
      </button>

      <FavoritesList favorites={favorites} removeFavorite={handleRemoveFavorite} />
    </div>
  );
}

export default App;
