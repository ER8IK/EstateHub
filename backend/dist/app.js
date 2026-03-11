"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const middleware_1 = require("./shared/middleware");
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const users_routes_1 = __importDefault(require("./modules/users/users.routes"));
const properties_route_1 = __importDefault(require("./modules/properties/properties.route"));
const investments_route_1 = __importDefault(require("./modules/investments/investments.route"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:3001',
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(express_1.default.json());
app.use('/api/auth', auth_route_1.default);
app.use('/api/users', users_routes_1.default);
app.use('/api/properties', properties_route_1.default);
app.use('/api/investments', investments_route_1.default);
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});
app.use(middleware_1.errorMiddleware);
exports.default = app;
//# sourceMappingURL=app.js.map