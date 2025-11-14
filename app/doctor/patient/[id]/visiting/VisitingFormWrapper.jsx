"use client";

import React from 'react';
import VisitingForm from './VisitingForm';

export default function VisitingFormWrapper({ initialData }) {
  const handleUpdate = (updatedData) => {
    // your update logic here
    console.log('Updated:', updatedData);
  };

  return <VisitingForm initialData={initialData} onUpdate={handleUpdate} />;
}
