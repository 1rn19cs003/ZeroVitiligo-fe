"use client";
import styles from './styles.module.css';

export default function Button({
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
    console.log('Get Started clicked');
  };

  const variantClass =
    variant === 'secondary' ? styles.secondaryButton : styles.primaryButton;

  const combined = `${styles.heroButton} ${variantClass} ${className}`.trim();

  return (
    <button
      type="button"
      className={combined}
      onClick={handleClick}
      {...props}
    >
      {text}
    </button>
  );
}