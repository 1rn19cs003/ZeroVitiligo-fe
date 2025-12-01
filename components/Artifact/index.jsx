"use client";
import { useState } from 'react';
import styles from './styles.module.css';
import LogoImage from "@/public/images/NewLogo.svg";
import Image from 'next/image';
import { useLanguage } from '@/hooks/useLanguage';

export default function Artifact() {
    const [activeIndex, setActiveIndex] = useState(null);
    const { t } = useLanguage();

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqKeys = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];

    return (
        <section id='faq' className={styles.faqContainer}>
            <h1 className={styles.title}>{t('faq.title')}</h1>
            <div className={styles.faqWrapper}>
                <div className={styles.faqList}>
                    {faqKeys.map((key, index) => {
                        const answer = t(`faq.${key}.answer`);
                        return (
                            <div key={index} className={styles.faqItem}>
                                <button
                                    className={`${styles.questionButton} ${activeIndex === index ? styles.active : ''}`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <span className={styles.questionIcon}>?</span>
                                    <span className={styles.questionText}>{t(`faq.${key}.question`)}</span>
                                    <span className={styles.chevron}>
                                        {activeIndex === index ? '−' : '+'}
                                    </span>
                                </button>
                                <div className={`${styles.answerBox} ${activeIndex === index ? styles.answerActive : ''}`}>
                                    <div className={styles.answerContent}>
                                        {answer.p1 && <p>{answer.p1}</p>}
                                        {answer.list && (
                                            <ul>
                                                {answer.list.map((item, i) => (
                                                    <li key={i}>{item}</li>
                                                ))}
                                            </ul>
                                        )}
                                        {answer.p2 && <p>{answer.p2}</p>}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={`${styles.logoPlaceholder} ${activeIndex !== null ? styles.hidden : ''}`}>
                    <div className={styles.logoContainer}>
                        <Image
                            src={LogoImage}
                            alt="Zero Vitiligo Logo"
                            className={styles.logo3d}
                        />
                        <div className={styles.floatingText}>
                            <h3>{t('faq.placeholder.title')}</h3>
                            <p>{t('faq.placeholder.subtitle')}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
