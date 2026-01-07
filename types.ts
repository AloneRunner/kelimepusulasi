export enum GameStatus {
  MENU = 'MENU',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST'
}

export enum AppView {
  HUB = 'HUB',
  CATEGORY_SELECTION = 'CATEGORY_SELECTION',
  GAME_COMPASS = 'GAME_COMPASS',
  GAME_HANGMAN = 'GAME_HANGMAN',
  GAME_WORD_HUNT = 'GAME_WORD_HUNT',
  GAME_CHAIN = 'GAME_CHAIN',
  GAME_CONNECT = 'GAME_CONNECT',
  GAME_LADDER = 'GAME_LADDER',
  GAME_KOSTEBEK = 'GAME_KOSTEBEK',
  GAME_WORDLE = 'GAME_WORDLE'
}

export type GameType = 'compass' | 'hangman' | 'word_hunt' | 'chain' | 'connect' | 'ladder' | 'kostebek' | 'wordle';

export type CategoryId =
  | 'animals' | 'food' | 'objects' | 'countries' | 'professions' | 'sports' | 'cities'
  | 'kitchen' | 'clothes' | 'colors' | 'music'
  | 'vehicles' | 'technology' | 'nature' | 'emotions'
  | 'literature' | 'cinema' | 'mythology'
  | 'science6' | 'math_basic' | 'turkish_grammar' | 'chemistry' | 'body'
  | 'space' | 'history' | 'world_capitals' | 'science' | 'geography' | 'arts' | 'all';

export type CategoryGroup = 'general' | 'education';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string;
  words: string[];
  group: CategoryGroup;
}

export interface GuessResult {
  word: string;
  distance: number; // Positive means secret is "after/down", Negative means secret is "before/up"
  timestamp: number;
}

export interface HintData {
  text: string;
  used: boolean;
}

// --- KOSTEBEK AVI TYPES ---

export enum GamePhase {
  SETUP = 'SETUP',
  LOADING = 'LOADING',
  ROLE_REVEAL = 'ROLE_REVEAL',
  GAMEPLAY = 'GAMEPLAY',
  VOTING = 'VOTING',
  RESULTS = 'RESULTS'
}

export enum GameMode {
  CLASSIC = 'CLASSIC', // Imposter knows only category
  VARIANT = 'VARIANT'  // Imposter has a similar word
}

export interface Player {
  id: string;
  name: string;
  role: 'civilian' | 'imposter';
  word: string;
  isEliminated: boolean;
  votesReceived: number;
  isHuman: boolean;
  personality?: string;
  avatarId?: number; // Random avatar index
  score: number; // Points earned in the game
}

export interface Clue {
  playerId: string;
  playerName: string;
  text: string;
  round: number;
}

export interface GameData {
  category: string;
  secretWord: string; // The majority word
  imposterWord: string; // The minority word
  secretClues: string[]; // Clues for the secret word (Mapped from specific1/2)
  imposterClues: string[]; // Clues for the imposter word (Mapped from specific1/2)
  commonClues: string[]; // Clues that fit both words (Mapped from common)
}

export interface VoteResult {
  voterId: string;
  suspectId: string;
  reason: string;
}

// Data structure for our local database
export interface WordPair {
  word1: string;
  word2: string;
  specific1: string[]; // Unique clues for word1
  specific2: string[]; // Unique clues for word2
  common: string[];    // Clues that apply to both
}

export interface CategoryData {
  id: string;
  name: string;
  pairs: WordPair[];
}

// Data structure for our local database
export interface WordPair {
  word1: string;
  word2: string;
  specific1: string[]; // Unique clues for word1
  specific2: string[]; // Unique clues for word2
  common: string[];    // Clues that apply to both
}

export interface CategoryData {
  id: string;
  name: string;
  pairs: WordPair[];
}