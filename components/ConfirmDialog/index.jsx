"use client";
import { useState } from 'react';
import styles from './styles.module.css';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "danger" // "danger" or "warning"
}) {
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await onConfirm();
            onClose();
        } catch (error) {
            console.error('Confirmation action failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget && !isLoading) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleBackdropClick}>
            <div className={styles.dialog}>
                <button
                    className={styles.closeButton}
                    onClick={onClose}
                    disabled={isLoading}
                    aria-label="Close dialog"
                >
                    <X size={20} />
                </button>

                <div className={styles.iconWrapper}>
                    <AlertTriangle
                        size={48}
                        className={variant === 'danger' ? styles.dangerIcon : styles.warningIcon}
                    />
                </div>

                <h2 className={styles.title}>{title}</h2>
                <p className={styles.message}>{message}</p>

                <div className={styles.actions}>
                    <button
                        className={styles.cancelButton}
                        onClick={onClose}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </button>
                    <button
                        className={`${styles.confirmButton} ${variant === 'danger' ? styles.danger : styles.warning}`}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
}
