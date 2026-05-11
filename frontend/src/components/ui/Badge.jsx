const Badge = ({ variant = 'default', children, icon: Icon, className = '' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600 border-slate-200',
    waiting: 'bg-status-waiting text-amber-700 border-amber-200',
    confirmed: 'bg-status-confirmed text-blue-700 border-blue-200',
    preparing: 'bg-status-preparing text-orange-700 border-orange-200',
    shipped: 'bg-status-shipped text-purple-700 border-purple-200',
    delivered: 'bg-status-delivered text-emerald-700 border-emerald-200',
    cancelled: 'bg-status-cancelled text-red-700 border-red-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    user: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
};

export default Badge;
