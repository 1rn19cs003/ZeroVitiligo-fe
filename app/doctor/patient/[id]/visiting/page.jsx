import VisitingFormWrapper from './VisitingFormWrapper';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`);
    const result = await res.json();
    if (result?.data?.length) {
      return result.data.map((patient) => ({
        id: patient.id,
      }));
    }
  } catch (error) {
    console.error('Error fetching patient IDs for static generation:', error);
  }
  return [];
}

export default async function FirstVisitPage({ params }) {
  const response = await params;
  if(!response?.id){
    notFound();
  }
  return <VisitingFormWrapper id={response.id} />;
}
