export default function Button({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // primary, secondary, danger, neutral, outline
  size = 'medium', // small, medium, large
  disabled = false,
  fullWidth = false,
  className = '',
  ...props
}) {
  const baseStyles = 'font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition ease-in-out duration-150';
  
  // Updated variantStyles to include gradients
  const variantStyles = {
    primary: 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 focus:ring-blue-500 border border-transparent',
    secondary: 'bg-gradient-to-r from-pink-500 to-pink-700 text-white hover:from-pink-600 hover:to-pink-800 focus:ring-pink-500 border border-transparent',
    danger: 'bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 focus:ring-red-500 border border-transparent',
    neutral: 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 border border-gray-300',
    outline: 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50 hover:text-blue-700 focus:ring-blue-500',
  };

  const sizeStyles = {
    small: 'px-3 py-1.5 text-xs',
    medium: 'px-4 py-2 text-sm',
    large: 'px-6 py-3 text-base',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? disabledStyles : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
