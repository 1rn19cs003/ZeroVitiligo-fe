import { notFound } from 'next/navigation';
import axios from 'axios';
import PatientDetailsClient from './PatientDetailsClient';

export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/patients/`, {
      next: { revalidate: 300 }
    });
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
      },
      next: { revalidate: 300 }, // cache on server for 5 minutes
    });
    const responseObject = response?.data?.data || response?.data || null;

    if (!responseObject || typeof responseObject !== 'object') {
      console.warn('No valid patient data found');
      return null;
    }
    const excludeFields = ['createdAt', 'assistantId', 'doctorId', 'id'];
    const filteredData = { ...responseObject };
    excludeFields.forEach(field => {
      if (field in filteredData) {
        delete filteredData[field];
      }
    });
    return filteredData;
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