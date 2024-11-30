export default function FuturisticCard({ children, className = '' }) {
  return (
    <div className="relative">
      {/* Corners */}
      <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00ffbd]" />
      <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00ffbd]" />
      <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00ffbd]" />
      <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00ffbd]" />

      {/* Main container */}
      <div className={`bg-white dark:bg-[#0a0b0f] rounded-xl p-6 ${className}`}>
        {children}
      </div>
    </div>
  );
} 