import React, { useState, useMemo, useCallback } from "react";
import styles from "./styles.module.css";
import {
  ChevronDown,
  ChevronRight,
  CalendarDays,
  Clock,
  FileText,
  Pill,
  Activity,
} from "lucide-react";
import { useUpdateAppointment, useRescheduleAppointment } from "../../hooks/useAppointment";
import { APPOINTMENT_STATUS, PATIENT_STATUS } from "../../lib/constants";
import { formatDate, StatusBadge, DetailRow } from '../Miscellaneous/index'
import BackButton from "../BackButton";
import MedicineDiaryHistory from "../MedicineDiaryHistory";
import toast from 'react-hot-toast';
import { useUpdatePatientStatus } from "@/hooks/usePatients";


export default function MedicalHistory({ appointments = [], patientData }) {
  const [openItem, setOpenItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showMedicineDiary, setShowMedicineDiary] = useState(false);

  const { mutate: updateAppointment } = useUpdateAppointment();
  const { mutate: rescheduleAppointment } = useRescheduleAppointment();
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isRescheduleMode, setIsRescheduleMode] = useState(false);
  const { mutate: updatePatientStatusMutation } = useUpdatePatientStatus();

  const closeModal = () => {
    setEditingAppointment(null);
    setIsRescheduleMode(false);
  };

  const [editData, setEditData] = useState({
    reason: "",
    medication: "",
    notes: "",
    appointmentDate: ""
  });

  const openModal = (appt) => {
    setEditData({
      reason: appt.reason || "",
      medication: appt.medication || "",
      notes: appt.notes || "",
      appointmentDate: appt.appointmentDate || ""
    });
    setEditingAppointment(appt);
  };

  const saveAppointment = () => {
    const updatedFields = {
      doctorId: editingAppointment.doctorId,
      patientId: editingAppointment.patientId,
      reason: editData.reason,
      medication: editData.medication,
      notes: editData.notes,
      status: APPOINTMENT_STATUS.COMPLETED,
    }
    const appointmentId = editingAppointment.id

    showLoader('Updating appointment...');
    updateAppointment({ appointmentId, updateData: updatedFields }, {
      onSuccess: () => {
        hideLoader();
        closeModal();
        toast.success('Appointment updated successfully!');
      },
      onError: () => {
        hideLoader();
        toast.error('Failed to update appointment');
      }
    });
  };

  const handleReschedule = () => {
    if (!editData.appointmentDate) {
      toast.error('Please select a date and time');
      return;
    }

    const newDate = new Date(editData.appointmentDate);

    if (newDate <= new Date()) {
      toast.error('Please select a future date and time');
      return;
    }

    rescheduleAppointment({
      appointmentId: editingAppointment.id,
      newDate: newDate.toISOString(),
      reason: editData.reason,
      medication: editData.medication,
      notes: editData.notes,
    }, {
      onSuccess: () => {
        if (patientData.status === PATIENT_STATUS.NEW_REGISTRATION) {
          updatePatientStatusMutation({
            patientId: patientData.patientId,
            status: PATIENT_STATUS.UNDER_TREATMENT,
          });
        }
        closeModal();
      }
    });
  };

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    if (filter !== "all") {
      filtered = filtered.filter(
        appt => appt.status?.toLowerCase() === filter.toLowerCase()
      );
    }

    return filtered.sort((a, b) =>
      new Date(b.appointmentDate) - new Date(a.appointmentDate)
    );
  }, [appointments, filter]);

  const stats = useMemo(() => ({
    total: appointments.length,
    completed: appointments.filter(a => a.status?.toLowerCase() === "completed").length,
    scheduled: appointments.filter(a => a.status?.toLowerCase() === "scheduled").length,
    cancelled: appointments.filter(a => a.status?.toLowerCase() === "cancelled").length,
  }), [appointments]);

  const toggle = useCallback((id) => {
    setOpenItem(prev => prev === id ? null : id);
  }, []);

  if (!appointments.length) {
    return (
      <div className={styles.emptyState}>
        <CalendarDays size={64} className={styles.emptyIcon} />
        <h3>No Appointment History</h3>
        <p>Your medical appointment history will appear here once you schedule your first appointment.</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.container}>
        <BackButton className={styles.backButton} />
        <div className={styles.headerContainer}>
          <div className={styles.headerSection}>
            <h2 className={styles.title}>Medical History</h2>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <span className={styles.statValue}>{stats.total}</span>
                <span className={styles.statLabel}>Total</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue} style={{ color: "#10b981" }}>{stats.completed}</span>
                <span className={styles.statLabel}>Completed</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue} style={{ color: "#3b82f6" }}>{stats.scheduled}</span>
                <span className={styles.statLabel}>Scheduled</span>
              </div>
              <div className={styles.statCard}>
                <span className={styles.statValue} style={{ color: "#ef4444" }}>{stats.cancelled}</span>
                <span className={styles.statLabel}>Cancelled</span>
              </div>
            </div>
          </div>
          <div
            className={styles.medicineDiaryContainer}
            role="button"
            style={{
              color: showMedicineDiary ? "#10b981" : "#3b82f6",
              cursor: "pointer",
              border: "2px solid #3b82f6",
              background: "transparent",
              padding: "8px 12px",
              borderRadius: "8px"
            }}
            onClick={() => setShowMedicineDiary(prev => !prev)}
            onKeyPress={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                setShowMedicineDiary(prev => !prev);
              }
            }}
            tabIndex={0}
          >
            <div>
              <p>Medicine Diary</p>
              <Activity size={24} />
              {showMedicineDiary ? <ChevronDown size={24} /> : <ChevronRight size={24} />}
            </div>
          </div>
          <div className={styles.medicineDiaryContainer}>
            {showMedicineDiary && appointments && <MedicineDiaryHistory patientId={appointments?.[0]?.patientId} />}
          </div>

          {/* Filter Tabs */}
          <div className={styles.filterTabs}>
            {["all", "completed", "scheduled", "cancelled"].map((status) => (
              <button
                key={status}
                className={`${styles.filterTab} ${filter === status ? styles.activeTab : ""}`}
                onClick={() => setFilter(status)}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className={styles.timeline}>
            {filteredAppointments.map((appt, index) => {
              const isOpen = openItem === appt.id;

              return (
                <div key={appt.id} className={styles.timelineItem}>
                  {/* Timeline Line + Dot */}
                  <div className={styles.timelineLine}>
                    <span
                      className={styles.dot}
                      style={{
                        backgroundColor:
                          appt.status?.toLowerCase() === "completed" ? "#10b981" :
                            appt.status?.toLowerCase() === "cancelled" ? "#ef4444" :
                              "#3b82f6"
                      }}
                    ></span>
                    {index < filteredAppointments.length - 1 && (
                      <div className={styles.line}></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`${styles.content} ${isOpen ? styles.contentOpen : ""}`}>
                    {/* Collapsible Header */}
                    <div
                      className={styles.header}
                      onClick={() => toggle(appt.id)}
                      role="button"
                      tabIndex={0}
                      onKeyPress={(e) => e.key === "Enter" && toggle(appt.id)}
                    >
                      <div className={styles.headerLeft}>
                        <CalendarDays size={20} className={styles.headerIcon} />
                        <div className={styles.headerInfo}>
                          <span className={styles.dateText}>
                            {formatDate(appt.appointmentDate)}
                          </span>
                          {appt.reason && (
                            <span className={styles.reasonText}>{appt.reason}</span>
                          )}
                        </div>
                      </div>

                      <div className={styles.headerRight}>
                        <StatusBadge status={appt.status} />
                        {appt.status?.toLowerCase() === "scheduled" && (
                          <button
                            className={styles.editButton}
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal(appt);
                            }}
                          >
                            Edit
                          </button>
                        )}
                        {isOpen ? (
                          <ChevronDown size={20} className={styles.chevron} />
                        ) : (
                          <ChevronRight size={20} className={styles.chevron} />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {isOpen && (
                      <div className={styles.details}>
                        <div className={styles.detailsGrid}>
                          <DetailRow
                            icon={FileText}
                            label="Reason"
                            value={appt.reason}
                            iconColor="#6366f1"
                          />
                          <DetailRow
                            icon={Pill}
                            label="Medication"
                            value={appt.medication}
                            iconColor="#ec4899"
                          />
                          <DetailRow
                            icon={Activity}
                            label="Notes"
                            value={appt.notes}
                            iconColor="#8b5cf6"
                          />
                          <DetailRow
                            icon={Clock}
                            label="Start Time"
                            value={formatDate(appt.startTime)}
                            iconColor="#3b82f6"
                          />
                          <DetailRow
                            icon={Clock}
                            label="End Time"
                            value={formatDate(appt.endTime)}
                            iconColor="#10b981"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredAppointments.length === 0 && (
            <div className={styles.noResults}>
              <p>No appointments found with status: <strong>{filter}</strong></p>
            </div>
          )}
          {editingAppointment && (
            <div className={styles.modalOverlay}>
              <div className={styles.modal}>
                <h3>Edit Scheduled Appointment</h3>
                <label className={styles.modalLabel}>Reason</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  value={editData.reason}
                  onChange={(e) =>
                    setEditData({ ...editData, reason: e.target.value })
                  }
                />

                <label className={styles.modalLabel}>Medication</label>
                <input
                  type="text"
                  className={styles.modalInput}
                  value={editData.medication}
                  onChange={(e) =>
                    setEditData({ ...editData, medication: e.target.value })
                  }
                />

                <label className={styles.modalLabel}>Notes</label>
                <textarea
                  className={styles.modalTextArea}
                  value={editData.notes}
                  onChange={(e) =>
                    setEditData({ ...editData, notes: e.target.value })
                  }
                />

                <div className={styles.modalActions}>
                  {!isRescheduleMode ? (
                    <>
                      <button className={styles.saveButton} onClick={saveAppointment}>
                        Save
                      </button>
                      {editingAppointment.status === APPOINTMENT_STATUS.SCHEDULED && (
                        <button
                          className={styles.rescheduleButton}
                          onClick={() => setIsRescheduleMode(true)}
                          style={{ backgroundColor: '#f59e0b', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: '500' }}
                        >
                          Reschedule
                        </button>
                      )}
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: '1rem' }}>
                      <label className={styles.modalLabel}>New Date & Time</label>
                      <input
                        type="datetime-local"
                        className={styles.modalInput}
                        value={(() => {
                          if (!editData.appointmentDate) return '';
                          try {
                            const date = new Date(editData.appointmentDate);
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(2, '0');
                            const day = String(date.getDate()).padStart(2, '0');
                            const hours = String(date.getHours()).padStart(2, '0');
                            const minutes = String(date.getMinutes()).padStart(2, '0');
                            return `${year}-${month}-${day}T${hours}:${minutes}`;
                          } catch (e) {
                            return '';
                          }
                        })()}
                        onChange={(e) => setEditData({ ...editData, appointmentDate: e.target.value })}
                      />
                      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                        <button
                          className={styles.saveButton}
                          onClick={handleReschedule}
                        >
                          Confirm Reschedule
                        </button>
                        <button
                          className={styles.cancelButton}
                          onClick={() => setIsRescheduleMode(false)}
                        >
                          Back
                        </button>
                      </div>
                    </div>
                  )}
                  {!isRescheduleMode && (
                    <button className={styles.cancelButton} onClick={closeModal}>
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div >
    </>
  );
}
