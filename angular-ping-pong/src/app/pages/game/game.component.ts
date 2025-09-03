import {
  Component,
  ElementRef,
  ViewChild,
  HostListener,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  @ViewChild('gameCanvas', { static: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  // Game State
  ballX = 450;
  ballY = 270;
  ballSpeedX = 5;
  ballSpeedY = 3;
  ballSize = 10;

  paddleHeight = 80;
  paddleWidth = 12;
  leftPaddleY = 230;
  rightPaddleY = 230;
  paddleSpeed = 6;

  scoreLeft = 0;
  scoreRight = 0;
  maxScore = 10;

  paused = true;
  gameOver = false;
  countdown = 0;

  mode: string = 'ai';
  difficulty: string = 'Medium';

  winner: string = '';

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;

    // get query params
    this.route.queryParams.subscribe((params) => {
      this.mode = params['mode'] || 'ai';
    });

    this.onDifficultyChange();
    requestAnimationFrame(() => this.gameLoop());
  }

  /* 🎮 Main Game Loop */
  private gameLoop() {
    if (!this.paused && !this.gameOver) {
      this.update();
    }
    this.draw();
    requestAnimationFrame(() => this.gameLoop());
  }

  private update() {
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Collision top/bottom
    if (this.ballY < 0 || this.ballY > 540) {
      this.ballSpeedY = -this.ballSpeedY;
    }

    // Collision with left paddle
    if (
      this.ballX < this.paddleWidth &&
      this.ballY > this.leftPaddleY &&
      this.ballY < this.leftPaddleY + this.paddleHeight
    ) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // Collision with right paddle
    if (
      this.ballX > 900 - this.paddleWidth &&
      this.ballY > this.rightPaddleY &&
      this.ballY < this.rightPaddleY + this.paddleHeight
    ) {
      this.ballSpeedX = -this.ballSpeedX;
    }

    // Score
    if (this.ballX < 0) {
      this.scoreRight++;
      this.checkGameOver();
      this.resetBall();
    } else if (this.ballX > 900) {
      this.scoreLeft++;
      this.checkGameOver();
      this.resetBall();
    }

    // AI Paddle (only in AI mode)
    if (this.mode === 'ai') {
      const target = this.ballY - this.paddleHeight / 2;
      if (this.rightPaddleY < target) {
        this.rightPaddleY += this.paddleSpeed;
      } else {
        this.rightPaddleY -= this.paddleSpeed;
      }
    }
  }

  private draw() {
    this.ctx.clearRect(0, 0, 900, 540);

    // Table
    this.ctx.fillStyle = '#007a33';
    this.ctx.fillRect(0, 0, 900, 540);

    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, 0, 900, 540);

    // Net
    this.ctx.beginPath();
    this.ctx.setLineDash([10, 15]);
    this.ctx.moveTo(450, 0);
    this.ctx.lineTo(450, 540);
    this.ctx.strokeStyle = 'white';
    this.ctx.lineWidth = 3;
    this.ctx.stroke();
    this.ctx.setLineDash([]);

    // Labels
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 20px Orbitron, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Player', 60, 30);
    this.ctx.fillText(this.mode === 'ai' ? 'Computer' : 'Player 2', 840, 30);

    // Paddles
    this.ctx.fillStyle = 'red';
    this.ctx.fillRect(0, this.leftPaddleY, this.paddleWidth, this.paddleHeight);

    this.ctx.fillStyle = 'blue';
    this.ctx.fillRect(
      900 - this.paddleWidth,
      this.rightPaddleY,
      this.paddleWidth,
      this.paddleHeight
    );

    // Ball
    this.ctx.fillStyle = 'white';
    this.ctx.beginPath();
    this.ctx.arc(this.ballX, this.ballY, this.ballSize, 0, Math.PI * 2);
    this.ctx.fill();
  }

  private resetBall() {
    this.ballX = 450;
    this.ballY = 270;
    this.ballSpeedX = -this.ballSpeedX;
    this.ballSpeedY = 3;
  }

  private checkGameOver() {
    if (this.scoreLeft >= this.maxScore || this.scoreRight >= this.maxScore) {
      this.gameOver = true;
      this.paused = true;
      this.winner =
        this.scoreLeft > this.scoreRight
          ? 'Player'
          : this.mode === 'ai'
          ? 'Computer'
          : 'Player 2';
    }
  }

  /* 🎛 Controls */
  togglePause() {
    this.paused = !this.paused;
  }

  restartGame() {
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.gameOver = false;
    this.startCountdown();
  }

  startGame() {
    this.scoreLeft = 0;
    this.scoreRight = 0;
    this.gameOver = false;
    this.startCountdown();
  }

  private startCountdown() {
    this.countdown = 3;
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.paused = false;
      }
    }, 1000);
  }

  onDifficultyChange() {
    switch (this.difficulty) {
      case 'Easy':
        this.paddleSpeed = 3;
        break;
      case 'Medium':
        this.paddleSpeed = 6;
        break;
      case 'Hard':
        this.paddleSpeed = 9;
        break;
    }
  }

  resumeIfPaused() {
    if (this.paused && !this.gameOver) {
      this.paused = false;
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }

  /* Keyboard controls */
  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space') {
      this.togglePause();
    }
    if (event.code === 'ArrowUp') {
      this.leftPaddleY -= 20;
    }
    if (event.code === 'ArrowDown') {
      this.leftPaddleY += 20;
    }
    if (event.code === 'KeyW') {
      this.leftPaddleY -= 20;
    }
    if (event.code === 'KeyS') {
      this.leftPaddleY += 20;
    }
  }
}
