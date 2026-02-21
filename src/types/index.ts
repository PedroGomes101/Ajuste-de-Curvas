export interface AjusteResultado {
  tipo: string;
  coeficientes: Record<string, number>;
  r2: number;
  formula: string;
}

export interface PontosCurva {
  x: number[];
  y: number[];
}

export interface RequisicaoAjuste {
  valoresX: number[];
  valoresY: number[];
  tipo: TipoAjuste;
}

export interface RespostaAjuste {
  sucesso: boolean;
  dados?: AjusteResultado;
  pontosCurva?: PontosCurva;
  erro?: string;
}

export interface RespostaComparacao {
  sucesso: boolean;
  ajustes: AjusteResultado[];
  melhorAjuste: string;
}

export type TipoAjuste = 
  | 'linear' 
  | 'parabolico' 
  | 'exponencial' 
  | 'hiperbolico' 
  | 'logaritmico' 
  | 'potencial' 
  | 'todos';

export const TIPOS_AJUSTE: TipoAjuste[] = [
  'linear',
  'parabolico',
  'exponencial',
  'hiperbolico',
  'logaritmico',
  'potencial'
];
