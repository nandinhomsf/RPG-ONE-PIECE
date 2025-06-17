import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService, FichaRPG } from '../../services/ficha.service';

interface Arma {
  nome: string;
  bonus: string;
  dano: string;
}

@Component({
  selector: 'app-status',
  templateUrl: './status.html',
  styleUrl: './status.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Status {
  ficha: FichaRPG['status'];

  constructor(private fichaService: FichaService) {
    this.ficha = this.fichaService.getFicha().status;
    this.fichaService.ficha$.subscribe(f => this.ficha = f.status);
  }

  adicionarLinhaArma() {
    if (this.ficha.armas.length < 10) {
      this.ficha.armas.push({ nome: '', bonus: '', dano: '' });
      this.atualizar();
    }
  }

  removerLinhaArma(index: number) {
    if (this.ficha.armas.length > 1) {
      this.ficha.armas.splice(index, 1);
      this.atualizar();
    }
  }

  atualizar() {
    this.fichaService.atualizar('status', this.ficha);
  }

  salvarFicha() {
    this.fichaService.salvarFichaComoJSON();
  }
}
