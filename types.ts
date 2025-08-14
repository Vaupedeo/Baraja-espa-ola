
export enum Suit {
  Oros = 'Oros',
  Copas = 'Copas',
  Espadas = 'Espadas',
  Bastos = 'Bastos',
}

export type Rank = 'As' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'Sota' | 'Caballo' | 'Rey';

export interface Card {
  rank: Rank;
  suit: Suit;
  inverted: boolean;
}

export interface ReadingCard extends Card {
  id: string;
}

export interface CardInterpretation {
  nombre_carta: string;
  interpretacion_general: string;
  aspectos_clave: {
    positivo: string;
    negativo: string;
  };
  simbolismo: string;
  consejo: string;
}

export interface SingleCardReading {
  card: ReadingCard;
  interpretation: CardInterpretation;
}

export interface ThreeCardReading {
  past: { card: ReadingCard; interpretation: CardInterpretation };
  present: { card: ReadingCard; interpretation: CardInterpretation };
  future: { card: ReadingCard; interpretation: CardInterpretation };
  summary: string;
  advice: string;
}

export interface Clarification {
  card: ReadingCard;
  interpretation: string;
}

export type ReadingResult = SingleCardReading | ThreeCardReading | null;

export enum View {
  Home = 'HOME',
  SingleCard = 'SINGLE_CARD',
  DeckPicking = 'DECK_PICKING',
  OneCardDraw = 'ONE_CARD_DRAW',
  ThreeCardSpread = 'THREE_CARD_SPREAD',
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}