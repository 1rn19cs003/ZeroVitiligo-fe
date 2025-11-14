"use client";

import React from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

const USER_PLACEHOLDER =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png"; // user icon

const VisitingForm = ({ initialData, onUpdate }) => {
  const { name, patientId, age, contactNo, comments, medication } = initialData;
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      comments: comments || '',
      medication: medication || '',
    },
    onSubmit: (values) => {
      onUpdate(values);
    },
  });

  const appointmentDate = new Date().toLocaleDateString();
  const createdBy = "System";

  return (
    <div className={styles.container}>
      <button
        className={styles.backButton}
        onClick={() => router.back()}
        type="button"
      >
        &larr; Back
      </button>

      <div className={styles.headerRow}>
        <img
          src={USER_PLACEHOLDER}
          alt="Patient"
          className={styles.userImage}
        />
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
            <label className={styles.label}>Appointment Date:</label>
            <div className={styles.valueGray}>{appointmentDate}</div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Created By:</label>
            <div className={styles.valueGray}>{createdBy}</div>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Comments:</label>
          <textarea
            name="comments"
            className={styles.textarea}
            value={formik.values.comments}
            onChange={formik.handleChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Medication Given:</label>
          <textarea
            name="medication"
            className={styles.textarea}
            value={formik.values.medication}
            onChange={formik.handleChange}
          />
        </div>
        <button type="submit" className={styles.submitButton}>
          Update
        </button>
      </form>
    </div>
  );
};

export default VisitingForm;
