"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const ajusteRoutes_1 = require("./routes/ajusteRoutes");
const app = (0, express_1.default)();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Servir arquivos estáticos
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
// Rotas da API
app.use('/api', ajusteRoutes_1.ajusteRoutes);
// Rota principal - serve o frontend
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
});
exports.default = app;
//# sourceMappingURL=server.js.map