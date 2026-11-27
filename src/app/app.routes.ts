import { Routes } from '@angular/router';

import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { RegistrarPedidoComponent } from './pages/registrar-pedido/registrar-pedido.component';
import { HistorialComponent } from './pages/historial/historial.component';
import { DetallePedidoComponent } from './pages/detalle-pedido/detalle-pedido.component';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'catalogo',
    pathMatch: 'full'
  },

  {
    path: 'catalogo',
    component: CatalogoComponent
  },

  {
    path: 'registrar-pedido',
    component: RegistrarPedidoComponent
  },

  {
    path: 'historial',
    component: HistorialComponent
  },

  {
    path: 'pedidos/:id',
    component: DetallePedidoComponent
  },

  {
    path: '**',
    redirectTo: 'catalogo'
  }

];