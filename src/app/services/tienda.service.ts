import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TiendaService {

  private nombreBD = 'TecnoStoreDB';
  private versionBD = 1;
  private conexion: IDBDatabase | null = null;

  constructor() { }

  conectar(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {

      const solicitud = indexedDB.open(
        this.nombreBD,
        this.versionBD
      );

      solicitud.onsuccess = () => {
        this.conexion = solicitud.result;
        resolve(this.conexion);
      };

      solicitud.onerror = () => {
        reject('Error al conectar con IndexedDB');
      };

      solicitud.onupgradeneeded = () => {
        const bd = solicitud.result;

        if (!bd.objectStoreNames.contains('productos')) {
          bd.createObjectStore('productos', {
            keyPath: 'id'
          });
        }

        if (!bd.objectStoreNames.contains('pedidos')) {
          bd.createObjectStore('pedidos', {
            keyPath: 'id',
            autoIncrement: true
          });
        }
      };

    });
  }


    async guardarProducto(producto: any): Promise<void> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction('productos', 'readwrite');
      const almacen = transaccion.objectStore('productos');

      almacen.put(producto);

      transaccion.oncomplete = () => resolve();
      transaccion.onerror = () => reject('Error al guardar el producto');
    });
  }

    async obtenerProductos(): Promise<any[]> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction('productos', 'readonly');
      const almacen = transaccion.objectStore('productos');

      const solicitud = almacen.getAll();

      solicitud.onsuccess = () => resolve(solicitud.result);
      solicitud.onerror = () => reject('Error al obtener los productos');
    });
  }

    async guardarPedido(pedido: any): Promise<void> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction('pedidos', 'readwrite');
      const almacen = transaccion.objectStore('pedidos');

      almacen.add(pedido);

      transaccion.oncomplete = () => resolve();
      transaccion.onerror = () => reject('Error al guardar el pedido');
    });
  }

async obtenerPedidos(): Promise<any[]> {
  const bd = await this.conectar();

  return new Promise((resolve, reject) => {
    const transaccion = bd.transaction('pedidos', 'readonly');
    const almacen = transaccion.objectStore('pedidos');

    const solicitud = almacen.getAll();

    solicitud.onsuccess = () => resolve(solicitud.result);
    solicitud.onerror = () => reject('Error al obtener los pedidos');
  });
}

async obtenerPedidoPorId(id: number): Promise<any | undefined> {
  const pedidos = await this.obtenerPedidos();

  return pedidos.find(pedido => pedido.id === id);
}
  async registrarPedido(pedido: any, producto: any): Promise<void> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction(
        ['productos', 'pedidos'],
        'readwrite'
      );

      const almacenProductos = transaccion.objectStore('productos');
      const almacenPedidos = transaccion.objectStore('pedidos');

      almacenProductos.put(producto);
      almacenPedidos.add(pedido);

      transaccion.oncomplete = () => resolve();

      transaccion.onerror = () => {
        reject('Error al registrar el pedido');
      };

      transaccion.onabort = () => {
        reject('No se pudo completar el registro');
      };
    });
  }


    async actualizarProducto(producto: any): Promise<void> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction('productos', 'readwrite');
      const almacen = transaccion.objectStore('productos');

      almacen.put(producto);

      transaccion.oncomplete = () => resolve();
      transaccion.onerror = () => reject('Error al actualizar el producto');
    });
  }

    async actualizarPedido(pedido: any): Promise<void> {
    const bd = await this.conectar();

    return new Promise((resolve, reject) => {
      const transaccion = bd.transaction('pedidos', 'readwrite');
      const almacen = transaccion.objectStore('pedidos');

      almacen.put(pedido);

      transaccion.oncomplete = () => resolve();
      transaccion.onerror = () => reject('Error al actualizar el pedido');
    });
  }

    async inicializarProductos(): Promise<void> {

  const productosIniciales = [
    { id: 1, nombre: 'Samsung Galaxy A55', categoria: 'Celulares', precio: 2500, stock: 10, icono: '📱', descripcion: 'Celular Samsung de excelente rendimiento' },
    { id: 2, nombre: 'iPhone 15', categoria: 'Celulares', precio: 5500, stock: 5, icono: '📱', descripcion: 'Smartphone Apple de última generación' },
    { id: 3, nombre: 'Laptop Lenovo IdeaPad', categoria: 'Computadoras', precio: 4800, stock: 8, icono: '💻', descripcion: 'Laptop ideal para estudiar y trabajar' },
    { id: 4, nombre: 'Laptop HP Pavilion', categoria: 'Computadoras', precio: 5200, stock: 4, icono: '💻', descripcion: 'Computadora portátil de alto rendimiento' },
    { id: 5, nombre: 'Teclado Logitech', categoria: 'Accesorios', precio: 250, stock: 15, icono: '⌨️', descripcion: 'Teclado para computadora' },
    { id: 6, nombre: 'Audífonos Bluetooth', categoria: 'Accesorios', precio: 180, stock: 20, icono: '🎧', descripcion: 'Audífonos inalámbricos' },

    { id: 7, nombre: 'Samsung Galaxy S24', categoria: 'Celulares', precio: 6800, stock: 7, icono: '📱', descripcion: 'Smartphone Samsung de alta gama' },
    { id: 8, nombre: 'Xiaomi Redmi Note 13', categoria: 'Celulares', precio: 1800, stock: 12, icono: '📱', descripcion: 'Celular Xiaomi de buen rendimiento' },
    { id: 9, nombre: 'Laptop ASUS VivoBook', categoria: 'Computadoras', precio: 5600, stock: 6, icono: '💻', descripcion: 'Laptop ASUS para estudio y trabajo' },
    { id: 10, nombre: 'Monitor LG 24 pulgadas', categoria: 'Accesorios', precio: 1400, stock: 8, icono: '🖥️', descripcion: 'Monitor LG para computadora' },
    { id: 11, nombre: 'Mouse Logitech inalámbrico', categoria: 'Accesorios', precio: 150, stock: 20, icono: '🖱️', descripcion: 'Mouse inalámbrico Logitech' },
    { id: 12, nombre: 'Impresora Epson EcoTank', categoria: 'Accesorios', precio: 1900, stock: 5, icono: '🖨️', descripcion: 'Impresora Epson con sistema de tinta continua' }
  ];

  const productosActuales = await this.obtenerProductos();

  for (const producto of productosIniciales) {
    const existe = productosActuales.some(p => p.id === producto.id);

    if (!existe) {
      await this.guardarProducto(producto);
    }
  }
}
}