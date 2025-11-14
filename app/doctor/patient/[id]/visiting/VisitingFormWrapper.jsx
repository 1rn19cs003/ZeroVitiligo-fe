"use client";

import React from 'react';
import AppointmentForm from '../../../../../components/Appointment';
import { getPatientData } from '../../../../../hooks/usePatients';
import { ConstructionIcon } from 'lucide-react';
import Loader from '../../../../../components/Loader';
import ErrorMessage from '../../../../../components/Error';

export default function VisitingFormWrapper({ id }) {
  const { data: patientData, isLoading, error } = getPatientData(id);
  if (isLoading) return <Loader message='Loading Patient Data...' />
  if (error || !patientData) return <ErrorMessage message='Failed to load patient data.' />;

  const initialData = {
    name: patientData.name,
    patientId: patientData.patientId ?? 'NA',
    age: patientData.age,
    contactNo: patientData.mobile,
    comments: '',
    medication: '',
  };

  const handleUpdate = (updatedData) => {
    console.log("update data flow:", updatedData);
    // TODO: send PUT request to update patient comments/medication
  };

  return <AppointmentForm initialData={initialData} onUpdate={handleUpdate} />;
}
