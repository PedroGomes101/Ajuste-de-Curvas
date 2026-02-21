import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Linear: y = a + bx
 * Implementa regressão linear por mínimos quadrados.
 */
export declare class Linear implements IAjuste {
    valoresX: number[];
    valoresY: number[];
    r2: number;
    private intercepto;
    private inclinacao;
    constructor(valoresX: number[], valoresY: number[]);
    ajustar(): void;
    calcular(x: number): number;
    calcularR2(): void;
    getResultados(): AjusteResultado;
    getTipo(): string;
}
//# sourceMappingURL=Linear.d.ts.map