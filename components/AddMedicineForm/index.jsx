"use client";

import { useState } from 'react';
import { X, Pill, Calendar, DollarSign, FileText, Clock } from 'lucide-react';
import { useCreateMedicineDiary } from '@/hooks/useMedicineDiary';
import styles from './styles.module.css';
import { useUpdatePatientStatus } from '@/hooks/usePatients';
import { PATIENT_STATUS } from '@/lib/constants';

export default function AddMedicineForm({ patientId, onClose, onSuccess ,patientData=null}) {

    const { mutate: updatePatientStatusMutation } = useUpdatePatientStatus();
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        medicineCode: '',
        durationDays: '',
        price: '',
        comments: ''
    });

    const handleUpdatePatientStatus = () => {
        if (patientData.status !== PATIENT_STATUS.UNDER_TREATMENT) {
            updatePatientStatusMutation({
                patientId: patientData.id,
                status: PATIENT_STATUS.UNDER_TREATMENT,
            });
        }
    }
    const [errors, setErrors] = useState({});
    const { mutate: createEntry, isPending } = useCreateMedicineDiary();

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.date) {
            newErrors.date = 'Date is required';
        }

        if (!formData.medicineCode.trim()) {
            newErrors.medicineCode = 'Medicine code is required';
        }

        if (!formData.durationDays) {
            newErrors.durationDays = 'Duration is required';
        } else if (parseInt(formData.durationDays) <= 0) {
            newErrors.durationDays = 'Duration must be greater than 0';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseFloat(formData.price) < 0) {
            newErrors.price = 'Price cannot be negative';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const entryData = {
            patientId,
            date: formData.date,
            medicineCode: formData.medicineCode.trim(),
            durationDays: parseInt(formData.durationDays),
            price: parseFloat(formData.price),
            comments: formData.comments.trim() || undefined
        };

        createEntry(entryData, {
            onSuccess: () => {
                handleUpdatePatientStatus();
                onSuccess?.();
                onClose();
            },
            onError: (error) => {
                console.error('Failed to create medicine entry:', error);
                setErrors({ submit: 'Failed to add medicine entry. Please try again.' });
            }
        });
    };

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>
                        <Pill className={styles.titleIcon} />
                        Add Medicine Entry
                    </h2>
                    <button
                        onClick={onClose}
                        className={styles.closeButton}
                        type="button"
                        aria-label="Close"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    {errors.submit && (
                        <div className={styles.errorBanner}>
                            {errors.submit}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label htmlFor="date" className={styles.label}>
                            <Calendar size={16} />
                            Date *
                        </label>
                        <input
                            id="date"
                            type="date"
                            value={formData.date}
                            onChange={(e) => handleChange('date', e.target.value)}
                            className={`${styles.input} ${errors.date ? styles.inputError : ''}`}
                            max={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && <span className={styles.errorText}>{errors.date}</span>}
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="medicineCode" className={styles.label}>
                            <Pill size={16} />
                            Medicine Code *
                        </label>
                        <input
                            id="medicineCode"
                            type="text"
                            value={formData.medicineCode}
                            onChange={(e) => handleChange('medicineCode', e.target.value)}
                            className={`${styles.input} ${errors.medicineCode ? styles.inputError : ''}`}
                            placeholder="e.g., K2CP60"
                        />
                        {errors.medicineCode && <span className={styles.errorText}>{errors.medicineCode}</span>}
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label htmlFor="durationDays" className={styles.label}>
                                <Clock size={16} />
                                Duration (Days) *
                            </label>
                            <input
                                id="durationDays"
                                type="number"
                                min="1"
                                value={formData.durationDays}
                                onChange={(e) => handleChange('durationDays', e.target.value)}
                                className={`${styles.input} ${errors.durationDays ? styles.inputError : ''}`}
                                placeholder="60"
                            />
                            {errors.durationDays && <span className={styles.errorText}>{errors.durationDays}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="price" className={styles.label}>
                                <DollarSign size={16} />
                                Price (₹) *
                            </label>
                            <input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                className={`${styles.input} ${errors.price ? styles.inputError : ''}`}
                                placeholder="5000"
                            />
                            {errors.price && <span className={styles.errorText}>{errors.price}</span>}
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="comments" className={styles.label}>
                            <FileText size={16} />
                            Comments (Optional)
                        </label>
                        <textarea
                            id="comments"
                            value={formData.comments}
                            onChange={(e) => handleChange('comments', e.target.value)}
                            className={styles.textarea}
                            placeholder="Additional notes..."
                            rows={3}
                        />
                    </div>

                    <div className={styles.formActions}>
                        <button
                            type="button"
                            onClick={onClose}
                            className={styles.cancelButton}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={styles.submitButton}
                            disabled={isPending}
                        >
                            {isPending ? 'Adding...' : 'Add Medicine Entry'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
