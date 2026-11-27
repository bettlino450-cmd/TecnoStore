
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TarjetaProductoComponent } from './components/tarjeta-producto/tarjeta-producto.component';

interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
  icono: string;
  descripcion: string;
}

interface Pedido {
  id: number;
  productoId: number;
  productoNombre: string;
  cantidad: number;
  total: number;
  fecha: string;
  estado: string;
}

@Component({
  selector: 'app-root',
imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'TecnoStore';

  ngOnInit(): void {
  const pedidosGuardados = localStorage.getItem('pedidos');
  const productosGuardados = localStorage.getItem('productos');

  if (pedidosGuardados) {
    this.pedidos = JSON.parse(pedidosGuardados);
  }

  if (productosGuardados) {
    this.productos = JSON.parse(productosGuardados);
  }
}

  // Buscador y filtro
  busqueda = '';
  categoriaSeleccionada = 'Todos';

  // Productos de la tienda
  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Samsung Galaxy A55',
      categoria: 'Celulares',
      precio: 2500,
      stock: 10,
      icono: '📱',
      descripcion: 'Celular Samsung de excelente rendimiento'
    },
    {
      id: 2,
      nombre: 'iPhone 15',
      categoria: 'Celulares',
      precio: 5500,
      stock: 5,
      icono: '📱',
      descripcion: 'Smartphone Apple de última generación'
    },
    {
      id: 3,
      nombre: 'Laptop Lenovo IdeaPad',
      categoria: 'Computadoras',
      precio: 4800,
      stock: 8,
      icono: '💻',
      descripcion: 'Laptop ideal para estudiar y trabajar'
    },
    {
      id: 4,
      nombre: 'Laptop HP Pavilion',
      categoria: 'Computadoras',
      precio: 5200,
      stock: 4,
      icono: '💻',
      descripcion: 'Computadora portátil de alto rendimiento'
    },
    {
      id: 5,
      nombre: 'Teclado Logitech',
      categoria: 'Accesorios',
      precio: 250,
      stock: 15,
      icono: '⌨️',
      descripcion: 'Teclado para computadora'
    },
    {
      id: 6,
      nombre: 'Audífonos Bluetooth',
      categoria: 'Accesorios',
      precio: 180,
      stock: 20,
      icono: '🎧',
      descripcion: 'Audífonos inalámbricos'
    }
  ];

  // Historial de pedidos
  pedidos: Pedido[] = [];

  // Datos del formulario
  productoSeleccionadoId = 1;
  cantidad = 1;

  // Mensajes para el usuario
  mensaje = '';
  tipoMensaje = '';

  // Producto seleccionado
  get productoSeleccionado(): Producto | undefined {
    return this.productos.find(
      producto => producto.id === Number(this.productoSeleccionadoId)
    );
  }

  // Seleccionar producto desde la tarjeta
seleccionarProducto(id: number): void {
  this.productoSeleccionadoId = id;

  document.getElementById('pedidos')?.scrollIntoView({
    behavior: 'smooth'
  });
}
  // Productos filtrados
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

  // Registrar un pedido
  crearPedido(): void {

    const producto = this.productoSeleccionado;

    if (!producto) {
      this.mostrarMensaje('Selecciona un producto.', 'error');
      return;
    }

    if (!Number.isInteger(this.cantidad) || this.cantidad <= 0) {
      this.mostrarMensaje('La cantidad debe ser mayor que cero.', 'error');
      return;
    }

    if (this.cantidad > producto.stock) {
      this.mostrarMensaje(
        'No hay suficiente stock disponible.',
        'error'
      );
      return;
    }

    // Descontar el inventario
    producto.stock -= this.cantidad;

    // Crear el pedido
    const nuevoPedido: Pedido = {
      id: this.pedidos.length + 1,
      productoId: producto.id,
      productoNombre: producto.nombre,
      cantidad: this.cantidad,
      total: producto.precio * this.cantidad,
      fecha: new Date().toLocaleString('es-BO'),
      estado: 'Pendiente'
    };

    // Guardar en el historial
    this.pedidos.push(nuevoPedido);

    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    localStorage.setItem('productos', JSON.stringify(this.productos));

    this.mostrarMensaje(
      '¡Pedido registrado correctamente!',
      'exito'
    );

    this.cantidad = 1;
  }

  // Cancelar pedido y devolver productos al stock
  cancelarPedido(id: number): void {

    const pedido = this.pedidos.find(p => p.id === id);

    if (!pedido) {
      return;
    }

    if (pedido.estado === 'Cancelado') {
      this.mostrarMensaje(
        'Este pedido ya fue cancelado.',
        'error'
      );
      return;
    }

    const producto = this.productos.find(
      p => p.id === pedido.productoId
    );

    if (producto) {
      producto.stock += pedido.cantidad;
    }

    pedido.estado = 'Cancelado';

    localStorage.setItem('pedidos', JSON.stringify(this.pedidos));
    localStorage.setItem('productos', JSON.stringify(this.productos));
    this.mostrarMensaje(
      'Pedido cancelado. El stock fue devuelto.',
      'exito'
    );
  }

  // Mostrar mensajes
  mostrarMensaje(texto: string, tipo: string): void {
    this.mensaje = texto;
    this.tipoMensaje = tipo;
  }

}
