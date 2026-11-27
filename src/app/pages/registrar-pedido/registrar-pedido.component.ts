
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { TiendaService } from '../../services/tienda.service';

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
  selector: 'app-registrar-pedido',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registrar-pedido.component.html',
  styleUrl: './registrar-pedido.component.css'
})
export class RegistrarPedidoComponent implements OnInit {

  productoId: number | null = null;
  productos: Producto[] = [];
  cantidad: number = 1;
  mensaje: string = '';

  constructor(
    private route: ActivatedRoute,
    private tiendaService: TiendaService
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(params => {
      this.productoId = Number(params['productoId']) || null;
    });

    await this.tiendaService.inicializarProductos();
    this.productos = await this.tiendaService.obtenerProductos();
  }

  
  async registrarPedido(): Promise<void> {

    this.mensaje = '';

    if (this.productoId === null) {
      this.mensaje = 'Selecciona un producto.';
      return;
    }

    if (this.cantidad <= 0 || !Number.isInteger(this.cantidad)) {
      this.mensaje = 'Ingresa una cantidad válida.';
      return;
    }

    const producto = this.productos.find(
      p => p.id === this.productoId
    );

    if (!producto) {
      this.mensaje = 'Producto no encontrado.';
      return;
    }

    if (this.cantidad > producto.stock) {
      this.mensaje = 'No hay suficiente stock disponible.';
      return;
    }

    const pedido = {
      id: Date.now(),
      productoId: producto.id,
      nombreProducto: producto.nombre,
      cantidad: this.cantidad,
      precio: producto.precio,
      total: producto.precio * this.cantidad,
      fecha: new Date().toISOString(),
      estado: 'Registrado'
    };

    const productoActualizado = {
      ...producto,
      stock: producto.stock - this.cantidad
    };

    try {
      await this.tiendaService.registrarPedido(
        pedido,
        productoActualizado
      );

      this.mensaje = '¡Pedido registrado correctamente!';

      this.productos = await this.tiendaService.obtenerProductos();
      this.cantidad = 1;

    } catch (error) {
      this.mensaje = 'Error al guardar el pedido. Intenta nuevamente.';
    }
  }


}
