import { Request, Response } from 'express';
/**
 * POST /api/ajuste
 * Calcula ajuste para tipo especificado
 */
export declare function calcularAjuste(req: Request, res: Response): void;
/**
 * POST /api/ajuste/todos
 * Calcula todos os 6 ajustes para comparação
 */
export declare function calcularTodos(req: Request, res: Response): void;
/**
 * GET /api/tipos
 * Lista tipos de ajuste disponíveis
 */
export declare function listarTipos(req: Request, res: Response): void;
/**
 * POST /api/pontos-curva
 * Gera pontos da curva ajustada para plotagem
 */
export declare function gerarPontosCurva(req: Request, res: Response): void;
//# sourceMappingURL=ajusteController.d.ts.map