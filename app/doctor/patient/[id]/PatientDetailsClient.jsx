"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeft, User, Calendar, Mail, Phone } from 'lucide-react';
import styles from './styles.module.css';

export default function PatientDetailsClient({ patientData }) {
  const router = useRouter();

  const handleBack = () => {
    router.push('/doctor');
  };

  const handleAction = (action) => {
    console.log(`${action} clicked for patient ${patientData.id}`);
    // Implement your action logic here
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton}>
          <ArrowLeft className={styles.backIcon} />
          Back to Dashboard
        </button>
        <h1 className={styles.title}>Patient Details</h1>
      </div>

      <div className={styles.patientCard}>
        <div className={styles.patientHeader}>
          <div className={styles.patientInfo}>
            <User className={styles.userIcon} />
            <div>
              <h2 className={styles.patientName}>
                {patientData.name || `${patientData.firstName || ''} ${patientData.lastName || ''}`.trim() || 'Unknown Patient'}
              </h2>
              <p className={styles.patientId}>Patient ID: {patientData.id || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className={styles.patientContent}>
          <div className={styles.detailsGrid}>
            <div className={styles.personalInfo}>
              <h3 className={styles.sectionTitle}>
                <User className={styles.sectionIcon} />
                Personal Information
              </h3>
              <div className={styles.infoList}>
                {Object.entries(patientData).map(([key, value]) => (
                  <div key={key} className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className={styles.infoValue}>
                      {value?.toString() || 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

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
                <button 
                  onClick={() => handleAction('scheduleAppointment')}
                  className={`${styles.actionButton} ${styles.scheduleAppointment}`}
                >
                  <Calendar className={styles.actionIcon} />
                  Schedule Appointment
                </button>
                <button 
                  onClick={() => handleAction('sendMessage')}
                  className={`${styles.actionButton} ${styles.sendMessage}`}
                >
                  <Mail className={styles.actionIcon} />
                  Send Message
                </button>
                <button 
                  onClick={() => handleAction('emergencyContact')}
                  className={`${styles.actionButton} ${styles.emergencyContact}`}
                >
                  <Phone className={styles.actionIcon} />
                  Emergency Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}