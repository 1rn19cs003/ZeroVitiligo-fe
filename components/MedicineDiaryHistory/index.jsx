"use client";

import { useMedicineDiary, useDeleteMedicineDiary } from '@/hooks/useMedicineDiary';
import { Calendar, Pill, DollarSign, FileText, Trash2 } from 'lucide-react';
import styles from './styles.module.css';
import { useUserStore } from '@/store/useStatesStore';
import { useState } from 'react';
import ConfirmDialog from '../ConfirmDialog';

export default function MedicineDiaryHistory({ patientId }) {
    const { data: entries = [], isLoading, error } = useMedicineDiary(patientId);
    const { mutate: deleteMedicine } = useDeleteMedicineDiary();
    const { data: userInfo } = useUserStore();
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, entryId: null, medicineName: '' });

    // Check if user is Admin or Doctor (they have same permissions)
    const isAdminOrDoctor = userInfo?.role === 'ADMIN' || userInfo?.role === 'DOCTOR';

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

    const handleDeleteMedicine = (entryId, medicineName) => {
        setDeleteConfirm({ isOpen: true, entryId, medicineName });
    };

    const confirmDelete = async () => {
        if (deleteConfirm.entryId) {
            deleteMedicine({ id: deleteConfirm.entryId, patientId });
            setDeleteConfirm({ isOpen: false, entryId: null, medicineName: '' });
        }
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
                            {isAdminOrDoctor && (
                                <button
                                    onClick={() => handleDeleteMedicine(entry.id, entry.medicineCode)}
                                    className={styles.deleteMedicineButton}
                                    title="Delete medicine entry"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
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

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false, entryId: null, medicineName: '' })}
                onConfirm={confirmDelete}
                title="Delete Medicine Entry"
                message={`Are you sure you want to delete "${deleteConfirm.medicineName}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
