import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FichaService, FichaRPG } from '../../services/ficha.service';

@Component({
  selector: 'app-inventario',
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Inventario {
  inventario: FichaRPG['inventario'];

  constructor(private fichaService: FichaService) {
    this.inventario = this.fichaService.getFicha().inventario;
    this.fichaService.ficha$.subscribe(f => this.inventario = f.inventario);
  }

  atualizar() {
    this.fichaService.atualizar('inventario', this.inventario);
  }

  salvarInventario() {
    this.fichaService.salvarFichaComoJSON();
  }
}
