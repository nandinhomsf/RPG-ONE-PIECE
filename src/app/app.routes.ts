import { Routes } from '@angular/router';
import { Status } from './pages/status/status';
import { Perfil } from './pages/perfil/perfil';
import { Inventario } from './pages/inventario/inventario';
import { Poderes } from './pages/poderes/poderes';
import { Pericias } from './pages/pericias/pericias';

export const routes: Routes = [
  { path: '', redirectTo: 'status', pathMatch: 'full' },
  { path: 'status', component: Status },
  { path: 'perfil', component: Perfil },
  { path: 'inventario', component: Inventario },
  { path: 'poderes', component: Poderes },
  { path: 'pericias', component: Pericias },
  { path: '**', redirectTo: 'status' }
];
