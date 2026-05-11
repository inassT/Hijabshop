import { motion } from 'framer-motion';

const Card = ({ children, className = '', hoverEffect = true, glass = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverEffect ? { y: -5, shadow: '0 20px 40px rgba(248, 187, 208, 0.2)' } : {}}
      className={`
        ${glass ? 'glass-panel' : 'premium-card'}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default Card;
