import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Exponencial: y = a * e^(bx)
 * Linearização: ln(y) = ln(a) + bx
 */
export declare class Exponencial implements IAjuste {
    valoresX: number[];
    valoresY: number[];
    r2: number;
    private a;
    private b;
    constructor(valoresX: number[], valoresY: number[]);
    ajustar(): void;
    calcular(x: number): number;
    calcularR2(): void;
    getResultados(): AjusteResultado;
    getTipo(): string;
}
//# sourceMappingURL=Exponencial.d.ts.map