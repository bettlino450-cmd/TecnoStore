import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  pedidos: any[] = [];
  filtroEstado = 'Todos';

  constructor(private tiendaService: TiendaService) {}

  async ngOnInit(): Promise<void> {
    this.pedidos = await this.tiendaService.obtenerPedidos();
  }

  get pedidosFiltrados(): any[] {
    if (this.filtroEstado === 'Todos') {
      return this.pedidos;
    }

    return this.pedidos.filter(
      pedido => pedido.estado === this.filtroEstado
    );
  }
}