import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService, FichaRPG } from '../../services/ficha.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  styleUrl: './perfil.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Perfil {
  perfil: FichaRPG['perfil'];

  constructor(private fichaService: FichaService) {
    this.perfil = this.fichaService.getFicha().perfil;
    this.fichaService.ficha$.subscribe(f => this.perfil = f.perfil);
  }

  atualizar() {
    this.fichaService.atualizar('perfil', this.perfil);
  }

  salvarPerfil() {
    this.fichaService.salvarFichaComoJSON();
  }
}
