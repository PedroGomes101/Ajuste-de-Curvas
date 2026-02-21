import { Linear } from '../src/services/Linear';
import { Parabolico } from '../src/services/Parabolico';
import { Exponencial } from '../src/services/Exponencial';
import { Hiperbolico } from '../src/services/Hiperbolico';
import { Logaritmico } from '../src/services/Logaritmico';
import { Potencial } from '../src/services/Potencial';
import { resolverSistemaLinear } from '../src/utils/gaussElimination';
import request from 'supertest';
import app from '../src/server';

// ==================== Testes Unitários ====================

describe('Linear', () => {
  it('deve calcular ajuste linear perfeito com R² = 1', () => {
    const linear = new Linear([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
    linear.ajustar();
    
    expect(linear.r2).toBeCloseTo(1, 5);
    expect(linear.calcular(6)).toBeCloseTo(12, 5);
  });
  
  it('deve retornar coeficientes corretos', () => {
    const linear = new Linear([1, 2, 3], [3, 5, 7]);
    linear.ajustar();
    
    const resultado = linear.getResultados();
    expect(resultado.coeficientes.a).toBeCloseTo(1, 5);
    expect(resultado.coeficientes.b).toBeCloseTo(2, 5);
    expect(resultado.tipo).toBe('linear');
  });
  
  it('deve ter R² entre 0 e 1 para dados com ruído', () => {
    const linear = new Linear([1, 2, 3, 4, 5], [2.1, 3.9, 6.2, 7.8, 10.1]);
    linear.ajustar();
    
    expect(linear.r2).toBeGreaterThan(0);
    expect(linear.r2).toBeLessThanOrEqual(1);
  });
});

describe('Parabolico', () => {
  it('deve calcular ajuste parabólico para y = x²', () => {
    const parab = new Parabolico([1, 2, 3, 4, 5], [1, 4, 9, 16, 25]);
    parab.ajustar();
    
    expect(parab.r2).toBeGreaterThan(0.99);
  });
  
  it('deve retornar coeficientes corretos para y = 1 + 2x + 3x²', () => {
    // y = 1 + 2x + 3x²
    const valoresX = [0, 1, 2, 3, 4];
    const valoresY = valoresX.map(x => 1 + 2*x + 3*x*x);
    
    const parab = new Parabolico(valoresX, valoresY);
    parab.ajustar();
    
    const resultado = parab.getResultados();
    expect(resultado.coeficientes.a0).toBeCloseTo(1, 3);
    expect(resultado.coeficientes.a1).toBeCloseTo(2, 3);
    expect(resultado.coeficientes.a2).toBeCloseTo(3, 3);
  });
});

describe('Exponencial', () => {
  it('deve calcular ajuste exponencial', () => {
    // y = 2 * e^(0.5x)
    const valoresX = [1, 2, 3, 4, 5];
    const valoresY = valoresX.map(x => 2 * Math.exp(0.5 * x));
    
    const exp = new Exponencial(valoresX, valoresY);
    exp.ajustar();
    
    expect(exp.r2).toBeGreaterThan(0.99);
    const resultado = exp.getResultados();
    expect(resultado.coeficientes.a).toBeCloseTo(2, 1);
    expect(resultado.coeficientes.b).toBeCloseTo(0.5, 1);
  });
  
  it('deve lançar erro para valores Y negativos ou zero', () => {
    const exp = new Exponencial([1, 2, 3], [1, -2, 3]);
    expect(() => exp.ajustar()).toThrow();
  });
});

describe('Hiperbolico', () => {
  it('deve calcular ajuste hiperbólico', () => {
    // y = 5 + 10/x
    const valoresX = [1, 2, 4, 5, 10];
    const valoresY = valoresX.map(x => 5 + 10/x);
    
    const hip = new Hiperbolico(valoresX, valoresY);
    hip.ajustar();
    
    expect(hip.r2).toBeGreaterThan(0.99);
    const resultado = hip.getResultados();
    expect(resultado.coeficientes.b).toBeCloseTo(5, 1);
    expect(resultado.coeficientes.a).toBeCloseTo(10, 1);
  });
  
  it('deve lançar erro para X = 0', () => {
    const hip = new Hiperbolico([0, 1, 2], [1, 2, 3]);
    expect(() => hip.ajustar()).toThrow();
  });
});

describe('Logaritmico', () => {
  it('deve calcular ajuste logarítmico', () => {
    // y = 2 + 3*ln(x)
    const valoresX = [1, 2, 3, 4, 5];
    const valoresY = valoresX.map(x => 2 + 3 * Math.log(x));
    
    const log = new Logaritmico(valoresX, valoresY);
    log.ajustar();
    
    expect(log.r2).toBeGreaterThan(0.99);
    const resultado = log.getResultados();
    expect(resultado.coeficientes.a).toBeCloseTo(2, 1);
    expect(resultado.coeficientes.b).toBeCloseTo(3, 1);
  });
  
  it('deve lançar erro para X <= 0', () => {
    const log = new Logaritmico([-1, 1, 2], [1, 2, 3]);
    expect(() => log.ajustar()).toThrow();
  });
});

describe('Potencial', () => {
  it('deve calcular ajuste potencial', () => {
    // y = 2 * x^3
    const valoresX = [1, 2, 3, 4, 5];
    const valoresY = valoresX.map(x => 2 * Math.pow(x, 3));
    
    const pot = new Potencial(valoresX, valoresY);
    pot.ajustar();
    
    expect(pot.r2).toBeGreaterThan(0.99);
    const resultado = pot.getResultados();
    expect(resultado.coeficientes.a).toBeCloseTo(2, 1);
    expect(resultado.coeficientes.b).toBeCloseTo(3, 1);
  });
  
  it('deve lançar erro para valores negativos', () => {
    const pot = new Potencial([-1, 1, 2], [1, 2, 3]);
    expect(() => pot.ajustar()).toThrow();
  });
});

describe('Eliminação de Gauss', () => {
  it('deve resolver sistema linear 2x2', () => {
    // 2x + y = 5
    // x + 3y = 10
    // Solução: x = 1, y = 3
    const matriz = [[2, 1], [1, 3]];
    const termos = [5, 10];
    
    const resultado = resolverSistemaLinear(matriz, termos);
    
    expect(resultado[0]).toBeCloseTo(1, 5);
    expect(resultado[1]).toBeCloseTo(3, 5);
  });
  
  it('deve resolver sistema linear 3x3', () => {
    // x + y + z = 6
    // 2x + y - z = 1
    // x - y + 2z = 5
    // Solução: x = 1, y = 2, z = 3
    const matriz = [[1, 1, 1], [2, 1, -1], [1, -1, 2]];
    const termos = [6, 1, 5];
    
    const resultado = resolverSistemaLinear(matriz, termos);
    
    expect(resultado[0]).toBeCloseTo(1, 5);
    expect(resultado[1]).toBeCloseTo(2, 5);
    expect(resultado[2]).toBeCloseTo(3, 5);
  });
});

// ==================== Testes de Integração da API ====================

describe('API Endpoints', () => {
  it('POST /api/ajuste deve retornar resultado válido', async () => {
    const response = await request(app)
      .post('/api/ajuste')
      .send({
        valoresX: [1, 2, 3, 4, 5],
        valoresY: [2, 4, 6, 8, 10],
        tipo: 'linear'
      });
    
    expect(response.status).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.dados.r2).toBeCloseTo(1, 5);
    expect(response.body.dados.tipo).toBe('linear');
  });
  
  it('POST /api/ajuste/todos deve retornar 6 ajustes', async () => {
    const response = await request(app)
      .post('/api/ajuste/todos')
      .send({
        valoresX: [1, 2, 3, 4, 5],
        valoresY: [2.1, 3.9, 6.2, 7.8, 10.1]
      });
    
    expect(response.status).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.ajustes.length).toBe(6);
    expect(response.body.melhorAjuste).toBeDefined();
  });
  
  it('GET /api/tipos deve retornar lista de tipos', async () => {
    const response = await request(app).get('/api/tipos');
    
    expect(response.status).toBe(200);
    expect(response.body.tipos).toBeDefined();
    expect(response.body.tipos.length).toBe(7); // 6 tipos + "todos"
  });
  
  it('POST /api/pontos-curva deve retornar pontos', async () => {
    const response = await request(app)
      .post('/api/pontos-curva')
      .send({
        valoresX: [1, 2, 3, 4, 5],
        valoresY: [2, 4, 6, 8, 10],
        tipo: 'linear',
        numPontos: 50
      });
    
    expect(response.status).toBe(200);
    expect(response.body.sucesso).toBe(true);
    expect(response.body.pontosCurva.x.length).toBe(50);
    expect(response.body.pontosCurva.y.length).toBe(50);
  });
  
  it('POST /api/ajuste deve retornar erro para dados inválidos', async () => {
    const response = await request(app)
      .post('/api/ajuste')
      .send({
        valoresX: [1, 2, 3],
        valoresY: [2, 4], // tamanho diferente
        tipo: 'linear'
      });
    
    expect(response.status).toBe(400);
    expect(response.body.sucesso).toBe(false);
    expect(response.body.erro).toBeDefined();
  });
});
