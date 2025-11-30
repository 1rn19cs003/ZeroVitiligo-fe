"use client";

import { useRouter } from 'next/navigation';
import { User, Calendar, Mail, Phone, Save, Edit, X, Plus, Trash2, CalendarDays } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './styles.module.css';
import { useStatus, useUpdatePatient, useDeletePatient } from '../../hooks/usePatients';
import { ROLES, VISIT_MODE } from '../../lib/constants';
import { useGetCurrentUser } from '../../hooks/useAuth';
import BackButton from '../BackButton';
import ConfirmDialog from '../ConfirmDialog';
import MedicineDiaryHistory from '../MedicineDiaryHistory';
import AddMedicineForm from '../AddMedicineForm';

export default function PatientDetailsClient({ patientData }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [showMedicineForm, setShowMedicineForm] = useState(false);
    const { data: statusOptions = [], isLoading: isLoadingStatus } = useStatus();
    const { mutate: updatePatient } = useUpdatePatient(patientData.patientId);
    const { mutate: deletePatient } = useDeletePatient();
    const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false });

    useEffect(() => {
        const user = useGetCurrentUser()();
        setIsAdmin(user?.role === ROLES.ADMIN || user?.isAdmin);
    }, []);

    const actionRoutes = useMemo(() => ({
        firstVisit: `/doctor/patient/${patientData.patientId}/visiting?mode=${VISIT_MODE.VISIT}`,
        scheduleAppointment: `/doctor/patient/${patientData.patientId}/visiting?mode=${VISIT_MODE.SCHEDULE}`,
        medicalHistory: `/doctor/patient/${patientData.patientId}/visiting?mode=${VISIT_MODE.HISTORY}`,
    }), [patientData.patientId]);

    const handleAction = useCallback((action) => {
        const route = actionRoutes[action];
        if (route) router.push(route);
        else console.warn(`Route for action '${action}' not defined`);
    }, [actionRoutes, router]);

    const toggleEdit = useCallback(() => {
        if (isEditing) setEditedData({});
        else setEditedData({ ...patientData });
        setIsEditing(prev => !prev);
    }, [isEditing, patientData]);

    const handleFieldChange = useCallback((field, value) => {
        setEditedData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleDelete = () => {
        setDeleteConfirm({ isOpen: true });
    };

    const confirmDelete = async () => {
        deletePatient(patientData.patientId, {
            onSuccess: () => {
                router.push('/doctor');
            }
        });
    };

    const handleSave = () => {
        updatePatient(editedData);
        setIsEditing(false);
        setEditedData({});
    };

    const handleCancel = useCallback(() => {
        setEditedData({});
        setIsEditing(false);
    }, []);


    const nonEditableFields = useMemo(() => ['id', 'createdAt', 'assistantId', 'doctorId', 'patientId', 'Appointment'], []);
    const hiddenFields = useMemo(() => ['id', 'Appointment'], []);

    return (
        <div className={styles.container}>
            <div className={styles.patientCard}>
                {/* Unified Header */}
                <div className={styles.unifiedHeader}>
                    <div className={styles.headerLeft}>
                        <BackButton className={styles.backButton} />
                        <div className={styles.patientIdentity}>
                            <h1 className={styles.patientName}>
                                {patientData.name || `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim() || 'Unknown Patient'}
                            </h1>
                            <div className={styles.idBadge}>
                                <span className={styles.idLabel}>ID:</span>
                                <span className={styles.idValue}>{patientData.patientId || 'N/A'}</span>
                            </div>
                        </div>
                    </div>

                    {isAdmin && (
                        <div className={styles.headerControls}>
                            {!isEditing ? (
                                <div className={styles.actionButtons}>
                                    <button onClick={toggleEdit} className={styles.iconButton} title="Edit Patient">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={handleDelete} className={`${styles.iconButton} ${styles.deleteBtn}`} title="Delete Patient">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.editActionButtons}>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoadingStatus}
                                        className={styles.saveButton}
                                    >
                                        <Save size={16} />
                                        Save
                                    </button>
                                    <button onClick={handleCancel} className={styles.cancelButton}>
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.contentLayout}>
                    {/* Left Sidebar: Personal Info */}
                    <aside className={styles.leftSidebar}>
                        <div className={styles.infoCard}>
                            <h3 className={styles.cardTitle}>
                                <User size={18} />
                                Personal Info
                            </h3>

                            <div className={styles.infoList}>
                                {Object.entries(patientData).map(([key, value]) => {
                                    if (hiddenFields.includes(key)) return null;
                                    const isNonEditable = nonEditableFields.includes(key);
                                    const isEditingField = isAdmin && isEditing && !isNonEditable;

                                    return (
                                        <div key={key} className={styles.infoItem}>
                                            <span className={styles.infoLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                            {isEditingField ? (
                                                key === 'status' ? (
                                                    <select
                                                        value={editedData[key] || patientData[key] || ''}
                                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                                        className={styles.compactSelect}
                                                    >
                                                        <option value="">Select</option>
                                                        {statusOptions.map((status, index) => (
                                                            <option key={index} value={status}>{status.replace(/_/g, ' ')}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editedData[key] || ''}
                                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                                        className={styles.compactInput}
                                                    />
                                                )
                                            ) : (
                                                <span className={styles.infoValue}>{String(value) || '-'}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </aside>

                    {/* Right Main Content */}
                    <main className={styles.mainContent}>
                        {/* Quick Actions Bar */}
                        <div className={styles.actionsBar}>
                            <button onClick={() => handleAction('medicalHistory')} className={styles.quickActionBtn}>
                                <CalendarDays size={18} />
                                <span>History</span>
                            </button>

                            {patientData?.Appointment?.length > 0 ? (
                                <button onClick={() => handleAction('scheduleAppointment')} className={styles.quickActionBtn}>
                                    <Calendar size={18} />
                                    <span>Schedule</span>
                                </button>
                            ) : (
                                <button onClick={() => handleAction('firstVisit')} className={styles.quickActionBtn}>
                                    <Phone size={18} />
                                    <span>First Visit</span>
                                </button>
                            )}

                            <button onClick={() => setShowMedicineForm(true)} className={styles.quickActionBtn}>
                                <Plus size={18} />
                                <span>Add Meds</span>
                            </button>
                        </div>

                        {/* Medicine Diary Section */}
                        <div className={styles.diarySection}>
                            <MedicineDiaryHistory patientId={patientData.id} />
                        </div>
                    </main>
                </div>
            </div>

            {/* Add Medicine Form Modal */}
            {showMedicineForm && (
                <AddMedicineForm
                    patientId={patientData.id}
                    onClose={() => setShowMedicineForm(false)}
                    onSuccess={() => {
                        // Form will close automatically, medicine history will refresh via React Query
                    }}
                />
            )}

            <ConfirmDialog
                isOpen={deleteConfirm.isOpen}
                onClose={() => setDeleteConfirm({ isOpen: false })}
                onConfirm={confirmDelete}
                title="Delete Patient"
                message="Are you sure you want to delete this patient? This action cannot be undone and will remove all associated data."
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
