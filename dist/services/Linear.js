"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linear = void 0;
/**
 * Ajuste Linear: y = a + bx
 * Implementa regressão linear por mínimos quadrados.
 */
class Linear {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.intercepto = 0; // a
        this.inclinacao = 0; // b
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        let sumX = 0;
        let sumY = 0;
        let sumXY = 0;
        let sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += this.valoresX[i];
            sumY += this.valoresY[i];
            sumXY += this.valoresX[i] * this.valoresY[i];
            sumX2 += this.valoresX[i] * this.valoresX[i];
        }
        // Calcular coeficientes
        this.inclinacao = (sumXY - (sumX * sumY) / n) / (sumX2 - (sumX * sumX) / n);
        this.intercepto = (sumY / n) - this.inclinacao * (sumX / n);
        this.calcularR2();
    }
    calcular(x) {
        return this.intercepto + this.inclinacao * x;
    }
    calcularR2() {
        const n = this.valoresY.length;
        // Média de Y
        let somaY = 0;
        for (let i = 0; i < n; i++) {
            somaY += this.valoresY[i];
        }
        const yMedia = somaY / n;
        // Soma dos quadrados total e residual
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
                a: this.intercepto,
                b: this.inclinacao
            },
            r2: this.r2,
            formula: `y = ${this.intercepto.toFixed(4)} + ${this.inclinacao.toFixed(4)}x`
        };
    }
    getTipo() {
        return 'linear';
    }
}
exports.Linear = Linear;
//# sourceMappingURL=Linear.js.map