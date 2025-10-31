"use client";
import { useState } from 'react';
import styles from './styles.module.css';
import LogoImage from "@/public/images/NewLogo.svg";
import Image from 'next/image';
import { FAQ_DATA } from '../Miscellaneous';

export default function Artifact() {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleAccordion = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section id='faq' className={styles.faqContainer}>
            <h1 className={styles.title}>Common Questions</h1>
            <div className={styles.faqWrapper}>
                <div className={styles.faqList}>
                    {FAQ_DATA.map((item, index) => (
                        <div key={index} className={styles.faqItem}>
                            <button
                                className={`${styles.questionButton} ${activeIndex === index ? styles.active : ''}`}
                                onClick={() => toggleAccordion(index)}
                            >
                                <span className={styles.questionIcon}>?</span>
                                <span className={styles.questionText}>{item.question}</span>
                                <span className={styles.chevron}>
                                    {activeIndex === index ? '−' : '+'}
                                </span>
                            </button>
                            <div className={`${styles.answerBox} ${activeIndex === index ? styles.answerActive : ''}`}>
                                <div className={styles.answerContent}>
                                    {item.answer}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={`${styles.logoPlaceholder} ${activeIndex !== null ? styles.hidden : ''}`}>
                    <div className={styles.logoContainer}>
                        <Image
                            src={LogoImage}
                            alt="Zero Vitiligo Logo"
                            className={styles.logo3d}
                        />
                        <div className={styles.floatingText}>
                            <h3>Select a question to view the answer</h3>
                            <p>Click on any question from the list to get detailed information</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
