import { notFound } from 'next/navigation';
import PatientDetailsWrapper from './PatientDetailsWrapper';
import Loader from '../../../../components/Loader';
import { Suspense } from 'react';
export const dynamicParams = false;
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`);
    const result = await res.json();

    if (result?.data?.length) {
      return result.data.map(patient => ({
        id: patient.id.toString(),
      }));
    }
  } catch (error) {
    console.error('Error fetching patient IDs for static generation:', error);
  }
  return [{ id: "someId" }];
}

export default async function PatientDetails({ params }) {
  const response = await params;
  if (!response?.id) {
    notFound();
  }
  return (<Suspense fallback={<Loader />}>
    <PatientDetailsWrapper id={response.id} />;
  </Suspense>)
}
