import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService, HighScore } from '../service/core/game-state.service';

@Component({
  selector: 'app-highscores',
  standalone: false,
  // imports: [CommonModule],
  templateUrl: './highscores.component.html',
  styleUrl: './highscores.component.scss'
})
export class HighscoresComponent {
  scores = signal<HighScore[]>(this.state.getHighScores());
  sorted = computed(() =>
    [...this.scores()].sort((a, b) => (b.scoreLeft - b.scoreRight) - (a.scoreLeft - a.scoreRight))
  );

  constructor(private state: GameStateService) {}
}
