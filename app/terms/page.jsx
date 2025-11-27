"use client";

import styles from "./styles.module.css";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/hooks/useLanguage";

export default function TermsPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <BackButton />

            <div className={styles.content}>
                <h1 className={styles.title}>{t('terms.title')}</h1>
                <p className={styles.lastUpdated}>{t('terms.lastUpdated')}: November 27, 2025</p>

                <section className={styles.section}>
                    <h2>{t('terms.sections.acceptance.title')}</h2>
                    <p>{t('terms.sections.acceptance.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.medicalDisclaimer.title')}</h2>
                    <div className={styles.important}>
                        <p>
                            <strong>{t('common.important')}:</strong> {t('terms.sections.medicalDisclaimer.content')}
                        </p>
                    </div>
                    <ul>
                        {t('terms.sections.medicalDisclaimer.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.services.title')}</h2>
                    <p>{t('terms.sections.services.content')}</p>
                    <ul>
                        {t('terms.sections.services.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.userResponsibilities.title')}</h2>
                    <p>{t('terms.sections.userResponsibilities.content')}</p>
                    <ul>
                        {t('terms.sections.userResponsibilities.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.appointments.title')}</h2>
                    <ul>
                        {t('terms.sections.appointments.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.payment.title')}</h2>
                    <ul>
                        {t('terms.sections.payment.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.intellectualProperty.title')}</h2>
                    <p>{t('terms.sections.intellectualProperty.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.limitation.title')}</h2>
                    <p>{t('terms.sections.limitation.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.privacy.title')}</h2>
                    <p>{t('terms.sections.privacy.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.changes.title')}</h2>
                    <p>{t('terms.sections.changes.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.governing.title')}</h2>
                    <p>{t('terms.sections.governing.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('terms.sections.contact.title')}</h2>
                    <p>{t('terms.sections.contact.content')}</p>
                    <div className={styles.contactInfo}>
                        <p><strong>ZeroVitiligo</strong></p>
                        <p>{t('terms.sections.contact.address')}</p>
                        <p>{t('terms.sections.contact.email')}</p>
                        <p>{t('terms.sections.contact.phone')}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

