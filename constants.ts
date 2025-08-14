
import { Suit, Rank, Card } from './types';

export const SUITS: Suit[] = [Suit.Oros, Suit.Copas, Suit.Espadas, Suit.Bastos];
export const RANKS: Rank[] = ['As', '2', '3', '4', '5', '6', '7', '8', '9', 'Sota', 'Caballo', 'Rey'];

export const DECK: Omit<Card, 'inverted'>[] = SUITS.flatMap(suit =>
  RANKS.map(rank => ({ suit, rank }))
);