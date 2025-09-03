import { Injectable } from '@angular/core';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Mode = 'ai' | 'online';

export interface HighScore {
  name: string;
  scoreLeft: number;   // player score (left)
  scoreRight: number;  // opponent/computer score (right)
  difficulty: Difficulty;
  dateISO: string;
}

@Injectable({ providedIn: 'root' })
export class GameStateService {
  difficulty: Difficulty = 'Medium';
  mode: Mode = 'ai';
  playerName = 'Player 1';

  private HS_KEY = 'pp_highscores_v1';

  setDifficulty(d: Difficulty) { this.difficulty = d; }
  setMode(m: Mode) { this.mode = m; }
  setPlayerName(n: string) { this.playerName = n.trim() || 'Player 1'; }

  saveHighScore(entry: HighScore) {
    const all = this.getHighScores();
    all.push(entry);
    localStorage.setItem(this.HS_KEY, JSON.stringify(all.slice(-100))); // keep last 100
  }

  getHighScores(): HighScore[] {
    try {
      return JSON.parse(localStorage.getItem(this.HS_KEY) || '[]');
    } catch {
      return [];
    }
  }
}
