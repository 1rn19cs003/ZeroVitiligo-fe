"use client";
import { memo, useMemo } from 'react';
import styles from './styles.module.css';

function Button({
  text = 'New Button',
  onClick,
  variant = 'primary', // 'primary' | 'secondary'
  className = '',
  ...props
}) {
  const handleClick = (e) => {
    if (typeof onClick === 'function') {
      onClick(e);
      return;
    }
    console.log('Button clicked');
  };

  // Memoize class name computation
  const buttonClassName = useMemo(() => {
    const variantClass =
      variant === 'secondary' ? styles.secondaryButton : styles.primaryButton;
    return `${styles.heroButton} ${variantClass} ${className}`.trim();
  }, [variant, className]);

  return (
    <button
      type="button"
      className={buttonClassName}
      onClick={handleClick}
      {...props}
    >
      {text}
    </button>
  );
}

export default memo(Button);