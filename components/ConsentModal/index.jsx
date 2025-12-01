"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, FileText } from "lucide-react";
import styles from "./styles.module.css";
import { useLanguage } from "@/hooks/useLanguage";

export default function ConsentModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const pathname = usePathname();
    const { t } = useLanguage();

    useEffect(() => {
        if (pathname === "/terms" || pathname === "/privacy") {
            return;
        }

        const hasAccepted = localStorage.getItem("termsAccepted");

        if (!hasAccepted) {
            setTimeout(() => setIsVisible(true), 500);
        }
    }, [pathname]);

    const handleAccept = () => {
        setIsClosing(true);
        setTimeout(() => {
            localStorage.setItem("termsAccepted", "true");
            localStorage.setItem("termsAcceptedDate", new Date().toISOString());
            setIsVisible(false);
        }, 300);
    };

    const handleDecline = () => {
        alert(t('consent.declineMessage'));
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}>
            <div className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}>
                <div className={styles.header}>
                    <Shield className={styles.icon} size={48} />
                    <h2 className={styles.title}>{t('consent.title')}</h2>
                </div>

                <div className={styles.content}>
                    <p className={styles.intro}>
                        {t('consent.intro')}
                    </p>

                    <div className={styles.infoCards}>
                        <div className={styles.card}>
                            <FileText size={24} className={styles.cardIcon} />
                            <h3>{t('consent.termsCard.title')}</h3>
                            <p>
                                {t('consent.termsCard.description')}
                            </p>
                            <Link href="/terms" target="_blank" className={styles.link}>
                                {t('consent.termsCard.link')}
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <Shield size={24} className={styles.cardIcon} />
                            <h3>{t('consent.privacyCard.title')}</h3>
                            <p>
                                {t('consent.privacyCard.description')}
                            </p>
                            <Link href="/privacy" target="_blank" className={styles.link}>
                                {t('consent.privacyCard.link')}
                            </Link>
                        </div>
                    </div>

                    <div className={styles.disclaimer}>
                        <p>
                            <strong>{t('common.important')}:</strong> {t('consent.disclaimer')}
                        </p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleDecline} className={styles.declineButton}>
                        {t('consent.declineButton')}
                    </button>
                    <button onClick={handleAccept} className={styles.acceptButton}>
                        {t('consent.acceptButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}
