import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  onClick, 
  type = 'button', 
  variant = 'primary', 
  className = '', 
  disabled = false,
  isLoading = false,
  icon: Icon
}) => {
  const variants = {
    primary: 'btn-premium',
    outline: 'btn-premium-outline',
    ghost: 'bg-transparent text-babyPink hover:bg-babyPink/10 px-6 py-3 rounded-full font-semibold transition-all duration-300',
    danger: 'bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md'
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} flex items-center justify-center gap-2`}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-3 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {Icon && <Icon size={18} />}
          {children}
        </>
      )}
    </motion.button>
  );
};

export default Button;
