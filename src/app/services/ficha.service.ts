import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Arma { nome: string; bonus: string; dano: string; }
export interface Poder { nome: string; nivel: number | null; pa: number | null; }

export interface FichaRPG {
  status: {
    fisico: number;
    velocidade: number;
    resistencia: number;
    vontade: number;
    espirito: number;
    engenhosidade: number;
    defesa: number;
    iniciativa: number;
    deslocamento: string;
    pv_max: number;
    pv_atuais: number;
    pv_temp: number;
    resistencia_perc: number;
    evasao: string;
    pa: number;
    armas: Arma[];
    anotacoes: string;
  };
  perfil: {
    classe: string;
    ocupacao: string;
    raca: string;
    idade: string;
    altura: string;
    peso: string;
    olhos: string;
    pele: string;
    cabelo: string;
    historia: string;
    aliados: string;
  };
  inventario: {
    armas: string;
    equipamentos: string;
    itens: string;
    tesouro: string;
  };
  poderes: {
    classe_pirata: string;
    habilidade_chave: string;
    tipo_cast: string;
    lista: Poder[];
    caracteristicas: string;
  };
  pericias: {
    atletismo: boolean;
    acrobacia: boolean;
    furtividade: boolean;
    atuacao: boolean;
    intimidacao: boolean;
    intuicao: boolean;
    percepcao: boolean;
    persuasao: boolean;
    enganacao: boolean;
    historia: boolean;
    investigacao: boolean;
    provocacao: boolean;
    sobrevivencia: boolean;
    personalizada1: boolean;
    personalizada2: boolean;
    personalizada3: boolean;
  };
}

const FICHA_KEY = 'fichaRPG';

@Injectable({ providedIn: 'root' })
export class FichaService {
  private fichaSubject = new BehaviorSubject<FichaRPG>(this.carregarFichaLocal() || this.fichaVazia());
  ficha$ = this.fichaSubject.asObservable();

  fichaVazia(): FichaRPG {
    return {
      status: {
        fisico: 0, velocidade: 0, resistencia: 0, vontade: 0, espirito: 0, engenhosidade: 0,
        defesa: 0, iniciativa: 0, deslocamento: '', pv_max: 0, pv_atuais: 0, pv_temp: 0,
        resistencia_perc: 0, evasao: '', pa: 0, armas: [{ nome: '', bonus: '', dano: '' }], anotacoes: ''
      },
      perfil: {
        classe: '', ocupacao: '', raca: '', idade: '', altura: '', peso: '', olhos: '', pele: '', cabelo: '', historia: '', aliados: ''
      },
      inventario: {
        armas: '', equipamentos: '', itens: '', tesouro: ''
      },
      poderes: {
        classe_pirata: '', habilidade_chave: '', tipo_cast: '', lista: [{ nome: '', nivel: null, pa: null }], caracteristicas: ''
      },
      pericias: {
        atletismo: false, acrobacia: false, furtividade: false, atuacao: false, intimidacao: false, intuicao: false, percepcao: false, persuasao: false,
        enganacao: false, historia: false, investigacao: false, provocacao: false, sobrevivencia: false, personalizada1: false, personalizada2: false, personalizada3: false
      }
    };
  }

  atualizar(parte: keyof FichaRPG, valor: any) {
    const ficha = { ...this.fichaSubject.value, [parte]: valor };
    this.fichaSubject.next(ficha);
    localStorage.setItem(FICHA_KEY, JSON.stringify(ficha));
  }

  getFicha(): FichaRPG {
    return this.fichaSubject.value;
  }

  salvarFichaComoJSON() {
    const data = JSON.stringify(this.getFicha(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'fichaRPG.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  carregarFichaDeJSON(file: File) {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const data = JSON.parse(e.target.result);
          this.fichaSubject.next(data);
          localStorage.setItem(FICHA_KEY, JSON.stringify(data));
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      reader.readAsText(file);
    });
  }

  private carregarFichaLocal(): FichaRPG | null {
    const data = localStorage.getItem(FICHA_KEY);
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  }
}
