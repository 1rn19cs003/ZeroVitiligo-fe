"use client";
import React from "react";
import styles from "./styles.module.css";
import { CheckCircle } from "lucide-react";
import { useLanguage } from '@/hooks/useLanguage';

export default function RegistrationSuccess({ registeredId, onBack }) {
    const { t } = useLanguage();

    return (
        <div className={styles.successContainer}>
            <div className={styles.card}>
                <CheckCircle className={styles.icon} />
                <h2>{t('registrationSuccess.title')}</h2>
                <p>{t('registrationSuccess.idLabel')}</p>
                <div className={styles.idBox}>{registeredId}</div>
                <p className={styles.note}>
                    {t('registrationSuccess.note')}
                </p>
                <button onClick={onBack} className={styles.backBtn}>
                    {t('registrationSuccess.backButton')}
                </button>
            </div>
        </div>
    );
}
