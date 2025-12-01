'use client';
import { getRoleConfig } from '@/lib/constants';
import styles from './styles.module.css';


export default function RoleBadge({
    role,
    size = 'md',
    className = '',
    showDot = true
}) {
    const config = getRoleConfig(role);

    const sizeClass = {
        sm: styles.sizeSm,
        md: styles.sizeMd,
        lg: styles.sizeLg
    }[size];

    return (
        <span
            className={`
        ${styles.badge}
        ${sizeClass}
        ${className}
      `}
            style={{
                backgroundColor: config.bgColor,
                color: config.textColor,
                borderColor: `${config.color}20`
            }}
        >
            {showDot && (
                <span
                    className={styles.dot}
                    style={{ backgroundColor: config.color }}
                />
            )}
            {config.label}
        </span>
    );
}