import { IAjuste } from './IAjuste';
import { AjusteResultado } from '../types';
/**
 * Ajuste Potencial: y = a * x^b
 * Linearização dupla: ln(y) = ln(a) + b*ln(x)
 */
export declare class Potencial implements IAjuste {
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
//# sourceMappingURL=Potencial.d.ts.map