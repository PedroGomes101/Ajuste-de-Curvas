"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Potencial = void 0;
/**
 * Ajuste Potencial: y = a * x^b
 * Linearização dupla: ln(y) = ln(a) + b*ln(x)
 */
class Potencial {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.a = 0; // coeficienteA
        this.b = 0; // expoenteB
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        // Linearização dupla: ln(x) e ln(y)
        const lnX = [];
        const lnY = [];
        for (let i = 0; i < n; i++) {
            if (this.valoresX[i] <= 0) {
                throw new Error('Valores de X devem ser positivos para ajuste potencial');
            }
            if (this.valoresY[i] <= 0) {
                throw new Error('Valores de Y devem ser positivos para ajuste potencial');
            }
            lnX.push(Math.log(this.valoresX[i]));
            lnY.push(Math.log(this.valoresY[i]));
        }
        // Regressão linear em (lnX, lnY)
        let sumLnX = 0, sumLnY = 0, sumLnXLnY = 0, sumLnX2 = 0;
        for (let i = 0; i < n; i++) {
            sumLnX += lnX[i];
            sumLnY += lnY[i];
            sumLnXLnY += lnX[i] * lnY[i];
            sumLnX2 += lnX[i] * lnX[i];
        }
        // Calcular coeficientes
        this.b = (n * sumLnXLnY - sumLnX * sumLnY) / (n * sumLnX2 - sumLnX * sumLnX);
        const lnA = (sumLnY - this.b * sumLnX) / n;
        this.a = Math.exp(lnA);
        this.calcularR2();
    }
    calcular(x) {
        return this.a * Math.pow(x, this.b);
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
            formula: `y = ${this.a.toFixed(4)} * x^${this.b.toFixed(4)}`
        };
    }
    getTipo() {
        return 'potencial';
    }
}
exports.Potencial = Potencial;
//# sourceMappingURL=Potencial.js.map