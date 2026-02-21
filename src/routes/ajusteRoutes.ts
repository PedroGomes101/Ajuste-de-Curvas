import { Router } from 'express';
import { 
  calcularAjuste, 
  calcularTodos, 
  listarTipos,
  gerarPontosCurva 
} from '../controllers/ajusteController';

const router = Router();

router.post('/ajuste', calcularAjuste);
router.post('/ajuste/todos', calcularTodos);
router.get('/tipos', listarTipos);
router.post('/pontos-curva', gerarPontosCurva);

export { router as ajusteRoutes };
