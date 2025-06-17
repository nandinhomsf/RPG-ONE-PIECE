import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { FichaService } from './services/ficha.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class AppComponent {
  protected title = 'ficha-rpg';
  feedback: string = '';
  feedbackTipo: 'ok' | 'erro' = 'ok';

  constructor(private fichaService: FichaService) {}

  salvarFichaJSON() {
    this.fichaService.salvarFichaComoJSON();
    this.mostrarFeedback('Ficha salva!', 'ok');
  }

  carregarFichaJSON(event: Event, fileInput: HTMLInputElement) {
    const file = fileInput.files?.[0];
    if (!file) return;
    this.fichaService.carregarFichaDeJSON(file)
      .then(() => this.mostrarFeedback('Ficha carregada!', 'ok'))
      .catch(() => this.mostrarFeedback('Erro ao carregar JSON!', 'erro'));
    fileInput.value = '';
  }

  mostrarFeedback(msg: string, tipo: 'ok' | 'erro') {
    this.feedback = msg;
    this.feedbackTipo = tipo;
    setTimeout(() => { this.feedback = ''; }, 2000);
  }
}
