"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exponencial = void 0;
/**
 * Ajuste Exponencial: y = a * e^(bx)
 * Linearização: ln(y) = ln(a) + bx
 */
class Exponencial {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.a = 0;
        this.b = 0;
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        // Linearização: aplicar ln em Y
        const lnY = [];
        for (let i = 0; i < n; i++) {
            if (this.valoresY[i] <= 0) {
                throw new Error('Valores de Y devem ser positivos para ajuste exponencial');
            }
            lnY.push(Math.log(this.valoresY[i]));
        }
        // Regressão linear em (X, lnY)
        let sumX = 0, sumLnY = 0, sumXLnY = 0, sumX2 = 0;
        for (let i = 0; i < n; i++) {
            sumX += this.valoresX[i];
            sumLnY += lnY[i];
            sumXLnY += this.valoresX[i] * lnY[i];
            sumX2 += this.valoresX[i] * this.valoresX[i];
        }
        // Calcular coeficientes da regressão linear
        this.b = (n * sumXLnY - sumX * sumLnY) / (n * sumX2 - sumX * sumX);
        const lnA = (sumLnY - this.b * sumX) / n;
        this.a = Math.exp(lnA);
        this.calcularR2();
    }
    calcular(x) {
        return this.a * Math.exp(this.b * x);
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
                a: this.a,
                b: this.b
            },
            r2: this.r2,
            formula: `y = ${this.a.toFixed(4)} * e^(${this.b.toFixed(4)}x)`
        };
    }
    getTipo() {
        return 'exponencial';
    }
}
exports.Exponencial = Exponencial;
//# sourceMappingURL=Exponencial.js.map