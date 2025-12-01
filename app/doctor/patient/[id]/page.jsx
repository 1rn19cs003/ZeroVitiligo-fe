import { notFound } from 'next/navigation';
import PatientDetailsWrapper from './PatientDetailsWrapper';
import Loader from '../../../../components/Loader';
import { Suspense } from 'react';

// Enable dynamic params for server-side rendering
export const dynamicParams = true;

export default async function PatientDetails({ params }) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <Suspense fallback={<Loader />}>
      <PatientDetailsWrapper id={id} />
    </Suspense>
  );
}
