// Variáveis globais
let grafico = null;
const API_BASE = '/api';

const CORES_AJUSTE = {
  linear: '#f472b6',
  parabolico: '#38bdf8',
  exponencial: '#fbbf24',
  hiperbolico: '#34d399',
  logaritmico: '#a78bfa',
  potencial: '#fb923c'
};

const NOMES_AJUSTE = {
  linear: 'Linear',
  parabolico: 'Parabólico',
  exponencial: 'Exponencial',
  hiperbolico: 'Hiperbólico',
  logaritmico: 'Logarítmico',
  potencial: 'Potencial'
};

/**
 * Obtém os valores de X e Y dos campos de entrada
 */
function obterValores() {
  const xStr = document.getElementById('valoresX').value;
  const yStr = document.getElementById('valoresY').value;
  
  const valoresX = xStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  const valoresY = yStr.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
  
  return { valoresX, valoresY };
}

/**
 * Limpa todos os dados e o gráfico
 */
function limparDados() {
  document.getElementById('valoresX').value = '';
  document.getElementById('valoresY').value = '';
  document.getElementById('resultados').innerHTML = `
    <div class="empty-state">
      <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" opacity="0.3"><circle cx="12" cy="12" r="10"/><path d="M8 12l2 2 4-4"/></svg>
      <p>Insira os dados e clique em <strong>Calcular</strong> para ver a análise de regressão.</p>
    </div>`;
  const badge = document.getElementById('badgeR2');
  if (badge) badge.style.display = 'none';

}

/**
 * Calcula o ajuste e exibe os resultados
 */
async function calcularAjuste() {
  const { valoresX, valoresY } = obterValores();
  const tipo = document.getElementById('tipoAjuste').value;
  
  if (valoresX.length === 0 || valoresY.length === 0) {
    alert('Por favor, insira valores de X e Y');
    return;
  }
  
  if (valoresX.length !== valoresY.length) {
    alert('X e Y devem ter o mesmo número de valores');
    return;
  }
  
  try {
    const endpoint = tipo === 'todos' ? '/ajuste/todos' : '/ajuste';
    const response = await fetch(API_BASE + endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valoresX, valoresY, tipo })
    });
    
    const data = await response.json();
    
    if (!data.sucesso) {
      alert('Erro: ' + data.erro);
      return;
    }
    
    exibirResultados(data, tipo);
  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao calcular ajuste');
  }
}

/**
 * Exibe os resultados na área de texto
 */
function exibirResultados(data, tipo) {
  const div = document.getElementById('resultados');
  const badge = document.getElementById('badgeR2');
  
  if (tipo === 'todos') {
    let html = '┌──────────────────────────────────────────┐\n';
    html +=    '│   COMPARAÇÃO DE MODELOS DE REGRESSÃO     │\n';
    html +=    '└──────────────────────────────────────────┘\n\n';
    
    data.ajustes.forEach((ajuste, i) => {
      const nome = NOMES_AJUSTE[ajuste.tipo] || ajuste.tipo;
      const bar = '█'.repeat(Math.round(ajuste.r2 * 20));
      const pad = '░'.repeat(20 - Math.round(ajuste.r2 * 20));
      html += `  ${i + 1}. ${nome.toUpperCase()}\n`;
      html += `     Fórmula : ${ajuste.formula}\n`;
      html += `     R²      : ${ajuste.r2.toFixed(6)}  ${bar}${pad}\n\n`;
    });
    
    const melhorNome = NOMES_AJUSTE[data.melhorAjuste] || data.melhorAjuste;
    html += `  ──────────────────────────────────────\n`;
    html += `  ★ Melhor ajuste: ${melhorNome}`;
    div.innerHTML = html;

    if (badge) {
      badge.textContent = 'TODOS';
      badge.style.display = 'inline-block';
    }
  } else {
    const ajuste = data.dados;
    const nome = NOMES_AJUSTE[ajuste.tipo] || ajuste.tipo;
    let html = `┌──────────────────────────────────────────┐\n`;
    html +=    `│   AJUSTE ${nome.toUpperCase().padEnd(31)}│\n`;
    html +=    `└──────────────────────────────────────────┘\n\n`;
    html += `  Fórmula : ${ajuste.formula}\n\n`;
    html += `  Coeficientes:\n`;
    
    for (const [coefNome, valor] of Object.entries(ajuste.coeficientes)) {
      html += `    ${coefNome.padEnd(6)} = ${Number(valor).toFixed(6)}\n`;
    }
    
    const r2 = ajuste.r2;
    const bar = '█'.repeat(Math.round(r2 * 20));
    const pad = '░'.repeat(20 - Math.round(r2 * 20));
    html += `\n  R² = ${r2.toFixed(6)}  ${bar}${pad}`;
    div.innerHTML = html;

    if (badge) {
      badge.textContent = `R² ${r2.toFixed(4)}`;
      badge.style.display = 'inline-block';
    }
  }
}

