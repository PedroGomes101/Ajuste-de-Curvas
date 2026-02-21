import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Logarítmico: y = a + b*ln(x)
 * Linearização: x' = ln(x), então y = a + b*x'
 */
export declare class Logaritmico implements IAjuste {
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
//# sourceMappingURL=Logaritmico.d.ts.map