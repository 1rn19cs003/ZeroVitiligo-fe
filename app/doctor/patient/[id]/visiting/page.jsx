// "use client";

import React from 'react';
import VisitingForm from './VisitingForm';
import VisitingFormWrapper from './VisitingFormWrapper';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`);
    const result = await res.json();
    if (result?.data?.length) {
      return result.data.map((patient) => ({
        id: patient.id.toString(),
      }));
    }
  } catch (error) {
    console.error('Error fetching patient IDs for static generation:', error);
  }
  return [];
}

export default function FirstVisitPage({ params }) {
  const initialData = {
    name: 'John Doe',
    patientId: '76',
    // patientId: params.id,
    age: 45,
    contactNo: '123-456-7890',
    comments: '',
    medication: '',
  };

  const handleUpdate = (updatedData) => {
    console.log("update data flow:", updatedData);
    // TODO: send PUT request to update patient comments/medication
  };

  return <VisitingFormWrapper initialData={initialData} />;
}
