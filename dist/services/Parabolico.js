"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parabolico = void 0;
const gaussElimination_1 = require("../utils/gaussElimination");
/**
 * Ajuste Parabólico: y = a0 + a1*x + a2*x²
 * Usa eliminação de Gauss para resolver sistema 3x3.
 */
class Parabolico {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.a0 = 0;
        this.a1 = 0;
        this.a2 = 0;
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        let sumX = 0, sumX2 = 0, sumX3 = 0, sumX4 = 0;
        let sumY = 0, sumXY = 0, sumX2Y = 0;
        for (let i = 0; i < n; i++) {
            const x = this.valoresX[i];
            const y = this.valoresY[i];
            const x2 = x * x;
            const x3 = x2 * x;
            const x4 = x3 * x;
            sumX += x;
            sumX2 += x2;
            sumX3 += x3;
            sumX4 += x4;
            sumY += y;
            sumXY += x * y;
            sumX2Y += x2 * y;
        }
        // Montar sistema linear 3x3
        const matriz = [
            [n, sumX, sumX2],
            [sumX, sumX2, sumX3],
            [sumX2, sumX3, sumX4]
        ];
        const termos = [sumY, sumXY, sumX2Y];
        // Resolver usando eliminação de Gauss
        const coeficientes = (0, gaussElimination_1.resolverSistemaLinear)(matriz, termos);
        this.a0 = coeficientes[0];
        this.a1 = coeficientes[1];
        this.a2 = coeficientes[2];
        this.calcularR2();
    }
    calcular(x) {
        return this.a0 + this.a1 * x + this.a2 * x * x;
    }
    calcularR2() {
        const n = this.valoresY.length;
        let somaY = 0;
        for (let i = 0; i < n; i++) {
            somaY += this.valoresY[i];
        }
        const yMedia = somaY / n;
        let ssTot = 0;
        let ssRes = 0;
        for (let i = 0; i < n; i++) {
            const yPredito = this.calcular(this.valoresX[i]);
            ssTot += Math.pow(this.valoresY[i] - yMedia, 2);
            ssRes += Math.pow(this.valoresY[i] - yPredito, 2);
        }
        this.r2 = 1 - (ssRes / ssTot);
    }
    getResultados() {
        return {
            tipo: this.getTipo(),
            coeficientes: {
                a0: this.a0,
                a1: this.a1,
                a2: this.a2
            },
            r2: this.r2,
            formula: `y = ${this.a0.toFixed(4)} + ${this.a1.toFixed(4)}x + ${this.a2.toFixed(4)}x²`
        };
    }
    getTipo() {
        return 'parabolico';
    }
}
exports.Parabolico = Parabolico;
//# sourceMappingURL=Parabolico.js.map