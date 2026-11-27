import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';

interface Pedido {
  id: number;
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precio: number;
  total: number;
  fecha: string;
  estado: string;
}

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  icono: string;
  descripcion: string;
}

@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [],
  templateUrl: './detalle-pedido.component.html',
  styleUrl: './detalle-pedido.component.css'
})
export class DetallePedidoComponent implements OnInit {

  pedido: Pedido | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tiendaService: TiendaService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!Number.isFinite(id) || id <= 0) {
      this.pedido = undefined;
      return;
    }

    this.pedido = await this.tiendaService.obtenerPedidoPorId(id);
  }

  async cancelarPedido(): Promise<void> {

    if (!this.pedido || this.pedido.estado === 'Cancelado') {
      return;
    }

    try {
      const productos: Producto[] =
        await this.tiendaService.obtenerProductos();

      const producto = productos.find(
        p => p.id === this.pedido!.productoId
      );

      if (!producto) {
        return;
      }

      producto.stock += this.pedido.cantidad;

      await this.tiendaService.actualizarProducto(producto);

      this.pedido.estado = 'Cancelado';

      await this.tiendaService.actualizarPedido(this.pedido);

      this.router.navigate(['/historial']);

    } catch (error) {
      console.error('Error al cancelar el pedido:', error);
    }
  }

  volver(): void {
    this.router.navigate(['/historial']);
  }
}