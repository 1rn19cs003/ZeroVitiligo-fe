"use client";
import React from "react";
import SectionTemplate from "@/components/SectionTemplate";
import styles from "./styles.module.css";
import { useLanguage } from "@/hooks/useLanguage";
import { useRouter } from "next/navigation";

export default function TreatmentPage() {
    const { t } = useLanguage();
    const router = useRouter();

    const sections = [
        {
            id: "inspection-diagnosis",
            title: t('treatment.inspection.title'),
            paragraphs: t('treatment.inspection.paragraphs'),
            highlights: t('treatment.inspection.highlights')
        },
        {
            id: "personalized-treatment",
            title: t('treatment.personalized.title'),
            paragraphs: t('treatment.personalized.paragraphs'),
            highlights: t('treatment.personalized.highlights')
        },
        {
            id: "diet-lifestyle-guidance",
            title: t('treatment.diet.title'),
            paragraphs: t('treatment.diet.paragraphs'),
            highlights: t('treatment.diet.highlights')
        }
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>{t('treatment.pageTitle')}</h1>
                <p>
                    {t('treatment.pageSubtitle')}
                </p>
            </header>

            {sections.map((section, i) => (
                <SectionTemplate id={section.id} key={i} {...section} />
            ))}

            <footer className={styles.ctaSection}>
                <h2>{t('treatment.cta.title')}</h2>
                <p>
                    {t('treatment.cta.subtitle')}
                </p>
                <button
                    onClick={() => { router.push("/contact") }}
                    className={styles.ctaButton}>{t('treatment.cta.button')}</button>
            </footer>
        </main>
    );
}

