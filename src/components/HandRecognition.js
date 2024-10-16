import React, { useState, useEffect, useRef } from 'react';
import { generateHoldemHand } from '../utils/pokerUtils';
import { getBestHand, handRankings } from '../utils/pokerHandEvaluator';

function HandRecognition() {
  const [currentHand, setCurrentHand] = useState(null);
  const [selectedRanking, setSelectedRanking] = useState('');
  const [feedback, setFeedback] = useState('');
  const [stage, setStage] = useState('preflop');
  const [cardSize, setCardSize] = useState(160); // Default size
  const cardContainerRef = useRef(null);

  useEffect(() => {
    generateHand();
    window.addEventListener('resize', adjustCardSize);
    return () => window.removeEventListener('resize', adjustCardSize);
  }, []);

  useEffect(() => {
    adjustCardSize();
  }, [currentHand]);

  const generateHand = () => {
    const newHand = generateHoldemHand();
    setCurrentHand(newHand);
    setSelectedRanking('');
    setFeedback('');
    setStage('preflop');
  };

  const advanceStage = () => {
    const stages = ['preflop', 'flop', 'turn', 'river'];
    const currentIndex = stages.indexOf(stage);
    if (currentIndex === stages.length - 1) {
      generateHand();
    }
    if (currentIndex < stages.length - 1) {
      setStage(stages[currentIndex + 1]);
    }
  };

  const handleRankingSelection = (selectedRanking) => {
    setSelectedRanking(selectedRanking);
    checkAnswer(selectedRanking);
  };

  const checkAnswer = (selectedRanking) => {
    if (!currentHand) return;

    const communityCards = currentHand.communityCards.slice(0, 
      stage === 'flop' ? 3 : stage === 'turn' ? 4 : stage === 'river' ? 5 : 0
    );

    const { rank: correctRanking } = getBestHand(currentHand.holeCards, communityCards);
    
    if (selectedRanking === correctRanking) {
      setFeedback('Correct! Well done.');
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctRanking}.`);
    }

    setTimeout(() => {
      setFeedback('');
      advanceStage();
    }, 2000);
  };

  const adjustCardSize = () => {
    if (cardContainerRef.current) {
      const containerWidth = cardContainerRef.current.offsetWidth;
      const maxCards = 5; // Maximum number of cards in a row
      const spacing = 16; // Spacing between cards (4 * 4px from space-x-4)
      const newSize = Math.floor((containerWidth - (maxCards - 1) * spacing) / maxCards);
      setCardSize(newSize);
    }
  };

  const renderCards = (cards, visibleCount) => (
    <div className="flex flex-wrap justify-center space-x-4">
      {cards.map((card, index) => (
        <img 
          key={index} 
          src={`/assets/cards/${card}.png`} 
          alt={card} 
          style={{ width: `${cardSize}px`, height: 'auto' }}
          className={`transition-opacity duration-300 ${index < visibleCount ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
    </div>
  );

  const getVisibleCardCount = () => {
    switch (stage) {
      case 'flop': return 3;
      case 'turn': return 4;
      case 'river': return 5;
      default: return 0;
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-between h-full w-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 md:space-y-0 md:space-x-8">
      {/* Left column: Hand ranking selection */}
      <div className="w-full md:w-1/5 flex flex-col items-center md:items-start">
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">Select Hand Ranking</h3>
        <select 
          value={selectedRanking} 
          onChange={(e) => handleRankingSelection(e.target.value)}
          className="bg-gray-700 text-white text-xl md:text-2xl py-4 px-6 rounded-lg w-full cursor-pointer hover:bg-gray-600 transition-colors"
        >
          <option value="">Choose ranking</option>
          {handRankings.map((ranking) => (
            <option key={ranking} value={ranking}>{ranking}</option>
          ))}
        </select>
      </div>

      {/* Center column: Cards */}
      <div ref={cardContainerRef} className="w-full md:w-3/5 flex flex-col items-center">
        {currentHand && (
          <>
            <div className="mb-16 w-full">
              <h3 className="text-3xl font-semibold mb-6">Community Cards</h3>
              {renderCards(currentHand.communityCards, getVisibleCardCount())}
            </div>
            <div className="w-full">
              <h3 className="text-3xl font-semibold mb-6">Your Hand</h3>
              {renderCards(currentHand.holeCards, 2)}
            </div>
          </>
        )}
      </div>

      {/* Right column: Feedback */}
      <div className="w-full md:w-1/5 flex flex-col items-center">
        <h3 className="text-3xl font-semibold mb-6 text-center w-full">Result</h3>
        <div className="h-16 flex items-center justify-center w-full">
          {feedback && (
            <div className={`text-2xl text-center ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HandRecognition;