/**
 * Abre o modal do gráfico
 */
function abrirModal() {
  document.getElementById('modalGrafico').classList.add('active');
  document.body.style.overflow = 'hidden';
}

/**
 * Fecha o modal do gráfico
 */
function fecharModal() {
  document.getElementById('modalGrafico').classList.remove('active');
  document.body.style.overflow = '';
}

// Fechar modal ao clicar no fundo escuro
document.addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalGrafico')) fecharModal();
});

// Fechar modal com Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') fecharModal();
});

/**
 * Cria o gráfico e exibe no modal por cima da página
 */
async function criarGrafico() {
  const { valoresX, valoresY } = obterValores();
  const tipo = document.getElementById('tipoAjuste').value;
  
  if (valoresX.length === 0 || valoresY.length === 0) {
    alert('Por favor, insira valores de X e Y');
    return;
  }
  
  if (valoresX.length !== valoresY.length) {
    alert('X e Y devem ter o mesmo número de valores');
    return;
  }
  
  try {
    const pontosOriginais = valoresX.map((x, i) => ({ x, y: valoresY[i] }));

    const response = await fetch(API_BASE + '/pontos-curva', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valoresX, valoresY, tipo, numPontos: 100 })
    });

    const curvaData = await response.json();

    if (!curvaData.sucesso) {
      alert('Erro: ' + curvaData.erro);
      return;
    }

    if (grafico) {
      grafico.destroy();
    }

    const ctx = document.getElementById('graficoAjuste').getContext('2d');

    const datasets = [
      {
        label: 'Dados Experimentais',
        data: pontosOriginais,
        backgroundColor: '#f472b6',
        borderColor: '#f472b6',
        pointRadius: 6,
        pointHoverRadius: 9,
        pointStyle: 'circle',
        pointBorderWidth: 2,
        pointBorderColor: '#fff',
        showLine: false
      }
    ];

    if (tipo === 'todos') {
      curvaData.curvas.forEach(curva => {
        const pontosCurva = curva.x.map((x, i) => ({ x, y: curva.y[i] }));
        const nome = NOMES_AJUSTE[curva.tipo] || curva.tipo;
        datasets.push({
          type: 'line',
          label: `${nome} (R²=${curva.r2.toFixed(4)})`,
          data: pontosCurva,
          borderColor: CORES_AJUSTE[curva.tipo],
          backgroundColor: 'transparent',
          showLine: true,
          fill: false,
          pointRadius: 0,
          borderWidth: 2.5,
          tension: 0.4
        });
      });
    } else {
      const pontosCurva = curvaData.pontosCurva.x.map((x, i) => ({ 
        x, 
        y: curvaData.pontosCurva.y[i] 
      }));
      const nome = NOMES_AJUSTE[tipo] || tipo;
      datasets.push({
        type: 'line',
        label: `${nome} (R²=${curvaData.r2.toFixed(4)})`,
        data: pontosCurva,
        borderColor: CORES_AJUSTE[tipo],
        backgroundColor: 'transparent',
        showLine: true,
        fill: false,
        pointRadius: 0,
        borderWidth: 2.5,
        tension: 0.4
      });
    }

    grafico = new Chart(ctx, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: 'Análise de Regressão',
            font: { size: 16, weight: '600', family: 'Inter' },
            color: '#e2e8f0',
            padding: { bottom: 16 }
          },
          legend: {
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { size: 12, family: 'Inter' },
              padding: 16,
              usePointStyle: true,
              pointStyleWidth: 12
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15,23,42,0.95)',
            titleColor: '#38bdf8',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(56,189,248,0.3)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            callbacks: {
              label: function(context) {
                return `  (${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(4)})`;
              }
            }
          }
        },
        scales: {
          x: {
            type: 'linear',
            title: { 
              display: true, 
              text: 'X',
              font: { size: 13, weight: '600', family: 'Inter' },
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(148,163,184,0.08)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: 'JetBrains Mono' }
            }
          },
          y: {
            title: { 
              display: true, 
              text: 'Y',
              font: { size: 13, weight: '600', family: 'Inter' },
              color: '#94a3b8'
            },
            grid: {
              color: 'rgba(148,163,184,0.08)',
              drawBorder: false
            },
            ticks: {
              color: '#64748b',
              font: { size: 11, family: 'JetBrains Mono' }
            }
          }
        }
      }
    });

    abrirModal();

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao criar gráfico');
  }
}
