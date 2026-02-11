import React from 'react';
import { Heart, Share2 } from 'lucide-react';

const QuoteCard = ({ quote, onLike, isLiked }) => {
    if (!quote) return <div className="card">Loading motivation...</div>;

    return (
        <div className="card">
            <blockquote style={{ fontSize: '1.5em', fontStyle: 'italic', marginBottom: '1em' }}>
                "{quote.quote}"
            </blockquote>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <cite style={{ fontWeight: 'bold' }}>- {quote.author}</cite>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => onLike(quote)} className="icon-btn" title="Save to Favorites">
                        <Heart fill={isLiked ? "currentColor" : "none"} />
                    </button>
                    <button onClick={() => navigator.share?.({ title: 'Motivation', text: `"${quote.quote}" - ${quote.author}` })} className="icon-btn" title="Share">
                        <Share2 />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuoteCard;
