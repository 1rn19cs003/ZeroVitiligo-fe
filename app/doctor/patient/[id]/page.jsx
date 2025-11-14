import { notFound } from 'next/navigation';
import PatientDetailsWrapper from './PatientDetailsWrapper';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`, {
      next: { revalidate: 300 },
    });
    const result = await res.json();

    if (result?.data?.length) {
      return result.data.map(patient => ({
        id: patient.id.toString(),
      }));
    }
  } catch {
    cconsole.error('Error fetching patient IDs for static generation:', error);
  }
  return [];
}

export default async function PatientDetails({ params }) {
  const response = await params;
  if (!response?.id) {
    notFound();
  }
  return <PatientDetailsWrapper id={response.id} />;
}
