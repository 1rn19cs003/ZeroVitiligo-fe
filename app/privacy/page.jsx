"use client";

import styles from "./styles.module.css";
import BackButton from "@/components/BackButton";
import { useLanguage } from "@/hooks/useLanguage";

export default function PrivacyPage() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <BackButton />

            <div className={styles.content}>
                <h1 className={styles.title}>{t('privacy.title')}</h1>
                <p className={styles.lastUpdated}>{t('privacy.lastUpdated')}: November 27, 2025</p>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.intro.title')}</h2>
                    <p>{t('privacy.sections.intro.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.collection.title')}</h2>
                    <h3>{t('privacy.sections.collection.subtitle')}</h3>

                    <h3>{t('privacy.sections.collection.personal.title')}</h3>
                    <ul>
                        {t('privacy.sections.collection.personal.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>

                    <h3>{t('privacy.sections.collection.medical.title')}</h3>
                    <ul>
                        {t('privacy.sections.collection.medical.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>

                    <h3>{t('privacy.sections.collection.usage.title')}</h3>
                    <ul>
                        {t('privacy.sections.collection.usage.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.usage.title')}</h2>
                    <p>{t('privacy.sections.usage.content')}</p>
                    <ul>
                        {t('privacy.sections.usage.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.sharing.title')}</h2>
                    <p>{t('privacy.sections.sharing.content')}</p>
                    <ul>
                        {t('privacy.sections.sharing.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.security.title')}</h2>
                    <div className={styles.important}>
                        <p>
                            <strong>{t('common.important')}:</strong> {t('privacy.sections.security.note')}
                        </p>
                    </div>
                    <ul>
                        {t('privacy.sections.security.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.retention.title')}</h2>
                    <p>{t('privacy.sections.retention.content')}</p>
                    <ul>
                        {t('privacy.sections.retention.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.rights.title')}</h2>
                    <p>{t('privacy.sections.rights.content')}</p>
                    <ul>
                        {t('privacy.sections.rights.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                    <p>{t('privacy.sections.rights.contact')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.cookies.title')}</h2>
                    <p>{t('privacy.sections.cookies.content')}</p>
                    <ul>
                        {t('privacy.sections.cookies.points').map((point, index) => (
                            <li key={index}>{point}</li>
                        ))}
                    </ul>
                    <p>{t('privacy.sections.cookies.control')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.children.title')}</h2>
                    <p>{t('privacy.sections.children.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.international.title')}</h2>
                    <p>{t('privacy.sections.international.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.changes.title')}</h2>
                    <p>{t('privacy.sections.changes.content')}</p>
                </section>

                <section className={styles.section}>
                    <h2>{t('privacy.sections.contact.title')}</h2>
                    <p>{t('privacy.sections.contact.content')}</p>
                    <div className={styles.contactInfo}>
                        <p><strong>ZeroVitiligo</strong></p>
                        <p>{t('privacy.sections.contact.address')}</p>
                        <p>{t('privacy.sections.contact.email')}</p>
                        <p>{t('privacy.sections.contact.phone')}</p>
                    </div>
                </section>
            </div>
        </div>
    );
}

