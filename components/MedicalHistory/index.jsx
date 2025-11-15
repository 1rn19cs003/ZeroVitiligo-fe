"use client";

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
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return "Invalid Date";
  }
};

const StatusBadge = ({ status }) => {
  const statusConfig = {
    completed: { icon: CheckCircle, color: "#10b981", bg: "#d1fae5" },
    scheduled: { icon: Clock, color: "#3b82f6", bg: "#dbeafe" },
    cancelled: { icon: XCircle, color: "#ef4444", bg: "#fee2e2" },
    pending: { icon: AlertCircle, color: "#f59e0b", bg: "#fef3c7" },
  };

  const config = statusConfig[status?.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span
      className={styles.statusBadge}
      style={{
        backgroundColor: config.bg,
        color: config.color
      }}
    >
      <Icon size={14} />
      {status || "Pending"}
    </span>
  );
};

const DetailRow = ({ icon: Icon, label, value, iconColor }) => {
  if (!value || value === "NA" || value === "N/A") return null;

  return (
    <div className={styles.detailRow}>
      <div className={styles.detailLabel}>
        <Icon size={16} style={{ color: iconColor }} />
        <strong>{label}</strong>
      </div>
      <p className={styles.detailValue}>{value}</p>
    </div>
  );
};

export default function MedicalHistory({ appointments = [] }) {
  const [openItem, setOpenItem] = useState(null);
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  // Memoized filtered and sorted appointments
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
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backButton} type="button">
        <ArrowLeft className={styles.backIcon} />
        Back
      </button>
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
    </div>
  );
}