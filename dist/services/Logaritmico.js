"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logaritmico = void 0;
/**
 * Ajuste Logarítmico: y = a + b*ln(x)
 * Linearização: x' = ln(x), então y = a + b*x'
 */
class Logaritmico {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.a = 0;
        this.b = 0;
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        // Linearização: x' = ln(x)
        const lnX = [];
        for (let i = 0; i < n; i++) {
            if (this.valoresX[i] <= 0) {
                throw new Error('Valores de X devem ser positivos para ajuste logarítmico');
            }
            lnX.push(Math.log(this.valoresX[i]));
        }
        // Regressão linear em (lnX, Y)
        let sumLnX = 0, sumY = 0, sumLnXY = 0, sumLnX2 = 0;
        for (let i = 0; i < n; i++) {
            sumLnX += lnX[i];
            sumY += this.valoresY[i];
            sumLnXY += lnX[i] * this.valoresY[i];
            sumLnX2 += lnX[i] * lnX[i];
        }
        // Calcular coeficientes
        this.a = (sumLnX2 * sumY - sumLnX * sumLnXY) / (n * sumLnX2 - sumLnX * sumLnX);
        this.b = (n * sumLnXY - sumLnX * sumY) / (n * sumLnX2 - sumLnX * sumLnX);
        this.calcularR2();
    }
    calcular(x) {
        return this.a + this.b * Math.log(x);
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
            formula: `y = ${this.a.toFixed(4)} + ${this.b.toFixed(4)}*ln(x)`
        };
    }
    getTipo() {
        return 'logaritmico';
    }
}
exports.Logaritmico = Logaritmico;
//# sourceMappingURL=Logaritmico.js.map