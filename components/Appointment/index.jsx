"use client";

import { useEffect, useMemo, useState } from "react";
import { useFormik } from "formik";
import styles from "./styles.module.css";
import DatePicker from "react-datepicker";
import { parseDate, safeDateToISOString } from "../../utils/index.utils";
import "react-datepicker/dist/react-datepicker.css";
import { PATIENT_STATUS, VISIT_MODE } from "../../lib/constants";
import MedicalHistory from "../MedicalHistory";
import { useAppointmentsByPatient, useCreateAppointment } from "../../hooks/useAppointment";
import { useGetCurrentUser } from "../../hooks/useAuth";
import Loader from "../Loader";
import ErrorMessage from "../Error";
import BackButton from "../BackButton";
import { useUpdatePatientStatus } from "@/hooks/usePatients";

const USER_PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const AppointmentForm = ({ initialData, pageMode, patientData, statusData }) => {
  const { name, patientId, age, contactNo, comments, medication, appointmentDate, notes, status } =
    initialData;
  const isScheldued = pageMode === VISIT_MODE.SCHEDULE
  const { data: patientAppointmentData, isLoading: patientAppointmentLoading, error: patientAppointmentError } = useAppointmentsByPatient(patientId)
  const { mutate: updatePatientStatusMutation } = useUpdatePatientStatus();
  const { mutate: createAppointmentMutation, isLoading: createAppointmentLoading } = useCreateAppointment();
  const initialDate = parseDate(appointmentDate) || new Date();
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const today = new Date();

  const { minTime, maxTime } = useMemo(() => {
    const isToday = selectedDate.toDateString() === today.toDateString();

    const min = isToday
      ? new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate(),
        today.getHours(),
        today.getMinutes()
      )
      : new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        0,
        0
      );

    const max = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      23,
      59,
      59
    );

    return { minTime: min, maxTime: max };
  }, [selectedDate]);

  const formik = useFormik({
    initialValues: {
      comments: comments || "",
      medication: medication || "",
      notes: notes || "",
      status: status || "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      handleUpdate({
        ...values,
        appointmentDate: selectedDate,
      });
    },
  });

  useEffect(() => {
    formik.setFieldValue("appointmentDate", selectedDate);
  }, [selectedDate]);

  if (patientAppointmentLoading) return <Loader message='Loading Patient Data...' />
  if ((patientAppointmentError || !patientAppointmentData)) return <ErrorMessage message='Failed to load patient data.' />;
  const handleUpdate = (updatedData) => {
    const loggedInUserId = useGetCurrentUser()().id;
    createAppointmentMutation({
      doctorId: loggedInUserId,
      patientId: patientData.id,
      appointmentDate: safeDateToISOString(updatedData.appointmentDate),
      reason: updatedData.comments,
      medication: updatedData.medication,
      notes: updatedData.notes,
      status: updatedData.status === 'ONGOING' ? statusData.find(element => element === 'COMPLETED') : updatedData.status,
    }, {
      onSuccess: () => {
        if (patientData.status === PATIENT_STATUS.NEW_REGISTRATION) {
          updatePatientStatusMutation({
            patientId: patientData.patientId,
            status: PATIENT_STATUS.FOLLOW_UP,
          });
        }
      }
    });



  };
  return (
    <>
      {pageMode === VISIT_MODE.HISTORY ? (
        <MedicalHistory appointments={patientAppointmentData} patientData={patientData} />
      ) : (
        <div>
          <BackButton className={styles.backButton} /><div className={styles.container}>
            <div className={styles.headerRow}>
              <img src={USER_PLACEHOLDER} alt="Patient" className={styles.userImage} loading="lazy" />
              <div className={styles.fieldGroup}>
                <div className={styles.field}>
                  <label className={styles.label}>Name:</label>
                  <div className={styles.value}>{name}</div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Patient ID:</label>
                  <div className={styles.value}>{patientId}</div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Age:</label>
                  <div className={styles.value}>{age}</div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Contact No:</label>
                  <div className={styles.value}>{contactNo}</div>
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Status:</label>
                  <div className={styles.valueGray}>{formik.values.status}</div>
                </div>
              </div>
            </div>

            <form onSubmit={formik.handleSubmit} className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.label}>
                  {!isScheldued ? 'Appointment Date & Time:' : 'Next Appointment Date & Time:'}
                </label>

                <DatePicker
                  selected={selectedDate}
                  onChange={(date) => setSelectedDate(date)}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={15}
                  dateFormat="MMMM d, yyyy h:mm aa"
                  minDate={today}
                  minTime={minTime}
                  maxTime={maxTime}
                  placeholderText="Select date and time"
                  className={`${styles.input} ${!isScheldued ? styles.inputDisabled : ''}`}
                  required
                  disabled={!isScheldued} />
              </div>

              {/* Comments */}
              <div className={styles.field}>
                <label className={styles.label}>Comments:</label>
                <textarea
                  name="comments"
                  value={formik.values.comments}
                  onChange={formik.handleChange}
                  className={styles.textarea}
                  rows={4} />
              </div>

              {/* Medication */}
              <div className={styles.field}>
                <label className={styles.label}>Medication Given:</label>
                <textarea
                  name="medication"
                  value={formik.values.medication}
                  onChange={formik.handleChange}
                  className={styles.textarea}
                  rows={4} />
              </div>

              {/* Notes */}
              <div className={styles.field}>
                <label className={styles.label}>Notes:</label>
                <textarea
                  name="notes"
                  value={formik.values.notes}
                  onChange={formik.handleChange}
                  className={styles.textarea}
                  rows={4} />
              </div>

              <button
                type="submit"
                className={`${styles.submitButton} ${createAppointmentLoading ? styles.submitButtonLoading : ''}`}
                disabled={createAppointmentLoading}
              >
                {createAppointmentLoading ? (
                  <>
                    <span className={styles.spinner}></span>
                    Updating...
                  </>
                ) : (
                  'Update'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );

};

export default AppointmentForm;
