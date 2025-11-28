"use client";

import { useRouter } from 'next/navigation';
import { User, Calendar, Mail, Phone, Save, Edit, X } from 'lucide-react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import styles from './styles.module.css';
import { useStatus, useUpdatePatient } from '../../hooks/usePatients';
import { ROLES, VISIT_MODE } from '../../lib/constants';
import { useGetCurrentUser } from '../../hooks/useAuth';
import BackButton from '../BackButton';
import MedicineDiaryHistory from '../MedicineDiaryHistory';

export default function PatientDetailsClient({ patientData }) {
    const router = useRouter();
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const { data: statusOptions = [], isLoading: isLoadingStatus } = useStatus();
    const { mutate: updatePatient } = useUpdatePatient(patientData.patientId);

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
            <div className={styles.header}>
                <BackButton className={styles.backButton} />
                <h1 className={styles.title}>Patient Details</h1>

                {isAdmin && (
                    <div className={styles.editControls}>
                        {!isEditing ? (
                            <button onClick={toggleEdit} className={styles.editButton}>
                                <Edit className={styles.editIcon} />
                                Edit Patient
                            </button>
                        ) : (
                            <div className={styles.editActionButtons}>
                                <button
                                    onClick={handleSave}
                                    disabled={isLoadingStatus}
                                    className={`${styles.saveButton} ${isLoadingStatus ? styles.loading : ''}`}
                                >
                                    <Save className={styles.saveIcon} />
                                    {isLoadingStatus ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button onClick={handleCancel} className={styles.cancelButton}>
                                    <X className={styles.cancelIcon} />
                                    Cancel
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className={styles.patientCard}>
                <div className={styles.patientHeader}>
                    <div className={styles.patientInfo}>
                        <User className={styles.userIcon} />
                        <div>
                            <h2 className={styles.patientName}>
                                {patientData.name || `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim() || 'Unknown Patient'}
                            </h2>
                            <p className={styles.patientId}>Patient ID: {patientData.patientId || 'N/A'}</p>
                            {isAdmin && <p className={styles.adminBadge}>Admin Mode</p>}
                        </div>
                    </div>
                </div>

                <div className={styles.patientContent}>
                    <div className={styles.detailsGrid}>
                        <div className={styles.personalInfo}>
                            <h3 className={styles.sectionTitle}>
                                <User className={styles.sectionIcon} />
                                Personal Information
                                {isAdmin && isEditing && <span className={styles.editingBadge}>Editing...</span>}
                            </h3>

                            <div className={styles.infoList}>
                                {Object.entries(patientData).map(([key, value]) => {
                                    if (hiddenFields.includes(key)) return null;
                                    const isNonEditable = nonEditableFields.includes(key);
                                    const isEditingField = isAdmin && isEditing && !isNonEditable;

                                    return (
                                        <div key={key} className={styles.infoItem}>
                                            <span className={styles.infoLabel}>{key.replace(/([A-Z])/g, ' $1').trim()}:</span>

                                            {isEditingField ? (
                                                key === 'status' ? (
                                                    <select
                                                        value={editedData[key] || patientData[key] || ''}
                                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                                        className={styles.dropdownSelect}
                                                        disabled={isLoadingStatus}
                                                    >
                                                        <option value="">{isLoadingStatus ? 'Loading...' : 'Select Status'}</option>
                                                        {statusOptions.map((status, index) => (
                                                            <option key={index} value={status}>
                                                                {status.replace(/_/g, ' ')}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        value={editedData[key] || ''}
                                                        onChange={(e) => handleFieldChange(key, e.target.value)}
                                                        className={styles.editInput}
                                                        placeholder={`Enter ${key}`}
                                                    />
                                                )
                                            ) : (
                                                <span className={styles.infoValue}>{String(value) || 'N/A'}</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Quick Actions Section */}
                        <div className={styles.actionsSection}>
                            <h3 className={styles.sectionTitle}>Quick Actions</h3>
                            <div className={styles.actionsGrid}>
                                <button
                                    onClick={() => handleAction('medicalHistory')}
                                    className={`${styles.actionButton} ${styles.medicalHistory}`}
                                >
                                    <Calendar className={styles.actionIcon} />
                                    View Medical History
                                </button>

                                {patientData?.Appointment?.length > 0 ? (
                                    <button
                                        onClick={() => handleAction('scheduleAppointment')}
                                        className={`${styles.actionButton} ${styles.scheduleAppointment}`}
                                    >
                                        <Calendar className={styles.actionIcon} />
                                        Schedule Appointment
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleAction('firstVisit')}
                                        className={`${styles.actionButton} ${styles.firstVisit}`}
                                    >
                                        <Phone className={styles.actionIcon} />
                                        First Visit
                                    </button>
                                )}

                                {/* <button
                                    onClick={() => handleAction('sendMessage')}
                                    className={`${styles.actionButton} ${styles.sendMessage}`}
                                >
                                    <Mail className={styles.actionIcon} />
                                    Send Message
                                </button> */}
                            </div>

                            {/* {isAdmin && (
                                <div className={styles.adminActions}>
                                    <h4 className={styles.adminSectionTitle}>Admin Actions</h4>
                                    <div className={styles.adminActionsGrid}>
                                        <button className={styles.adminActionButton}>Export Patient Data</button>
                                        <button className={styles.adminActionButton}>Manage Permissions</button>
                                    </div>
                                </div>
                            )} */}
                        </div>
                    </div>

                    {/* Medicine Diary History Section */}
                    <MedicineDiaryHistory patientId={patientData.id} />
                </div>
            </div>
        </div>
    );
}
