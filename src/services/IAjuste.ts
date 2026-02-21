import { AjusteResultado } from '../types';

export interface IAjuste {
  valoresX: number[];
  valoresY: number[];
  r2: number;
  
  ajustar(): void;
  calcular(x: number): number;
  getResultados(): AjusteResultado;
  getTipo(): string;
  calcularR2(): void;
}
