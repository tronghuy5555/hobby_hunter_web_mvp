import React from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { PackRevealAnimation } from '../components/packs';
import type { Card } from '../types';

const OpenPackPage: React.FC = () => {
  const { packId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { cards, packName } = (location.state as { cards: Card[]; packName: string }) || { cards: [], packName: 'Unknown Pack' };

  const handleComplete = () => {
    navigate('/my-cards');
  };

  if (!cards || cards.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No cards to reveal</h2>
          <p className="text-gray-400 mb-6">It looks like there was an issue with your pack opening.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-primary py-8">
      <PackRevealAnimation
        cards={cards}
        onComplete={handleComplete}
        packName={packName}
        allowSkip={true}
      />
    </div>
  );
};

export default OpenPackPage;