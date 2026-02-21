/**
 * Resolve um sistema linear usando Eliminação de Gauss com pivotamento parcial.
 * @param matriz Matriz de coeficientes (n x n)
 * @param termos Vetor de termos independentes
 * @returns Vetor de soluções
 */
export function resolverSistemaLinear(matriz: number[][], termos: number[]): number[] {
  const n = termos.length;
  
  // Criar matriz aumentada
  const aumentada: number[][] = [];
  for (let i = 0; i < n; i++) {
    aumentada[i] = [...matriz[i], termos[i]];
  }
  
  // Eliminação progressiva com pivotamento parcial
  for (let k = 0; k < n; k++) {
    // Encontrar pivô máximo na coluna k
    let maxIndex = k;
    let maxVal = Math.abs(aumentada[k][k]);
    
    for (let i = k + 1; i < n; i++) {
      if (Math.abs(aumentada[i][k]) > maxVal) {
        maxVal = Math.abs(aumentada[i][k]);
        maxIndex = i;
      }
    }
    
    // Trocar linhas se necessário
    if (maxIndex !== k) {
      const temp = aumentada[k];
      aumentada[k] = aumentada[maxIndex];
      aumentada[maxIndex] = temp;
    }
    
    // Verificar se o pivô é zero (sistema singular)
    if (Math.abs(aumentada[k][k]) < 1e-10) {
      throw new Error('Sistema singular ou mal condicionado');
    }
    
    // Eliminar elementos abaixo do pivô
    for (let i = k + 1; i < n; i++) {
      const fator = aumentada[i][k] / aumentada[k][k];
      for (let j = k; j <= n; j++) {
        aumentada[i][j] -= fator * aumentada[k][j];
      }
    }
  }
  
  // Substituição retroativa
  const resultado: number[] = new Array(n).fill(0);
  
  for (let i = n - 1; i >= 0; i--) {
    let soma = 0;
    for (let j = i + 1; j < n; j++) {
      soma += aumentada[i][j] * resultado[j];
    }
    resultado[i] = (aumentada[i][n] - soma) / aumentada[i][i];
  }
  
  return resultado;
}
