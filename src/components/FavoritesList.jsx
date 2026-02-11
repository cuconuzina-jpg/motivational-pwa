import React from 'react';
import { Trash2 } from 'lucide-react';

const FavoritesList = ({ favorites, removeFavorite }) => {
    if (favorites.length === 0) return <p>No favorites yet. Start liking quotes!</p>;

    return (
        <div style={{ marginTop: '2em', textAlign: 'left' }}>
            <h3>Your Favorites</h3>
            {favorites.map((fav, index) => (
                <div key={index} className="card" style={{ padding: '1em', fontSize: '0.9em' }}>
                    <p>"{fav.quote}"</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <small>- {fav.author}</small>
                        <button onClick={() => removeFavorite(fav.quote)} className="icon-btn" style={{ fontSize: '1em', color: 'red' }}>
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default FavoritesList;
