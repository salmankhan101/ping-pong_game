import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Difficulty, GameStateService } from '../service/core/game-state.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: false,
  // imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  playerName = this.state.playerName;
  difficulty: Difficulty = this.state.difficulty;

  constructor(private router: Router, private state: GameStateService) {}

  playAI() {
    this.state.setPlayerName(this.playerName);
    this.state.setDifficulty(this.difficulty);
    this.state.setMode('ai');
    this.router.navigate(['/game'], { queryParams: { mode: 'ai' } });
  }

  goOnline() {
    this.state.setPlayerName(this.playerName);
    this.state.setDifficulty(this.difficulty);
    this.state.setMode('online');
    this.router.navigate(['/online']);
  }
}
