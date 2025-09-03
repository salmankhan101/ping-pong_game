import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GameComponent } from './pages/game/game.component';
import { InstructionsComponent } from './pages/instructions/instructions.component';
import { HighscoresComponent } from './pages/highscores/highscores.component';
import { OnlineComponent } from './pages/online/online.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'game', component: GameComponent },          // /game?mode=ai|online
  { path: 'instructions', component: InstructionsComponent },
  { path: 'highscores', component: HighscoresComponent },
  { path: 'online', component: OnlineComponent },      // multiplayer lobby (optional)
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
