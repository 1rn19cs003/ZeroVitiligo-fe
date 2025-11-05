"use client";
import React from "react";
import styles from "./styles.module.css";
import { CheckCircle } from "lucide-react";

export default function RegistrationSuccess({ registeredId, onBack }) {
    return (
        <div className={styles.successContainer}>
            <div className={styles.card}>
                <CheckCircle className={styles.icon} />
                <h2 >Registration Successful 🎉</h2>
                <p>Your unique registration ID is:</p>
                <div className={styles.idBox}>{registeredId}</div>
                <p className={styles.note}>
                    Please keep this ID safe — it will be required for future communication.
                </p>
                <button onClick={onBack} className={styles.backBtn}>
                    Register Another User or Go Back
                </button>
            </div>
        </div>
    );
}
