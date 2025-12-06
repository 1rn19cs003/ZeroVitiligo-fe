"use client";

import React from 'react';
import { useStateLoadingStore } from '@/store/useStatesStore';
import styles from './styles.module.css';

export default function GlobalLoader() {
    const { loadingCount, loadingMessage } = useStateLoadingStore();
    const isLoading = loadingCount > 0;

    if (!isLoading) return null;

    return (
        <div className={styles.overlay} role="alert" aria-live="assertive" aria-busy="true">
            <div className={styles.content}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={styles.spinner}
                    width={64}
                    height={64}
                    viewBox="0 0 100 100"
                    preserveAspectRatio="xMidYMid"
                >
                    <circle
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="10"
                        r="35"
                        strokeDasharray="164.93361431346415 56.97787143782138"
                    >
                        <animateTransform
                            attributeName="transform"
                            type="rotate"
                            repeatCount="indefinite"
                            dur="1s"
                            values="0 50 50;360 50 50"
                            keyTimes="0;1"
                        />
                    </circle>
                </svg>
                {loadingMessage && (
                    <p className={styles.message}>{loadingMessage}</p>
                )}
            </div>
        </div>
    );
}
