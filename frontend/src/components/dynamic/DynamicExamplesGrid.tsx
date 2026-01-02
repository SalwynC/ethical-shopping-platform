'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { InteractiveExampleCard } from './InteractiveExampleCard';

interface DynamicExamplesGridProps {
  selectedExample: string | null;
  onExampleSelect: (example: string) => void;
  isAnalyzing: boolean;
}

interface ExampleProduct {
  id: string;
  name: string;
  priceScore: number;
  reviewTrust: number;
  ethicsScore: number;
  priceLabel: string;
  reviewStatus: string;
  ethicsRating: string;
  color: string;
  url: string;
  insight: string;
}

const exampleProducts = [
  {
    id: 'nike-sneakers',
    name: 'Nike Air Max 270',
    priceScore: 85,
    reviewTrust: 92,
    ethicsScore: 73,
    priceLabel: 'Good price',
    reviewStatus: 'Mostly genuine',
    ethicsRating: 'Improving',
    color: '#16A085',
    url: 'https://www.nike.com/t/air-max-270-mens-shoes',
    insight: 'Popular choice - price matches other retailers',
  },
  {
    id: 'samsung-phone',
    name: 'Samsung Galaxy S24',
    priceScore: 78,
    reviewTrust: 88,
    ethicsScore: 81,
    priceLabel: 'Market average',
    reviewStatus: 'Trustworthy',
    ethicsRating: 'Good practices',
    color: '#2ECC71',
    url: 'https://www.samsung.com/us/mobile/galaxy-s24',
    insight: 'Solid choice - ethical manufacturing',
  },
  {
    id: 'cheap-headphones',
    name: 'Generic Bluetooth Headphones',
    priceScore: 45,
    reviewTrust: 34,
    ethicsScore: 28,
    priceLabel: 'Suspiciously cheap',
    reviewStatus: 'Many fake reviews',
    ethicsRating: 'Concerning',
    color: '#E67E22',
    url: 'https://www.example-marketplace.com/headphones',
    insight: 'Red flags - consider alternatives',
  },
];

export function DynamicExamplesGrid({
  selectedExample,
  onExampleSelect,
  isAnalyzing,
}: DynamicExamplesGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
      <AnimatePresence>
        {exampleProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ y: 40, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.9 }}
            whileHover={{
              y: -12,
              scale: 1.03,
              rotateX: 3,
              rotateY: 1,
              transition: {
                type: 'spring',
                stiffness: 400,
                damping: 25,
                duration: 0.4,
              },
            }}
            whileTap={{
              scale: 0.97,
              transition: { duration: 0.1 },
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            style={{
              transformStyle: 'preserve-3d',
              transformOrigin: 'center center',
            }}
            className="h-full cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/30 rounded-3xl"
            tabIndex={0}
            layout
          >
            <div className="h-full relative">
              {/* Glow effect on hover */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 rounded-3xl blur-lg opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <InteractiveExampleCard
                product={product}
                isSelected={selectedExample === product.id}
                onSelect={() => onExampleSelect(product.id)}
                isAnalyzing={isAnalyzing && selectedExample === product.id}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
