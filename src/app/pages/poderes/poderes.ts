import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService, FichaRPG } from '../../services/ficha.service';

interface Poder {
  nome: string;
  nivel: number | null;
  pa: number | null;
}

interface PoderesData {
  classe_pirata: string;
  habilidade_chave: string;
  tipo_cast: string;
  lista: Poder[];
  caracteristicas: string;
}

@Component({
  selector: 'app-poderes',
  templateUrl: './poderes.html',
  styleUrl: './poderes.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Poderes {
  poderes: FichaRPG['poderes'];

  constructor(private fichaService: FichaService) {
    this.poderes = this.fichaService.getFicha().poderes;
    this.fichaService.ficha$.subscribe(f => this.poderes = f.poderes);
  }

  adicionarLinhaPoder() {
    if (this.poderes.lista.length < 7) {
      this.poderes.lista.push({ nome: '', nivel: null, pa: null });
      this.atualizar();
    }
  }

  removerLinhaPoder(index: number) {
    if (this.poderes.lista.length > 1) {
      this.poderes.lista.splice(index, 1);
      this.atualizar();
    }
  }

  atualizar() {
    this.fichaService.atualizar('poderes', this.poderes);
  }

  salvarPoderes() {
    this.fichaService.salvarFichaComoJSON();
  }
}
