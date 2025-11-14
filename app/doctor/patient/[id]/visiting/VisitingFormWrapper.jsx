"use client";

import React from 'react';
import AppointmentForm from '../../../../../components/Appointment';

export default function VisitingFormWrapper({ initialData }) {
  const handleUpdate = (updatedData) => {
    // your update logic here
    console.log('Updated:', updatedData);
  };

  return <AppointmentForm initialData={initialData} onUpdate={handleUpdate} />;
}
