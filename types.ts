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
  GAME_LADDER = 'GAME_LADDER'
}

export type GameType = 'compass' | 'hangman' | 'word_hunt' | 'chain' | 'connect' | 'ladder';

export type CategoryId = 
  | 'animals' | 'food' | 'objects' | 'countries' | 'professions' | 'sports' | 'cities' 
  | 'kitchen' | 'clothes' | 'colors' | 'music' 
  | 'vehicles' | 'technology' | 'nature' | 'emotions' 
  | 'literature' | 'cinema' | 'mythology'
  | 'science6' | 'math_basic' | 'turkish_grammar' | 'chemistry' | 'body'
  | 'space' | 'history' | 'world_capitals';

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