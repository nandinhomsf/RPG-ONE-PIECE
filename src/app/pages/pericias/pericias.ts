import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService, FichaRPG } from '../../services/ficha.service';

@Component({
  selector: 'app-pericias',
  templateUrl: './pericias.html',
  styleUrl: './pericias.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Pericias {
  pericias: FichaRPG['pericias'];

  constructor(private fichaService: FichaService) {
    this.pericias = this.fichaService.getFicha().pericias;
    this.fichaService.ficha$.subscribe(f => this.pericias = f.pericias);
  }

  atualizar() {
    this.fichaService.atualizar('pericias', this.pericias);
  }

  salvarPericias() {
    this.fichaService.salvarFichaComoJSON();
  }
}
