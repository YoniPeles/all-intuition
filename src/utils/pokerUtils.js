const suits = ['h', 'd', 'c', 's'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function shuffleDeck() {
  const deck = suits.flatMap(suit => values.map(value => `${value}${suit}`));
  return deck.sort(() => Math.random() - 0.5);
}

export function generateHoldemHand() {
  const shuffled = shuffleDeck();
  return {
    holeCards: shuffled.slice(0, 2),
    communityCards: shuffled.slice(2, 7)
  };
}
