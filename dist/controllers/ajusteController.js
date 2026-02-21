"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calcularAjuste = calcularAjuste;
exports.calcularTodos = calcularTodos;
exports.listarTipos = listarTipos;
exports.gerarPontosCurva = gerarPontosCurva;
const Linear_1 = require("../services/Linear");
const Parabolico_1 = require("../services/Parabolico");
const Exponencial_1 = require("../services/Exponencial");
const Hiperbolico_1 = require("../services/Hiperbolico");
const Logaritmico_1 = require("../services/Logaritmico");
const Potencial_1 = require("../services/Potencial");
const types_1 = require("../types");
/**
 * Cria instância do ajuste baseado no tipo
 */
function criarAjuste(tipo, valoresX, valoresY) {
    switch (tipo) {
        case 'linear':
            return new Linear_1.Linear(valoresX, valoresY);
        case 'parabolico':
            return new Parabolico_1.Parabolico(valoresX, valoresY);
        case 'exponencial':
            return new Exponencial_1.Exponencial(valoresX, valoresY);
        case 'hiperbolico':
            return new Hiperbolico_1.Hiperbolico(valoresX, valoresY);
        case 'logaritmico':
            return new Logaritmico_1.Logaritmico(valoresX, valoresY);
        case 'potencial':
            return new Potencial_1.Potencial(valoresX, valoresY);
        default:
            throw new Error(`Tipo de ajuste não suportado: ${tipo}`);
    }
}
/**
 * POST /api/ajuste
 * Calcula ajuste para tipo especificado
 */
function calcularAjuste(req, res) {
    try {
        const { valoresX, valoresY, tipo } = req.body;
        // Validação
        if (!valoresX || !valoresY || !tipo) {
            res.status(400).json({
                sucesso: false,
                erro: 'Parâmetros obrigatórios: valoresX, valoresY, tipo'
            });
            return;
        }
        if (!Array.isArray(valoresX) || !Array.isArray(valoresY)) {
            res.status(400).json({
                sucesso: false,
                erro: 'valoresX e valoresY devem ser arrays'
            });
            return;
        }
        if (valoresX.length !== valoresY.length) {
            res.status(400).json({
                sucesso: false,
                erro: 'valoresX e valoresY devem ter o mesmo tamanho'
            });
            return;
        }
        if (valoresX.length < 2) {
            res.status(400).json({
                sucesso: false,
                erro: 'São necessários pelo menos 2 pontos'
            });
            return;
        }
        const ajuste = criarAjuste(tipo, valoresX, valoresY);
        ajuste.ajustar();
        res.json({
            sucesso: true,
            dados: ajuste.getResultados()
        });
    }
    catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error instanceof Error ? error.message : 'Erro interno'
        });
    }
}
/**
 * POST /api/ajuste/todos
 * Calcula todos os 6 ajustes para comparação
 */
function calcularTodos(req, res) {
    try {
        const { valoresX, valoresY } = req.body;
        // Validação
        if (!valoresX || !valoresY) {
            res.status(400).json({
                sucesso: false,
                erro: 'Parâmetros obrigatórios: valoresX, valoresY'
            });
            return;
        }
        if (!Array.isArray(valoresX) || !Array.isArray(valoresY)) {
            res.status(400).json({
                sucesso: false,
                erro: 'valoresX e valoresY devem ser arrays'
            });
            return;
        }
        if (valoresX.length !== valoresY.length) {
            res.status(400).json({
                sucesso: false,
                erro: 'valoresX e valoresY devem ter o mesmo tamanho'
            });
            return;
        }
        const ajustes = [];
        for (const tipo of types_1.TIPOS_AJUSTE) {
            try {
                const ajuste = criarAjuste(tipo, valoresX, valoresY);
                ajuste.ajustar();
                ajustes.push(ajuste.getResultados());
            }
            catch (e) {
                // Se um ajuste falhar (ex: valores negativos para exponencial), 
                // continua com os outros
                console.warn(`Ajuste ${tipo} falhou: ${e}`);
            }
        }
        // Ordenar por R² decrescente
        ajustes.sort((a, b) => b.r2 - a.r2);
        res.json({
            sucesso: true,
            ajustes,
            melhorAjuste: ajustes.length > 0 ? ajustes[0].tipo : null
        });
    }
    catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error instanceof Error ? error.message : 'Erro interno'
        });
    }
}
/**
 * GET /api/tipos
 * Lista tipos de ajuste disponíveis
 */
function listarTipos(req, res) {
    const tipos = [
        { value: 'linear', label: 'Linear' },
        { value: 'parabolico', label: 'Parabólico' },
        { value: 'exponencial', label: 'Exponencial' },
        { value: 'hiperbolico', label: 'Hiperbólico' },
        { value: 'logaritmico', label: 'Logarítmico' },
        { value: 'potencial', label: 'Potencial' },
        { value: 'todos', label: 'Comparar Todos' }
    ];
    res.json({ tipos });
}
/**
 * POST /api/pontos-curva
 * Gera pontos da curva ajustada para plotagem
 */
function gerarPontosCurva(req, res) {
    try {
        const { valoresX, valoresY, tipo, numPontos = 100 } = req.body;
        // Validação
        if (!valoresX || !valoresY || !tipo) {
            res.status(400).json({
                sucesso: false,
                erro: 'Parâmetros obrigatórios: valoresX, valoresY, tipo'
            });
            return;
        }
        const xMin = Math.min(...valoresX);
        const xMax = Math.max(...valoresX);
        const passo = (xMax - xMin) / (numPontos - 1);
        if (tipo === 'todos') {
            // Gerar curvas para todos os ajustes
            const curvas = [];
            for (const t of types_1.TIPOS_AJUSTE) {
                try {
                    const ajuste = criarAjuste(t, valoresX, valoresY);
                    ajuste.ajustar();
                    const pontosX = [];
                    const pontosY = [];
                    for (let i = 0; i < numPontos; i++) {
                        const x = xMin + i * passo;
                        // Evitar x <= 0 para ajustes que requerem valores positivos
                        if ((t === 'hiperbolico' || t === 'logaritmico' || t === 'potencial') && x <= 0) {
                            continue;
                        }
                        pontosX.push(x);
                        pontosY.push(ajuste.calcular(x));
                    }
                    curvas.push({
                        tipo: t,
                        x: pontosX,
                        y: pontosY,
                        r2: ajuste.r2
                    });
                }
                catch (e) {
                    // Ignora ajustes que falham
                }
            }
            res.json({
                sucesso: true,
                curvas
            });
        }
        else {
            // Gerar curva para ajuste específico
            const ajuste = criarAjuste(tipo, valoresX, valoresY);
            ajuste.ajustar();
            const pontosX = [];
            const pontosY = [];
            for (let i = 0; i < numPontos; i++) {
                const x = xMin + i * passo;
                // Evitar x <= 0 para ajustes que requerem valores positivos
                if ((tipo === 'hiperbolico' || tipo === 'logaritmico' || tipo === 'potencial') && x <= 0) {
                    continue;
                }
                pontosX.push(x);
                pontosY.push(ajuste.calcular(x));
            }
            res.json({
                sucesso: true,
                pontosCurva: {
                    x: pontosX,
                    y: pontosY
                },
                r2: ajuste.r2
            });
        }
    }
    catch (error) {
        res.status(500).json({
            sucesso: false,
            erro: error instanceof Error ? error.message : 'Erro interno'
        });
    }
}
//# sourceMappingURL=ajusteController.js.map