"use client";

import { useMedicineDiary } from '@/hooks/useMedicineDiary';
import { Calendar, Pill, DollarSign, FileText } from 'lucide-react';
import styles from './styles.module.css';

export default function MedicineDiaryHistory({ patientId }) {
    const { data: entries = [], isLoading, error } = useMedicineDiary(patientId);

    if (isLoading) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Medicine History</h3>
                <div className={styles.loading}>Loading medicine history...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Medicine History</h3>
                <div className={styles.error}>Failed to load medicine history</div>
            </div>
        );
    }

    if (entries.length === 0) {
        return (
            <div className={styles.container}>
                <h3 className={styles.title}>Medicine History</h3>
                <div className={styles.empty}>
                    <Pill className={styles.emptyIcon} />
                    <p>No medicine records found</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(price);
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Medicine History</h3>
            <div className={styles.entriesGrid}>
                {entries.map((entry) => (
                    <div key={entry.id} className={styles.entryCard}>
                        <div className={styles.entryHeader}>
                            <div className={styles.dateSection}>
                                <Calendar className={styles.icon} />
                                <span className={styles.date}>{formatDate(entry.date)}</span>
                            </div>
                            <div className={styles.priceSection}>
                                <DollarSign className={styles.icon} />
                                <span className={styles.price}>{formatPrice(entry.price)}</span>
                            </div>
                        </div>

                        <div className={styles.entryDetails}>
                            <div className={styles.detailRow}>
                                <Pill className={styles.detailIcon} />
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>Medicine Code:</span>
                                    <span className={styles.detailValue}>{entry.medicineCode}</span>
                                </div>
                            </div>

                            <div className={styles.detailRow}>
                                <Calendar className={styles.detailIcon} />
                                <div className={styles.detailContent}>
                                    <span className={styles.detailLabel}>Duration:</span>
                                    <span className={styles.detailValue}>{entry.durationDays} Days</span>
                                </div>
                            </div>

                            {entry.comments && (
                                <div className={styles.detailRow}>
                                    <FileText className={styles.detailIcon} />
                                    <div className={styles.detailContent}>
                                        <span className={styles.detailLabel}>Comments:</span>
                                        <span className={styles.detailValue}>{entry.comments}</span>
                                    </div>
                                </div>
                            )}

                            {entry.doctor && (
                                <div className={styles.createdBy}>
                                    <span>Added by: {entry.doctor.name}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
