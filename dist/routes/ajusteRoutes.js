"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajusteRoutes = void 0;
const express_1 = require("express");
const ajusteController_1 = require("../controllers/ajusteController");
const router = (0, express_1.Router)();
exports.ajusteRoutes = router;
router.post('/ajuste', ajusteController_1.calcularAjuste);
router.post('/ajuste/todos', ajusteController_1.calcularTodos);
router.get('/tipos', ajusteController_1.listarTipos);
router.post('/pontos-curva', ajusteController_1.gerarPontosCurva);
//# sourceMappingURL=ajusteRoutes.js.map