import { notFound } from 'next/navigation';
import axios from 'axios';
import PatientDetailsClient from './PatientDetailsClient';
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


async function getPatientData(id) {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/${id}`, {
      headers: {
        'Cache-Control': 'max-age=300'
      }
    });
    return response.data.data || response.data || null;
  } catch (error) {
    console.error('Axios error fetching patient data:', error);
    return null;
  }
}


export default async function PatientDetails({ params }) {

  params = await params;
  const patientData = await getPatientData(params.id);

  if (!patientData) {
    notFound();
  }
  return <PatientDetailsClient patientData={patientData} />;
}