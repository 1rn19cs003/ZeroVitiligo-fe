"use client";

import { useSearchParams } from 'next/navigation';
import AppointmentForm from '../../../../../components/Appointment';
import Loader from '../../../../../components/Loader';
import ErrorMessage from '../../../../../components/Error';
import { useAppointmentStatus } from '../../../../../hooks/useAppointment';
import { usePatientData } from '../../../../../hooks/usePatients';
import { VISIT_MODE } from '../../../../../lib/constants';


export default function VisitingFormWrapper({ id }) {
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  let newStatus = 'ONGOING';
  let pageMode = VISIT_MODE.VISIT;
  if (mode === VISIT_MODE.HISTORY) {
    pageMode = VISIT_MODE.HISTORY;
  } else if (mode === VISIT_MODE.SCHEDULE) {
    newStatus = 'SCHEDULED'
    pageMode = VISIT_MODE.SCHEDULE;
  }
  const { data: patientData, isLoading, error } = usePatientData(id);
  const { data: statusData, isLoading: statusLoading, error: statusError } = useAppointmentStatus();
  if (isLoading || statusLoading) return <Loader message='Loading Patient Data...' />
  if ((error || !patientData) || (statusError || !statusData)) return <ErrorMessage message='Failed to load patient data.' />;

  const initialData = {
    name: patientData.name,
    patientId: patientData.patientId ?? 'NA',
    age: patientData.age,
    contactNo: patientData.mobile,
    comments: '',
    medication: '',
    notes: '',
    status: newStatus,
    appointmentDate: new Date(),
  };



  return <AppointmentForm
    initialData={initialData}
    pageMode={pageMode}
    patientData={patientData}
    statusData={statusData}
  />;
}
