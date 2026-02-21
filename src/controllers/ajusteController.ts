import { Request, Response } from 'express';
import { IAjuste } from '../services/IAjuste';
import { Linear } from '../services/Linear';
import { Parabolico } from '../services/Parabolico';
import { Exponencial } from '../services/Exponencial';
import { Hiperbolico } from '../services/Hiperbolico';
import { Logaritmico } from '../services/Logaritmico';
import { Potencial } from '../services/Potencial';
import { TipoAjuste, TIPOS_AJUSTE, AjusteResultado } from '../types';

/**
 * Cria instância do ajuste baseado no tipo
 */
function criarAjuste(tipo: TipoAjuste, valoresX: number[], valoresY: number[]): IAjuste {
  switch (tipo) {
    case 'linear':
      return new Linear(valoresX, valoresY);
    case 'parabolico':
      return new Parabolico(valoresX, valoresY);
    case 'exponencial':
      return new Exponencial(valoresX, valoresY);
    case 'hiperbolico':
      return new Hiperbolico(valoresX, valoresY);
    case 'logaritmico':
      return new Logaritmico(valoresX, valoresY);
    case 'potencial':
      return new Potencial(valoresX, valoresY);
    default:
      throw new Error(`Tipo de ajuste não suportado: ${tipo}`);
  }
}

/**
 * POST /api/ajuste
 * Calcula ajuste para tipo especificado
 */
export function calcularAjuste(req: Request, res: Response): void {
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
    
    const ajuste = criarAjuste(tipo as TipoAjuste, valoresX, valoresY);
    ajuste.ajustar();
    
    res.json({
      sucesso: true,
      dados: ajuste.getResultados()
    });
    
  } catch (error) {
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
export function calcularTodos(req: Request, res: Response): void {
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
    
    const ajustes: AjusteResultado[] = [];
    
    for (const tipo of TIPOS_AJUSTE) {
      try {
        const ajuste = criarAjuste(tipo, valoresX, valoresY);
        ajuste.ajustar();
        ajustes.push(ajuste.getResultados());
      } catch (e) {
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
    
  } catch (error) {
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
export function listarTipos(req: Request, res: Response): void {
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
export function gerarPontosCurva(req: Request, res: Response): void {
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
      const curvas: Array<{
        tipo: string;
        x: number[];
        y: number[];
        r2: number;
      }> = [];
      
      for (const t of TIPOS_AJUSTE) {
        try {
          const ajuste = criarAjuste(t, valoresX, valoresY);
          ajuste.ajustar();
          
          const pontosX: number[] = [];
          const pontosY: number[] = [];
          
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
        } catch (e) {
          // Ignora ajustes que falham
        }
      }
      
      res.json({
        sucesso: true,
        curvas
      });
      
    } else {
      // Gerar curva para ajuste específico
      const ajuste = criarAjuste(tipo as TipoAjuste, valoresX, valoresY);
      ajuste.ajustar();
      
      const pontosX: number[] = [];
      const pontosY: number[] = [];
      
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
    
  } catch (error) {
    res.status(500).json({
      sucesso: false,
      erro: error instanceof Error ? error.message : 'Erro interno'
    });
  }
}
