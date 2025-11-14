"use client";
import { getPatientData } from '../../../../hooks/usePatients';
import PatientDetailsClient from './PatientDetailsClient';
import Loader from '../../../../components/Loader';
import ErrorMessage from '../../../../components/Error';

export default function PatientDetailsWrapper({ id }) {
    const { data: patientData, isLoading, error } = getPatientData(id);

    if (isLoading) return <Loader message='Loading Patient Data...' />
    if (error || !patientData) return <ErrorMessage message='Failed to load patient data.' />;

    return <PatientDetailsClient patientData={patientData} />;
}
