// Helper function to convert card notation to numeric values
const cardValue = (card) => {
  const values = {'2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14};
  return values[card[0]];
};

// Helper function to count occurrences of each card value
const countValues = (cards) => {
  return cards.reduce((count, card) => {
    const value = cardValue(card);
    count[value] = (count[value] || 0) + 1;
    return count;
  }, {});
};

// Helper function to check for a flush
const isFlush = (cards) => {
  const suits = cards.map(card => card.slice(-1));
  return suits.every(suit => suit === suits[0]);
};

// Helper function to check for a straight
const isStraight = (cards) => {
  const values = cards.map(card => cardValue(card)).sort((a, b) => a - b);
  for (let i = 1; i < values.length; i++) {
    if (values[i] !== values[i-1] + 1) {
      // Check for Ace-low straight
      if (i === values.length - 1 && values[0] === 2 && values[i] === 14) {
        continue;
      }
      return false;
    }
  }
  return true;
};

// Main hand evaluation function
export const evaluateHand = (holeCards, communityCards) => {
  const allCards = [...holeCards, ...communityCards];
  const counts = countValues(allCards);
  const flush = isFlush(allCards);
  const straight = isStraight(allCards);

  // Check for Royal Flush and Straight Flush
  if (flush && straight) {
    const values = allCards.map(card => cardValue(card));
    if (Math.max(...values) === 14 && Math.min(...values) === 10) {
      return 'Royal Flush';
    }
    return 'Straight Flush';
  }

  // Check for Four of a Kind
  if (Object.values(counts).includes(4)) {
    return 'Four of a Kind';
  }

  // Check for Full House
  if (Object.values(counts).includes(3) && Object.values(counts).includes(2)) {
    return 'Full House';
  }

  if (flush) return 'Flush';
  if (straight) return 'Straight';

  // Check for Three of a Kind
  if (Object.values(counts).includes(3)) {
    return 'Three of a Kind';
  }

  // Check for Two Pair
  if (Object.values(counts).filter(count => count === 2).length === 2) {
    return 'Two Pair';
  }

  // Check for Pair
  if (Object.values(counts).includes(2)) {
    return 'Pair';
  }

  return 'High Card';
};

// Function to get the best 5-card hand
export const getBestHand = (holeCards, communityCards) => {
  const allCards = [...holeCards, ...communityCards];
  let bestRank = 'High Card';
  let bestHand = allCards.slice(0, 5);

  // Generate all possible 5-card combinations
  for (let i = 0; i < allCards.length - 4; i++) {
    for (let j = i + 1; j < allCards.length - 3; j++) {
      for (let k = j + 1; k < allCards.length - 2; k++) {
        for (let l = k + 1; l < allCards.length - 1; l++) {
          for (let m = l + 1; m < allCards.length; m++) {
            const hand = [allCards[i], allCards[j], allCards[k], allCards[l], allCards[m]];
            const rank = evaluateHand(hand, []);
            if (handRankings.indexOf(rank) > handRankings.indexOf(bestRank)) {
              bestRank = rank;
              bestHand = hand;
            }
          }
        }
      }
    }
  }

  return { rank: bestRank, hand: bestHand };
};

// Hand rankings from lowest to highest
export const handRankings = [
  'High Card', 'Pair', 'Two Pair', 'Three of a Kind', 'Straight',
  'Flush', 'Full House', 'Four of a Kind', 'Straight Flush', 'Royal Flush'
];
