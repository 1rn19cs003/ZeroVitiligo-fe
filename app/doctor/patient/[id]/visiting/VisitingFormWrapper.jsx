"use client";

import AppointmentForm from '../../../../../components/Appointment';
import Loader from '../../../../../components/Loader';
import ErrorMessage from '../../../../../components/Error';
import { authService } from '../../../../../lib/auth'
import { useAppointmentStatus, useCreateAppointment } from '../../../../../hooks/useAppointment';
import { safeDateToISOString } from '../../../../../Utils/index.utils'
import { usePatientData } from '../../../../../hooks/usePatients';

export default function VisitingFormWrapper({ id }) {
  const { data: patientData, isLoading, error } = usePatientData(id);
  const { data: statusData, isLoading: statusLoading, error: statusError } = useAppointmentStatus();
  const createAppointmentMutation = useCreateAppointment();
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
    status: 'ONGOING',
    appointmentDate: new Date().toLocaleDateString(),
  };

  const handleUpdate = (updatedData) => {
    const loggedInUserId = authService.getCurrentUser().id;
    createAppointmentMutation.mutate({
      doctorId: loggedInUserId,
      patientId: patientData.id,
      appointmentDate: safeDateToISOString(updatedData.appointmentDate),
      reason: updatedData.comments,
      medication: updatedData.medication,
      notes: updatedData.notes,
      status: updatedData.status === 'ONGOING' ? statusData.find(element => element === 'COMPLETED') : updatedData.status,
    });
  };

  return <AppointmentForm initialData={initialData} onUpdate={handleUpdate} />;
}
