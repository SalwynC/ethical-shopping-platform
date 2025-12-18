"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var InternalProductDbService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalProductDbService = void 0;
const common_1 = require("@nestjs/common");
let InternalProductDbService = InternalProductDbService_1 = class InternalProductDbService {
    constructor() {
        this.logger = new common_1.Logger(InternalProductDbService_1.name);
        this.products = [
            {
                id: 'apple-iphone-15',
                title: 'Apple iPhone 15 Pro',
                category: 'Electronics',
                brand: 'Apple',
                price: 99999,
                originalPrice: 129999,
                rating: 4.8,
                reviews: 5432,
                description: 'Latest iPhone with A17 Pro chip, advanced camera system, and beautiful design',
                features: [
                    '6.1" display',
                    'A17 Pro chip',
                    'Advanced camera',
                    'USB-C',
                    'Premium design',
                ],
                ethicalScore: 75,
                sustainabilityScore: 78,
            },
            {
                id: 'samsung-s24',
                title: 'Samsung Galaxy S24 Ultra',
                category: 'Electronics',
                brand: 'Samsung',
                price: 99999,
                originalPrice: 124999,
                rating: 4.7,
                reviews: 4231,
                description: 'Flagship Android phone with S Pen, excellent display, and powerful performance',
                features: [
                    '6.8" display',
                    'Snapdragon 8 Gen 3',
                    'S Pen included',
                    '200MP camera',
                    '5000mAh battery',
                ],
                ethicalScore: 72,
                sustainabilityScore: 74,
            },
            {
                id: 'laptop-macbook-pro',
                title: 'MacBook Pro 16" M3 Max',
                category: 'Electronics',
                brand: 'Apple',
                price: 249990,
                originalPrice: 279990,
                rating: 4.9,
                reviews: 3421,
                description: 'Professional laptop with M3 Max chip, ideal for developers and designers',
                features: [
                    'M3 Max chip',
                    '36GB memory',
                    '512GB SSD',
                    '16" Retina display',
                    '16 GPU cores',
                ],
                ethicalScore: 76,
                sustainabilityScore: 80,
            },
            {
                id: 'nike-air-max',
                title: 'Nike Air Max 90',
                category: 'Fashion',
                brand: 'Nike',
                price: 8999,
                originalPrice: 11999,
                rating: 4.6,
                reviews: 2134,
                description: 'Iconic sneaker with responsive cushioning and timeless design',
                features: [
                    'Max Air cushioning',
                    'Durable rubber sole',
                    'Premium leather',
                    'Breathable mesh',
                    'Iconic design',
                ],
                ethicalScore: 68,
                sustainabilityScore: 65,
            },
            {
                id: 'adidas-ultraboost',
                title: 'Adidas Ultraboost 22',
                category: 'Fashion',
                brand: 'Adidas',
                price: 9999,
                originalPrice: 14999,
                rating: 4.7,
                reviews: 3456,
                description: 'Running shoe with responsive Boost technology',
                features: [
                    'Boost cushioning',
                    'Primeknit upper',
                    'Continental rubber',
                    'Responsive',
                    'Lightweight',
                ],
                ethicalScore: 70,
                sustainabilityScore: 72,
            },
            {
                id: 'patagonia-jacket',
                title: 'Patagonia Nano Puff Jacket',
                category: 'Fashion',
                brand: 'Patagonia',
                price: 12999,
                originalPrice: 15999,
                rating: 4.8,
                reviews: 987,
                description: 'Eco-friendly insulated jacket made from recycled materials',
                features: [
                    '100% recycled polyester',
                    'Lightweight insulation',
                    'Water resistant',
                    'Packable',
                    'Sustainable',
                ],
                ethicalScore: 92,
                sustainabilityScore: 95,
            },
            {
                id: 'kindle-paperwhite',
                title: 'Amazon Kindle Paperwhite',
                category: 'Electronics',
                brand: 'Amazon',
                price: 14999,
                originalPrice: 18999,
                rating: 4.5,
                reviews: 4567,
                description: 'Waterproof e-reader with backlit display, perfect for reading',
                features: [
                    '6.8" display',
                    'IPX8 waterproof',
                    'Backlit display',
                    '11-week battery',
                    '32GB storage',
                ],
                ethicalScore: 65,
                sustainabilityScore: 70,
            },
            {
                id: 'dyson-v15',
                title: 'Dyson V15 Detect',
                category: 'Home',
                brand: 'Dyson',
                price: 59990,
                originalPrice: 74990,
                rating: 4.6,
                reviews: 2345,
                description: 'Cordless vacuum with laser dust detection and powerful suction',
                features: [
                    'Laser detection',
                    '60 min runtime',
                    '450W suction',
                    'Digital display',
                    'App control',
                ],
                ethicalScore: 60,
                sustainabilityScore: 65,
            },
            {
                id: 'loreal-serum',
                title: "L'Oreal Revitalift Vitamin C Serum",
                category: 'Beauty',
                brand: "L'Oreal",
                price: 1499,
                originalPrice: 1999,
                rating: 4.3,
                reviews: 5432,
                description: 'Anti-aging vitamin C serum for brightening and firming skin',
                features: [
                    'Pure Vitamin C',
                    'Anti-aging',
                    'Brightening',
                    'Paraben-free',
                    'Suitable for all skin types',
                ],
                ethicalScore: 62,
                sustainabilityScore: 60,
            },
            {
                id: 'dermatica-neem',
                title: 'Dermatica Neem & Turmeric Face Pack',
                category: 'Beauty',
                brand: 'Dermatica',
                price: 249,
                originalPrice: 399,
                rating: 4.7,
                reviews: 3421,
                description: 'Natural face pack with neem and turmeric for clear skin',
                features: [
                    '100% natural',
                    'Organic ingredients',
                    'Cruelty-free',
                    'Eco-friendly packaging',
                    'Ayurvedic formula',
                ],
                ethicalScore: 88,
                sustainabilityScore: 90,
            },
            {
                id: 'apple-watch-ultra',
                title: 'Apple Watch Ultra',
                category: 'Electronics',
                brand: 'Apple',
                price: 79900,
                originalPrice: 89900,
                rating: 4.7,
                reviews: 2123,
                description: 'Rugged smartwatch designed for adventure with excellent health tracking',
                features: [
                    'Titanium case',
                    'Always-on display',
                    'GPS',
                    'Health tracking',
                    'Water resistant 100m',
                ],
                ethicalScore: 74,
                sustainabilityScore: 76,
            },
        ];
        this.logger.log('📦 Internal Product Database Service initialized with 11 products');
    }
    getProductById(productId) {
        return (this.products.find((p) => p.id.toLowerCase() === productId.toLowerCase()) || null);
    }
    searchByCategory(category) {
        return this.products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
    }
    searchByBrand(brand) {
        return this.products.filter((p) => p.brand.toLowerCase() === brand.toLowerCase());
    }
    searchByKeyword(keyword) {
        const lowerKeyword = keyword.toLowerCase();
        return this.products.filter((p) => p.title.toLowerCase().includes(lowerKeyword) ||
            p.brand.toLowerCase().includes(lowerKeyword) ||
            p.description.toLowerCase().includes(lowerKeyword) ||
            p.features.some((f) => f.toLowerCase().includes(lowerKeyword)));
    }
    getProductsByPriceRange(minPrice, maxPrice) {
        return this.products.filter((p) => p.price >= minPrice && p.price <= maxPrice);
    }
    getTopRatedProducts(limit = 5) {
        return [...this.products]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }
    getSustainableProducts(minScore = 75) {
        return this.products.filter((p) => p.sustainabilityScore >= minScore);
    }
    getEthicalProducts(minScore = 75) {
        return this.products.filter((p) => p.ethicalScore >= minScore);
    }
    getSimilarProducts(product, limit = 5) {
        const priceRange = product.price * 0.3;
        return this.products
            .filter((p) => p.id !== product.id &&
            p.category === product.category &&
            p.price >= product.price - priceRange &&
            p.price <= product.price + priceRange)
            .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
            .slice(0, limit);
    }
    getBetterAlternatives(product, limit = 5) {
        const priceRange = product.price * 0.5;
        return this.products
            .filter((p) => p.id !== product.id &&
            p.category === product.category &&
            (p.ethicalScore > product.ethicalScore ||
                p.sustainabilityScore > product.sustainabilityScore) &&
            p.price >= product.price * 0.7 &&
            p.price <= product.price + priceRange)
            .sort((a, b) => {
            const scoreA = (a.ethicalScore + a.sustainabilityScore) / 2;
            const scoreB = (b.ethicalScore + b.sustainabilityScore) / 2;
            return scoreB - scoreA;
        })
            .slice(0, limit);
    }
    getAllProducts() {
        return this.products;
    }
    getProductCountByCategory() {
        const counts = {};
        this.products.forEach((p) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
        });
        return counts;
    }
    addProduct(product) {
        this.products.push(product);
        this.logger.log(`✅ Added new product: ${product.title}`);
        return product;
    }
};
exports.InternalProductDbService = InternalProductDbService;
exports.InternalProductDbService = InternalProductDbService = InternalProductDbService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], InternalProductDbService);
//# sourceMappingURL=internal-product-db.service.js.map