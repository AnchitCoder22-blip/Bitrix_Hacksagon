import { motion } from 'framer-motion';

export default function LoadingSkeleton({ width = '100%', height = 20, borderRadius = 8, count = 1, style = {} }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.1 }}
          style={{
            width,
            height,
            borderRadius,
            background: 'linear-gradient(90deg, #e2e8f0 25%, #f1f5f9 50%, #e2e8f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            ...style,
          }}
        />
      ))}
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div style={{
      background: 'white', borderRadius: 20, padding: 24,
      boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
    }}>
      <LoadingSkeleton width="40%" height={24} borderRadius={8} />
      <div style={{ marginTop: 16 }}>
        <LoadingSkeleton count={3} height={16} borderRadius={6} />
      </div>
      <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
        <LoadingSkeleton width={100} height={36} borderRadius={10} />
        <LoadingSkeleton width={100} height={36} borderRadius={10} />
      </div>
    </div>
  );
}
