import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Hiperbólico: y = b + a/x
 * Linearização: x' = 1/x, então y = b + a*x'
 */
export declare class Hiperbolico implements IAjuste {
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
//# sourceMappingURL=Hiperbolico.d.ts.map