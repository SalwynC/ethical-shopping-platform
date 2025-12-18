"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handler;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_express_1 = require("@nestjs/platform-express");
const express_1 = __importDefault(require("express"));
const serverless_http_1 = __importDefault(require("serverless-http"));
const app_module_1 = require("../src/app.module");
const expressApp = (0, express_1.default)();
async function createServerlessHandler() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, new platform_express_1.ExpressAdapter(expressApp));
    app.enableCors({ origin: true, credentials: true });
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        transform: true,
        transformOptions: { enableImplicitConversion: true },
    }));
    await app.init();
    return (0, serverless_http_1.default)(expressApp);
}
let handlerPromise = null;
async function handler(req, res) {
    if (!handlerPromise) {
        handlerPromise = createServerlessHandler();
    }
    const handlerFn = await handlerPromise;
    return handlerFn(req, res);
}
//# sourceMappingURL=index.js.map