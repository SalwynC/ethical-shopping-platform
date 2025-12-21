"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const scraper_service_1 = require("./scraper.service");
const ai_service_1 = require("./ai.service");
const real_data_service_1 = require("./real-data.service");
const prisma_service_1 = require("./database/prisma.service");
const internal_product_db_service_1 = require("./services/internal-product-db.service");
const sustainability_analyzer_service_1 = require("./services/sustainability-analyzer.service");
const alternatives_engine_service_1 = require("./services/alternatives-engine.service");
const price_comparison_service_1 = require("./services/price-comparison.service");
const ai_scraper_service_1 = require("./services/ai-scraper.service");
const html_scraper_service_1 = require("./services/html-scraper.service");
const review_checker_service_1 = require("./services/review-checker.service");
const real_product_analyzer_service_1 = require("./services/real-product-analyzer.service");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            scraper_service_1.ScraperService,
            ai_service_1.AIService,
            real_data_service_1.RealDataService,
            prisma_service_1.PrismaService,
            html_scraper_service_1.HtmlScraperService,
            ai_scraper_service_1.AIScraperService,
            internal_product_db_service_1.InternalProductDbService,
            sustainability_analyzer_service_1.SustainabilityAnalyzerService,
            alternatives_engine_service_1.AlternativesEngineService,
            price_comparison_service_1.PriceComparisonService,
            review_checker_service_1.ReviewCheckerService,
            real_product_analyzer_service_1.RealProductAnalyzerService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map