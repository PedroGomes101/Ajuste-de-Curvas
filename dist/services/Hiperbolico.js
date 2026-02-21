"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Hiperbolico = void 0;
/**
 * Ajuste Hiperbólico: y = b + a/x
 * Linearização: x' = 1/x, então y = b + a*x'
 */
class Hiperbolico {
    constructor(valoresX, valoresY) {
        this.r2 = 0;
        this.a = 0; // inclinação
        this.b = 0; // intercepto
        this.valoresX = valoresX;
        this.valoresY = valoresY;
    }
    ajustar() {
        const n = this.valoresX.length;
        // Linearização: x' = 1/x
        const xInv = [];
        for (let i = 0; i < n; i++) {
            if (this.valoresX[i] === 0) {
                throw new Error('Valores de X não podem ser zero para ajuste hiperbólico');
            }
            xInv.push(1 / this.valoresX[i]);
        }
        // Regressão linear em (xInv, Y)
        let sumXInv = 0, sumY = 0, sumXInvY = 0, sumXInv2 = 0;
        for (let i = 0; i < n; i++) {
            sumXInv += xInv[i];
            sumY += this.valoresY[i];
            sumXInvY += xInv[i] * this.valoresY[i];
            sumXInv2 += xInv[i] * xInv[i];
        }
        // Calcular coeficientes
        this.a = (n * sumXInvY - sumXInv * sumY) / (n * sumXInv2 - sumXInv * sumXInv);
        this.b = (sumY - this.a * sumXInv) / n;
        this.calcularR2();
    }
    calcular(x) {
        return this.b + this.a / x;
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
            formula: `y = ${this.b.toFixed(4)} + ${this.a.toFixed(4)}/x`
        };
    }
    getTipo() {
        return 'hiperbolico';
    }
}
exports.Hiperbolico = Hiperbolico;
//# sourceMappingURL=Hiperbolico.js.map