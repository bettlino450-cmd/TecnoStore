import { Component, OnInit } from '@angular/core';
import { TiendaService } from '../../services/tienda.service';
import { RouterLink } from '@angular/router';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [RouterLink, DatePipe, CurrencyPipe],
  templateUrl: './historial.component.html',
  styleUrl: './historial.component.css'
})
export class HistorialComponent implements OnInit {

  pedidos: any[] = [];

  constructor(private tiendaService: TiendaService) {}

  async ngOnInit(): Promise<void> {
    this.pedidos = await this.tiendaService.obtenerPedidos();
  }
}