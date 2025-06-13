const Spinner = ({ className = 'w-6 h-6', color = 'text-primary' }) => {
  return (
    <div className={`animate-spin rounded-full border-4 border-solid border-r-transparent ${color} ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;