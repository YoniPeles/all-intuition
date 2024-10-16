import React, { useState, useEffect, useRef, useCallback } from 'react';
import { generateHoldemHand } from '../utils/pokerUtils';
import { getBestHand, handRankings } from '../utils/pokerHandEvaluator';

function HandRecognition() {
  const [currentHand, setCurrentHand] = useState(null);
  const [selectedRanking, setSelectedRanking] = useState('');
  const [feedback, setFeedback] = useState('');
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [cardSize, setCardSize] = useState(100);
  const timerRef = useRef(null);
  const cardContainerRef = useRef(null);

  const generateHand = useCallback(() => {
    const newHand = generateHoldemHand();
    setCurrentHand(newHand);
  }, []);

  const adjustCardSize = useCallback(() => {
    if (cardContainerRef.current) {
      const containerWidth = cardContainerRef.current.offsetWidth;
      const maxCards = 5; // Maximum number of cards in a row
      const spacing = 16; // Spacing between cards (4 * 4px from space-x-4)
      const newSize = Math.floor((containerWidth - (maxCards - 1) * spacing) / maxCards);
      setCardSize(newSize);
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    const startTime = Date.now();
    timerRef.current = setInterval(() => {
      setTimer(Date.now() - startTime);
    }, 100);
  }, []);

  const resetStates = useCallback(() => {
    setSelectedRanking('');
    setFeedback('');
    setTimer(0);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const checkAnswer = useCallback((selectedRanking) => {
    if (!currentHand || gameOver) return;

    const { rank: correctRanking } = getBestHand(currentHand.holeCards, currentHand.communityCards);
    
    if (selectedRanking === correctRanking) {
      setFeedback('Correct! Well done.');
      const newScore = Math.max(1000 - Math.floor(timer / 50), 0);
      setScore(prevScore => prevScore + newScore);
      
      if (timerRef.current) clearInterval(timerRef.current);
      
      setTimeout(() => {
        setFeedback('');
        generateHand();
        startTimer();
      }, 2000);
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctRanking}.`);
      setGameOver(true);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [currentHand, gameOver, timer, generateHand, startTimer]);

  const handleRankingSelection = useCallback((event) => {
    if (showIntro || gameOver) return;
    const selectedRanking = event.target.value;
    setSelectedRanking(selectedRanking);
    checkAnswer(selectedRanking);
    event.target.blur(); // This will remove focus from the select element
  }, [showIntro, gameOver, checkAnswer]);

  const startGame = useCallback(() => {
    setShowIntro(false);
    resetStates();
    generateHand();
    startTimer();
  }, [resetStates, generateHand, startTimer]);

  const restartGame = useCallback(() => {
    setGameOver(false);
    setScore(0);
    resetStates();
    generateHand();
    startTimer();
  }, [resetStates, generateHand, startTimer]);

  const handleKeyUp = useCallback((event) => {
    console.log('Key up:', event.key, 'KeyCode:', event.keyCode, 'Which:', event.which);
  
    if (showIntro) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        console.log('Starting game');
        setGameOver(false);
        startGame();
      }
      return;
    }
  
    if (gameOver) {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault();
        console.log('Restarting game');
        restartGame();
      }
      return;
    }
  
    const key = parseInt(event.key, 10);
    if (key >= 1 && key <= 10) {
      console.log('Selecting ranking:', handRankings[key - 1]);
      const selectedRanking = handRankings[key - 1];
      setSelectedRanking(selectedRanking);
      checkAnswer(selectedRanking);
    }
  }, [showIntro, gameOver, checkAnswer, startGame, restartGame]); // Added missing dependencies

  useEffect(() => {
    console.log('Setting up event listeners');
    generateHand();
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('resize', adjustCardSize);
    adjustCardSize();
    return () => {
      console.log('Cleaning up event listeners');
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', adjustCardSize);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []); // Empty dependency array

  useEffect(() => {
    if (!showIntro && !gameOver) {
      startTimer();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [showIntro, gameOver]);

  useEffect(() => {
    adjustCardSize();
  }, [currentHand, adjustCardSize]);

  useEffect(() => {
    if (gameOver) {
      // Blur any focused element when the game is over
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    }
  }, [gameOver]);

  const formatTime = (time) => {
    const seconds = (time / 1000).toFixed(1);
    return `${seconds}`;
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

  const IntroScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center" style={{ zIndex: 40 }}>
      <div className="bg-gray-900 p-8 rounded-lg max-w-2xl text-center text-white mt-16">
        <h1 className="text-4xl font-bold mb-4">Poker Hand Recognition</h1>
        <p className="text-xl mb-6">
          Test your poker skills! Identify the best possible hand ranking
          based on the community cards and your hole cards. Use the dropdown
          or number keys (1-10) to select your answer. The faster you answer
          correctly, the higher your score!
        </p>
        <button
          onClick={startGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Start Game
        </button>
      </div>
    </div>
  );

  const DeathScreen = () => (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center" style={{ zIndex: 40 }}>
      <div className="bg-gray-900 p-8 rounded-lg max-w-2xl text-center text-white mt-16">
        <h1 className="text-4xl font-bold mb-4">Game Over!</h1>
        <p className="text-2xl mb-6">Your final score: {score}</p>
        <button
          onClick={restartGame}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  useEffect(() => {
    const handleGlobalKeyUp = (event) => {
      handleKeyUp(event);
    };

    window.addEventListener('keyup', handleGlobalKeyUp);

    return () => {
      window.removeEventListener('keyup', handleGlobalKeyUp);
    };
  }, [handleKeyUp]);

  return (
    <div className="relative flex flex-col md:flex-row items-start justify-between h-full w-full max-w-[1400px] mx-auto p-4 md:p-8 space-y-8 md:space-y-0 md:space-x-8">
      {/* Main content */}
      <div className="w-full md:w-1/5 flex flex-col items-center md:items-start">
        <div className="text-3xl font-semibold mb-6 text-center w-full">
          Time: {showIntro || gameOver ? '0.0s' : formatTime(timer)}
        </div>
        <h3 className="text-2xl md:text-3xl font-semibold mb-6">Select Hand Ranking</h3>
        <select 
          value={selectedRanking} 
          onChange={handleRankingSelection}
          className="bg-gray-700 text-white text-xl md:text-2xl py-4 px-6 rounded-lg w-full cursor-pointer hover:bg-gray-600 transition-colors"
        >
          <option value="">Choose ranking</option>
          {handRankings.map((ranking, index) => (
            <option key={ranking} value={ranking}>{`${index + 1}. ${ranking}`}</option>
          ))}
        </select>
      </div>
      <div ref={cardContainerRef} className="w-full md:w-3/5 flex flex-col items-center">
        <div className="text-3xl font-semibold mb-6 text-center w-full">
          Score: {score}
        </div>
        {currentHand && (
          <>
            <div className="mb-16 w-full">
              <h3 className="text-3xl font-semibold mb-6">Community Cards</h3>
              {renderCards(currentHand.communityCards, 5)}
            </div>
            <div className="w-full">
              <h3 className="text-3xl font-semibold mb-6">Your Hand</h3>
              {renderCards(currentHand.holeCards, 2)}
            </div>
          </>
        )}
      </div>
      <div className="w-full md:w-1/5 flex flex-col items-center">
        <h3 className="text-3xl font-semibold mb-6 text-center w-full">Result</h3>
        <div className="h-16 flex items-center justify-center w-full">
          {feedback && !showIntro && (
            <div className={`text-2xl text-center ${feedback.includes('Correct') ? 'text-green-500' : 'text-red-500'}`}>
              {feedback}
            </div>
          )}
        </div>
      </div>

      {/* Overlay screens */}
      {showIntro && <IntroScreen />}
      {gameOver && <DeathScreen />}
    </div>
  );
}

export default HandRecognition;
