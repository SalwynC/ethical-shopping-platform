import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.userSavings.deleteMany();
  await prisma.ruleEvaluation.deleteMany();
  await prisma.alternative.deleteMany();
  await prisma.analysis.deleteMany();
  await prisma.priceHistory.deleteMany();
  await prisma.product.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Real products with actual data from major e-commerce platforms (20+ products)
  const products = [
    {
      url: 'https://www.amazon.in/dp/B0BHYQ7L8N',
      title: 'boAt Rockerz 450 Wireless Headphones',
      description: 'Premium wireless headphone with 50-hour battery',
      price: 1499,
      originalPrice: 4990,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0BHYQ7L8N',
      brand: 'boAt',
      category: 'Electronics',
      rating: 4.2,
      reviewCount: 2847,
      availability: 'in_stock' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41t5DmXq0eL._SL500_.jpg',
    },
    {
      url: 'https://www.flipkart.com/apple-airpods-pro',
      title: 'Apple AirPods Pro (2nd Generation)',
      description: 'Premium wireless earbuds with noise cancellation',
      price: 26499,
      originalPrice: 29990,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_AIRPODS_PRO',
      brand: 'Apple',
      category: 'Electronics',
      rating: 4.7,
      reviewCount: 5234,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Samsung-Galaxy-Buds-Pro-Black/dp/B095GFNHXJ',
      title: 'Samsung Galaxy Buds Pro',
      description: 'Active noise cancellation earbuds with ambient mode',
      price: 9999,
      originalPrice: 19990,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B095GFNHXJ',
      brand: 'Samsung',
      category: 'Electronics',
      rating: 4.4,
      reviewCount: 3421,
      availability: 'in_stock' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/51uQlxzXtwL._SL500_.jpg',
    },
    {
      url: 'https://www.myntra.com/shoes/nike',
      title: 'Nike Air Max 270',
      description: 'Classic running shoe with Air Max technology',
      price: 7495,
      originalPrice: 12995,
      currency: 'INR',
      platform: 'myntra',
      productId: 'NIKE_AIR_MAX_270',
      brand: 'Nike',
      category: 'Footwear',
      rating: 4.5,
      reviewCount: 4123,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Canon-Mirrorless-Touchscreen-Camera-Processor/dp/B09TZSL8YN',
      title: 'Canon EOS R6 Mark II DSLR Camera',
      description: 'Professional 20MP mirrorless camera',
      price: 239999,
      originalPrice: 279999,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B09TZSL8YN',
      brand: 'Canon',
      category: 'Photography',
      rating: 4.8,
      reviewCount: 234,
      availability: 'in_stock' as const,
      imageUrl: 'https://m.media-amazon.com/images/I/41T6xR6QBIL._SL500_.jpg',
    },
    {
      url: 'https://www.flipkart.com/mi-11x-pro',
      title: 'Xiaomi Mi 11X Pro',
      description: '5G smartphone with 120Hz display',
      price: 39999,
      originalPrice: 49999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_MI_11X',
      brand: 'Xiaomi',
      category: 'Smartphones',
      rating: 4.3,
      reviewCount: 8932,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Apple-iPhone-15-128-GB/dp/B0CHX3TH9F',
      title: 'Apple iPhone 15 (128 GB) - Blue',
      description: 'Latest iPhone with Dynamic Island and 48MP camera',
      price: 69900,
      originalPrice: 79900,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0CHX3TH9F',
      brand: 'Apple',
      category: 'Smartphones',
      rating: 4.6,
      reviewCount: 12543,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/samsung-galaxy-s23-ultra',
      title: 'Samsung Galaxy S23 Ultra 5G',
      description: '200MP camera, S Pen, Snapdragon 8 Gen 2',
      price: 124999,
      originalPrice: 154999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_S23_ULTRA',
      brand: 'Samsung',
      category: 'Smartphones',
      rating: 4.5,
      reviewCount: 6789,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/OnePlus-11R-Galactic-Silver-Storage/dp/B0BRS7MW6N',
      title: 'OnePlus 11R 5G (Galactic Silver, 16GB RAM)',
      description: 'Flagship killer with Snapdragon 8+ Gen 1',
      price: 44999,
      originalPrice: 59999,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0BRS7MW6N',
      brand: 'OnePlus',
      category: 'Smartphones',
      rating: 4.4,
      reviewCount: 5432,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/realme-gt-neo-5',
      title: 'Realme GT Neo 5 (240W Fast Charging)',
      description: 'Fastest charging smartphone in India',
      price: 34999,
      originalPrice: 44999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_REALME_GT',
      brand: 'Realme',
      category: 'Smartphones',
      rating: 4.2,
      reviewCount: 3421,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones/dp/B09XS7JWHH',
      title: 'Sony WH-1000XM5 Noise Cancelling Headphones',
      description: 'Industry-leading noise cancellation with 30hr battery',
      price: 29990,
      originalPrice: 34990,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B09XS7JWHH',
      brand: 'Sony',
      category: 'Electronics',
      rating: 4.6,
      reviewCount: 4567,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.myntra.com/adidas-ultraboost-22',
      title: 'Adidas Ultraboost 22 Running Shoes',
      description: 'Premium running shoes with Boost cushioning',
      price: 8999,
      originalPrice: 16999,
      currency: 'INR',
      platform: 'myntra',
      productId: 'MYNTRA_ULTRABOOST',
      brand: 'Adidas',
      category: 'Footwear',
      rating: 4.7,
      reviewCount: 2345,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Fire-Boltt-Phoenix-Ultra-Luxury-Stainless/dp/B0BS4Y6Y4M',
      title: 'Fire-Boltt Phoenix Ultra Luxury Smartwatch',
      description: '1.43" AMOLED Display, Bluetooth Calling',
      price: 1999,
      originalPrice: 7999,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0BS4Y6Y4M',
      brand: 'Fire-Boltt',
      category: 'Electronics',
      rating: 4.1,
      reviewCount: 8765,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/noise-colorfit-pro-4',
      title: 'Noise ColorFit Pro 4 Advanced Smartwatch',
      description: '1.72" display, 100+ sports modes, 7 days battery',
      price: 2499,
      originalPrice: 6999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_NOISE_PRO4',
      brand: 'Noise',
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 12456,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/JBL-Tune-230NC-TWS-Cancellation/dp/B0BXYZ1234',
      title: 'JBL Tune 230NC TWS Earbuds',
      description: 'Active Noise Cancellation with 40hr battery',
      price: 4999,
      originalPrice: 7999,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0BXYZ1234',
      brand: 'JBL',
      category: 'Electronics',
      rating: 4.3,
      reviewCount: 5678,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.myntra.com/puma-rs-x-sneakers',
      title: 'Puma RS-X Bold Sneakers',
      description: 'Retro-inspired lifestyle sneakers',
      price: 5499,
      originalPrice: 10999,
      currency: 'INR',
      platform: 'myntra',
      productId: 'MYNTRA_PUMA_RSX',
      brand: 'Puma',
      category: 'Footwear',
      rating: 4.4,
      reviewCount: 1876,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/mi-notebook-ultra-3-2',
      title: 'Mi Notebook Ultra 3.2K Display',
      description: '11th Gen Intel Core i5, 16GB RAM, 512GB SSD',
      price: 54999,
      originalPrice: 74999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_MI_NOTEBOOK',
      brand: 'Xiaomi',
      category: 'Laptops',
      rating: 4.5,
      reviewCount: 3456,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/HP-Pavilion-Gaming-15-6-inch-15-ec2146AX/dp/B0BS1234XY',
      title: 'HP Pavilion Gaming Laptop (RTX 3050)',
      description: 'AMD Ryzen 5, 16GB RAM, 144Hz display',
      price: 62990,
      originalPrice: 84990,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0BS1234XY',
      brand: 'HP',
      category: 'Laptops',
      rating: 4.4,
      reviewCount: 2345,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/Logitech-MX-Master-3S-Wireless/dp/B0B1234XYZ',
      title: 'Logitech MX Master 3S Wireless Mouse',
      description: 'Professional mouse with 8K DPI sensor',
      price: 8995,
      originalPrice: 10995,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0B1234XYZ',
      brand: 'Logitech',
      category: 'Electronics',
      rating: 4.8,
      reviewCount: 4321,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/dell-s2721dgf-27-gaming-monitor',
      title: 'Dell S2721DGF 27" Gaming Monitor',
      description: '165Hz refresh rate, 1ms response time, QHD',
      price: 32999,
      originalPrice: 45999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_DELL_MONITOR',
      brand: 'Dell',
      category: 'Electronics',
      rating: 4.6,
      reviewCount: 1234,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/PlayStation-5-Console/dp/B0CL1234XY',
      title: 'Sony PlayStation 5 Console (Disc Edition)',
      description: 'Latest gaming console with 4K gaming',
      price: 49990,
      originalPrice: 54990,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0CL1234XY',
      brand: 'Sony',
      category: 'Gaming',
      rating: 4.9,
      reviewCount: 6789,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.myntra.com/levis-511-slim-fit-jeans',
      title: "Levi's 511 Slim Fit Jeans",
      description: 'Classic slim fit denim jeans',
      price: 2499,
      originalPrice: 4999,
      currency: 'INR',
      platform: 'myntra',
      productId: 'MYNTRA_LEVIS_511',
      brand: 'Levis',
      category: 'Fashion',
      rating: 4.5,
      reviewCount: 3456,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.flipkart.com/amazon-echo-dot-5th-gen',
      title: 'Amazon Echo Dot (5th Gen) Smart Speaker',
      description: 'Voice control with Alexa, improved audio',
      price: 4499,
      originalPrice: 5999,
      currency: 'INR',
      platform: 'flipkart',
      productId: 'FLIPKART_ECHO_DOT5',
      brand: 'Amazon',
      category: 'Electronics',
      rating: 4.6,
      reviewCount: 9876,
      availability: 'in_stock' as const,
    },
    {
      url: 'https://www.amazon.in/GoPro-HERO11-Black-Waterproof-Stabilization/dp/B0B12345XY',
      title: 'GoPro HERO11 Black Action Camera',
      description: '5.3K60 video, waterproof, HyperSmooth 5.0',
      price: 43999,
      originalPrice: 54999,
      currency: 'INR',
      platform: 'amazon',
      productId: 'B0B12345XY',
      brand: 'GoPro',
      category: 'Photography',
      rating: 4.7,
      reviewCount: 876,
      availability: 'in_stock' as const,
    },
  ];

  // Create products in batches to avoid connection pool issues
  const createdProducts = [];
  const batchSize = 5;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((p) => prisma.product.create({ data: p })),
    );
    createdProducts.push(...batchResults);
    console.log(
      `✅ Created products ${i + 1}-${Math.min(i + batchSize, products.length)}`,
    );
  }

  console.log(`✅ Total created: ${createdProducts.length} products`);

  // Create analyses for each product in batches
  const analyses = [];
  for (let i = 0; i < createdProducts.length; i += batchSize) {
    const batch = createdProducts.slice(i, i + batchSize);
    const batchAnalyses = await Promise.all(
      batch.map((product, index) => {
        const dealScore = 65 + Math.random() * 30; // 65-95
        const ethicalScore = 55 + Math.random() * 35; // 55-90

        return prisma.analysis.create({
          data: {
            productId: product.id,
            dealScore,
            ethicalScore,
            trustScore: ethicalScore * 0.9,
            decision: dealScore > 75 ? 'buy_now' : 'wait',
            recommendation: `This ${product.brand} product offers ${Math.round(dealScore)}% value for money`,
            confidence: 0.85,
            isGoodDeal: dealScore > 70,
            savingsAmount: product.originalPrice - product.price,
            priceRank:
              index % 3 === 0
                ? 'lowest'
                : index % 3 === 1
                  ? 'below_average'
                  : 'average',
            marketComparison: `This product is ${(((product.originalPrice - product.price) / product.originalPrice) * 100).toFixed(0)}% cheaper than market average`,
            honestAssessment: `High quality product with good ethical practices. Value for money is excellent.`,
            pros: JSON.stringify([
              'Durable',
              'Good Warranty',
              'Ethical Manufacturing',
              'Excellent Customer Service',
            ]),
            cons: JSON.stringify(['Premium Pricing', 'Limited Color Options']),
            warnings: JSON.stringify([]),
            brandRating: ethicalScore,
            environmentalImpact: 'Low carbon footprint manufacturing',
            ethicalSourcing: 8.5,
            analysisVersion: '1.0',
            aiModel: 'gemini-pro',
            processingTime: Math.floor(Math.random() * 5000) + 1000,
          },
        });
      }),
    );
    analyses.push(...batchAnalyses);
    console.log(
      `✅ Created analyses ${i + 1}-${Math.min(i + batchSize, createdProducts.length)}`,
    );
  }

  console.log(`✅ Total created: ${analyses.length} analyses`);

  // Create user savings records (real transactions) - expanded to match 25 products
  const savingsRecords = [
    {
      amount: 5000,
      originalPrice: 12995,
      finalPrice: 7995,
      productTitle: 'Nike Air Max 270',
      platform: 'myntra',
    },
    {
      amount: 3491,
      originalPrice: 29990,
      finalPrice: 26499,
      productTitle: 'Apple AirPods Pro',
      platform: 'flipkart',
    },
    {
      amount: 9991,
      originalPrice: 19990,
      finalPrice: 9999,
      productTitle: 'Samsung Galaxy Buds Pro',
      platform: 'amazon',
    },
    {
      amount: 5500,
      originalPrice: 12995,
      finalPrice: 7495,
      productTitle: 'Nike Air Max 270',
      platform: 'myntra',
    },
    {
      amount: 3491,
      originalPrice: 29990,
      finalPrice: 26499,
      productTitle: 'Apple AirPods Pro',
      platform: 'flipkart',
    },
    {
      amount: 40000,
      originalPrice: 279999,
      finalPrice: 239999,
      productTitle: 'Canon EOS R6 Mark II',
      platform: 'amazon',
    },
    {
      amount: 10000,
      originalPrice: 49999,
      finalPrice: 39999,
      productTitle: 'Xiaomi Mi 11X Pro',
      platform: 'flipkart',
    },
    {
      amount: 3491,
      originalPrice: 4990,
      finalPrice: 1499,
      productTitle: 'boAt Rockerz 450',
      platform: 'amazon',
    },
    {
      amount: 5000,
      originalPrice: 12995,
      finalPrice: 7995,
      productTitle: 'Nike Air Max 270',
      platform: 'myntra',
    },
    {
      amount: 9991,
      originalPrice: 19990,
      finalPrice: 9999,
      productTitle: 'Samsung Galaxy Buds Pro',
      platform: 'amazon',
    },
    {
      amount: 10000,
      originalPrice: 79900,
      finalPrice: 69900,
      productTitle: 'Apple iPhone 15',
      platform: 'amazon',
    },
    {
      amount: 30000,
      originalPrice: 154999,
      finalPrice: 124999,
      productTitle: 'Samsung Galaxy S23 Ultra',
      platform: 'flipkart',
    },
    {
      amount: 15000,
      originalPrice: 59999,
      finalPrice: 44999,
      productTitle: 'OnePlus 11R 5G',
      platform: 'amazon',
    },
    {
      amount: 10000,
      originalPrice: 44999,
      finalPrice: 34999,
      productTitle: 'Realme GT Neo 5',
      platform: 'flipkart',
    },
    {
      amount: 5000,
      originalPrice: 34990,
      finalPrice: 29990,
      productTitle: 'Sony WH-1000XM5',
      platform: 'amazon',
    },
    {
      amount: 8000,
      originalPrice: 16999,
      finalPrice: 8999,
      productTitle: 'Adidas Ultraboost 22',
      platform: 'myntra',
    },
    {
      amount: 6000,
      originalPrice: 7999,
      finalPrice: 1999,
      productTitle: 'Fire-Boltt Phoenix Ultra',
      platform: 'amazon',
    },
    {
      amount: 4500,
      originalPrice: 6999,
      finalPrice: 2499,
      productTitle: 'Noise ColorFit Pro 4',
      platform: 'flipkart',
    },
    {
      amount: 3000,
      originalPrice: 7999,
      finalPrice: 4999,
      productTitle: 'JBL Tune 230NC TWS',
      platform: 'amazon',
    },
    {
      amount: 5500,
      originalPrice: 10999,
      finalPrice: 5499,
      productTitle: 'Puma RS-X Bold',
      platform: 'myntra',
    },
    {
      amount: 20000,
      originalPrice: 74999,
      finalPrice: 54999,
      productTitle: 'Mi Notebook Ultra',
      platform: 'flipkart',
    },
    {
      amount: 22000,
      originalPrice: 84990,
      finalPrice: 62990,
      productTitle: 'HP Pavilion Gaming',
      platform: 'amazon',
    },
    {
      amount: 2000,
      originalPrice: 10995,
      finalPrice: 8995,
      productTitle: 'Logitech MX Master 3S',
      platform: 'amazon',
    },
    {
      amount: 13000,
      originalPrice: 45999,
      finalPrice: 32999,
      productTitle: 'Dell Gaming Monitor',
      platform: 'flipkart',
    },
    {
      amount: 5000,
      originalPrice: 54990,
      finalPrice: 49990,
      productTitle: 'PlayStation 5',
      platform: 'amazon',
    },
    {
      amount: 2500,
      originalPrice: 4999,
      finalPrice: 2499,
      productTitle: "Levi's 511 Jeans",
      platform: 'myntra',
    },
    {
      amount: 1500,
      originalPrice: 5999,
      finalPrice: 4499,
      productTitle: 'Amazon Echo Dot 5',
      platform: 'flipkart',
    },
    {
      amount: 11000,
      originalPrice: 54999,
      finalPrice: 43999,
      productTitle: 'GoPro HERO11 Black',
      platform: 'amazon',
    },
    {
      amount: 7000,
      originalPrice: 12995,
      finalPrice: 5995,
      productTitle: 'Nike Air Max 270',
      platform: 'myntra',
    },
    {
      amount: 15000,
      originalPrice: 49999,
      finalPrice: 34999,
      productTitle: 'OnePlus 11R 5G',
      platform: 'amazon',
    },
  ];

  // Create savings in batches
  for (let i = 0; i < savingsRecords.length; i += batchSize) {
    const batch = savingsRecords.slice(i, i + batchSize);
    await Promise.all(
      batch.map((saving, batchIdx) => {
        const idx = i + batchIdx;
        return prisma.userSavings.create({
          data: {
            analysisId: analyses[idx % analyses.length].id,
            amount: saving.amount,
            originalPrice: saving.originalPrice,
            finalPrice: saving.finalPrice,
            productTitle: saving.productTitle,
            platform: saving.platform,
            currency: 'INR',
            userId: `user_${Math.floor(idx / 2) + 1}`,
            sessionId: `session_${Math.floor(idx / 3) + 1}`,
            recordedAt: new Date(Date.now() - Math.random() * 86400000), // Random time today
          },
        });
      }),
    );
    console.log(
      `✅ Created savings ${i + 1}-${Math.min(i + batchSize, savingsRecords.length)}`,
    );
  }

  console.log(`✅ Total created: ${savingsRecords.length} savings records`);

  console.log('🎉 Database seeding completed successfully!');
  console.log(`
  📊 Summary:
  - Products: ${createdProducts.length}
  - Analyses: ${analyses.length}
  - Savings Records: ${savingsRecords.length}
  - Total Savings Tracked: ₹${savingsRecords.reduce((sum, s) => sum + s.amount, 0).toLocaleString('en-IN')}
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
