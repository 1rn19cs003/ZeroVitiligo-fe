"use client";
import React from "react";
import SectionTemplate from "@/components/SectionTemplate";
import styles from "./styles.module.css";

export default function TreatmentPage() {
    const sections = [
        {
            id: "inspection-diagnosis",
            title: "Inspection & Diagnosis",
            paragraphs: [
                "Our comprehensive diagnostic process starts with a detailed skin assessment to understand your vitiligo pattern, progression, and triggers.",
                "We use advanced tools and consultations to identify underlying causes, ensuring your treatment is both targeted and effective."
            ],
            highlights: [
                "Skin mapping and digital analysis",
                "Detailed consultation with dermatologists",
                "Identifying stress and immune triggers",
                "Creating your skin progress baseline"
            ]
        },
        {
            id: "personalized-treatment",
            title: "Personalized Treatment Plans",
            paragraphs: [
                "Each individual’s journey with vitiligo is unique. Our team designs custom treatment plans based on your diagnosis, medical history, and preferences.",
                "We combine medical therapies with natural healing approaches to restore balance and confidence."
            ],
            highlights: [
                "Tailored phototherapy schedules",
                "Natural pigment restoration",
                "AI-driven progress tracking",
                "Monthly dermatologist feedback"
            ]
        },
        {
            id: "diet-lifestyle-guidance",
            title: "Diet & Lifestyle Guidance",
            paragraphs: [
                "Healing extends beyond treatment — our nutritionists and counselors help you build healthy daily habits.",
                "A balanced diet, stress management, and mindful practices support your skin and overall well-being."
            ],
            highlights: [
                "Personalized diet charts",
                "Mind-body relaxation techniques",
                "Sleep and hydration monitoring",
                "Immune system support guidance"
            ]
        }
    ];

    return (
        <main className={styles.main}>
            <header className={styles.header}>
                <h1>Your Personalized Path to Healing</h1>
                <p>
                    Discover a holistic approach to vitiligo care — from accurate
                    diagnosis to lasting lifestyle changes.
                </p>
            </header>

            {sections.map((section, i) => (
                <SectionTemplate id={section.id} key={i} {...section} />
            ))}

            <footer className={styles.ctaSection}>
                <h2>Begin Your Healing Journey Today 🌿</h2>
                <p>
                    Connect with our specialists and start your personalized vitiligo care plan.
                </p>
                <button className={styles.ctaButton}>Book Free Consultation</button>
            </footer>
        </main>
    );
}
