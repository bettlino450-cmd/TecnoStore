import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TarjetaProductoComponent } from '../../components/tarjeta-producto/tarjeta-producto.component';
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
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, TarjetaProductoComponent, NgClass],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
busqueda = '';
categoriaSeleccionada = 'Todos';

constructor(
  private tiendaService: TiendaService,
  private router: Router
) {}

  async ngOnInit(): Promise<void> {
    await this.tiendaService.inicializarProductos();
    this.productos = await this.tiendaService.obtenerProductos();
  }

  productos: Producto[] = [];

  get productosFiltrados(): Producto[] {
    return this.productos.filter(producto => {

      const coincideNombre = producto.nombre
        .toLowerCase()
        .includes(this.busqueda.toLowerCase());

      const coincideCategoria =
        this.categoriaSeleccionada === 'Todos' ||
        producto.categoria === this.categoriaSeleccionada;

      return coincideNombre && coincideCategoria;
    });
  }
  seleccionarProducto(id: number): void {
  this.router.navigate(['/registrar-pedido'], {
    queryParams: { productoId: id }
  });
}
}