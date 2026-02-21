import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Parabólico: y = a0 + a1*x + a2*x²
 * Usa eliminação de Gauss para resolver sistema 3x3.
 */
export declare class Parabolico implements IAjuste {
    valoresX: number[];
    valoresY: number[];
    r2: number;
    private a0;
    private a1;
    private a2;
    constructor(valoresX: number[], valoresY: number[]);
    ajustar(): void;
    calcular(x: number): number;
    calcularR2(): void;
    getResultados(): AjusteResultado;
    getTipo(): string;
}
//# sourceMappingURL=Parabolico.d.ts.map