# Ajuste de Curva - Node.js/TypeScript

Aplicação web para ajuste de curvas usando diferentes modelos matemáticos.

## Funcionalidades

- 6 tipos de ajuste: Linear, Parabólico, Exponencial, Hiperbólico, Logarítmico, Potencial
- Cálculo do coeficiente de determinação (R²)
- Visualização gráfica com Chart.js
- Comparação de todos os ajustes simultaneamente

## Modelos Matemáticos

| Tipo | Fórmula | Método |
|------|---------|--------|
| Linear | y = a + bx | Mínimos Quadrados |
| Parabólico | y = a₀ + a₁x + a₂x² | Eliminação de Gauss |
| Exponencial | y = a·e^(bx) | Linearização (ln) |
| Hiperbólico | y = b + a/x | Linearização (1/x) |
| Logarítmico | y = a + b·ln(x) | Linearização |
| Potencial | y = a·x^b | Linearização dupla |

## Instalação

```bash
npm install
```

## Execução

**Desenvolvimento:**
```bash
npm run dev
```

**Produção:**
```bash
npm run build
npm start
```

## API Endpoints

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/ajuste` | Calcula ajuste específico |
| POST | `/api/ajuste/todos` | Compara todos os ajustes |
| GET | `/api/tipos` | Lista tipos disponíveis |
| POST | `/api/pontos-curva` | Gera pontos para gráfico |

## Exemplo de Uso da API

**Calcular ajuste linear:**
```bash
curl -X POST http://localhost:3000/api/ajuste \
  -H "Content-Type: application/json" \
  -d '{"valoresX":[1,2,3,4,5],"valoresY":[2,4,6,8,10],"tipo":"linear"}'
```

**Resposta:**
```json
{
  "sucesso": true,
  "dados": {
    "tipo": "linear",
    "coeficientes": { "a": 0, "b": 2 },
    "r2": 1,
    "formula": "y = 0.0000 + 2.0000x"
  }
}
```

**Comparar todos os ajustes:**
```bash
curl -X POST http://localhost:3000/api/ajuste/todos \
  -H "Content-Type: application/json" \
  -d '{"valoresX":[1,2,3,4,5],"valoresY":[2.1,3.9,6.2,7.8,10.1]}'
```

## Testes

```bash
npm test
```

## Estrutura do Projeto

```
ajuste-de-curva/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # Configuração Express
│   ├── routes/
│   │   └── ajusteRoutes.ts   # Rotas da API
│   ├── controllers/
│   │   └── ajusteController.ts
│   ├── services/
│   │   ├── IAjuste.ts        # Interface base
│   │   ├── Linear.ts
│   │   ├── Parabolico.ts
│   │   ├── Exponencial.ts
│   │   ├── Hiperbolico.ts
│   │   ├── Logaritmico.ts
│   │   └── Potencial.ts
│   ├── utils/
│   │   └── gaussElimination.ts
│   └── types/
│       └── index.ts
├── public/
│   ├── index.html
│   ├── styles.css
│   └── js/
│       └── app.js
└── tests/
    └── ajuste.test.ts
```

## Tecnologias

- **Backend:** Node.js, Express.js, TypeScript
- **Frontend:** HTML5, CSS3, JavaScript, Chart.js
- **Testes:** Jest, Supertest

## Licença

MIT
