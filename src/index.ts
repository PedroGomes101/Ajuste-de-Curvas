import dotenv from 'dotenv';
dotenv.config();

import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════════╗
  ║     AJUSTE DE CURVA - Node.js/TS       ║
  ╠════════════════════════════════════════╣
  ║  Servidor rodando em:                  ║
  ║  http://localhost:${PORT}                   ║
  ╚════════════════════════════════════════╝
  `);
});
