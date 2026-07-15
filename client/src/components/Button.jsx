import React from 'react';
import './Button.css';

/**
 * Reusable Button component for UCAB.
 *
 * Variants: 'primary' | 'ghost' | 'outline' | 'danger'
 * Sizes:    'sm' | 'md' | 'lg'
 */
function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  icon = null,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  const classes = [
    'ucab-btn',
    `ucab-btn-${variant}`,
    `ucab-btn-${size}`,
    fullWidth ? 'ucab-btn-full' : '',
    loading ? 'ucab-btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <span className="ucab-btn-spinner" aria-hidden="true" />
      ) : (
        <>
          {icon && <span className="ucab-btn-icon">{icon}</span>}
          <span className="ucab-btn-label">{children}</span>
        </>
      )}
    </button>
  );
}

export default Button;