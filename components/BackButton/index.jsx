"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import styles from "./styles.module.css";

const BackButton = ({ label = "Back", onClick, className = "" }) => {
    const router = useRouter();

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            router.back();
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`${styles.backButton} ${className}`}
            type="button"
        >
            <ArrowLeft className={styles.backIcon} />
            {label}
        </button>
    );
};

export default BackButton;
