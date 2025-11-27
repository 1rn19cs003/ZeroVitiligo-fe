"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Shield, FileText } from "lucide-react";
import styles from "./styles.module.css";

export default function ConsentModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        // Check if user has already accepted
        const hasAccepted = localStorage.getItem("termsAccepted");

        if (!hasAccepted) {
            // Small delay for smooth animation
            setTimeout(() => setIsVisible(true), 500);
        }
    }, []);

    const handleAccept = () => {
        setIsClosing(true);
        setTimeout(() => {
            localStorage.setItem("termsAccepted", "true");
            localStorage.setItem("termsAcceptedDate", new Date().toISOString());
            setIsVisible(false);
        }, 300);
    };

    const handleDecline = () => {
        // Optionally redirect or show a message
        alert("You must accept our Terms and Privacy Policy to use our services.");
    };

    if (!isVisible) return null;

    return (
        <div className={`${styles.overlay} ${isClosing ? styles.closing : ""}`}>
            <div className={`${styles.modal} ${isClosing ? styles.modalClosing : ""}`}>
                <div className={styles.header}>
                    <Shield className={styles.icon} size={48} />
                    <h2 className={styles.title}>Welcome to ZeroVitiligo</h2>
                </div>

                <div className={styles.content}>
                    <p className={styles.intro}>
                        Before you continue, please take a moment to review and accept our Terms and Conditions and Privacy Policy.
                    </p>

                    <div className={styles.infoCards}>
                        <div className={styles.card}>
                            <FileText size={24} className={styles.cardIcon} />
                            <h3>Terms & Conditions</h3>
                            <p>
                                Our terms outline the medical services we provide, your responsibilities as a patient, and important disclaimers about vitiligo treatment.
                            </p>
                            <Link href="/terms" target="_blank" className={styles.link}>
                                Read Terms & Conditions →
                            </Link>
                        </div>

                        <div className={styles.card}>
                            <Shield size={24} className={styles.cardIcon} />
                            <h3>Privacy Policy</h3>
                            <p>
                                We are committed to protecting your personal and medical information. Learn how we collect, use, and safeguard your data.
                            </p>
                            <Link href="/privacy" target="_blank" className={styles.link}>
                                Read Privacy Policy →
                            </Link>
                        </div>
                    </div>

                    <div className={styles.disclaimer}>
                        <p>
                            <strong>Important:</strong> By accepting, you acknowledge that you have read and understood our Terms and Privacy Policy, and you consent to the collection and use of your information as described.
                        </p>
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleDecline} className={styles.declineButton}>
                        Decline
                    </button>
                    <button onClick={handleAccept} className={styles.acceptButton}>
                        Accept & Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
