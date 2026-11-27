import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [],
  templateUrl: './tarjeta-producto.component.html',
  styleUrl: './tarjeta-producto.component.css'
})
export class TarjetaProductoComponent {

  @Input() nombre: string = '';
  @Input() categoria: string = '';
  @Input() precio: number = 0;
  @Input() stock: number = 0;
  @Input() icono: string = '';
  @Input() descripcion: string = '';
  @Input() id: number = 0;

  @Output() seleccionar = new EventEmitter<number>();

}