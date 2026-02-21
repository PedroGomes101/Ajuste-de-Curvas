import express from 'express';
import cors from 'cors';
import path from 'path';
import { ajusteRoutes } from './routes/ajusteRoutes';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Rotas da API
app.use('/api', ajusteRoutes);

// Rota principal - serve o frontend
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
