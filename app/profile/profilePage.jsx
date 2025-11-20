'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './styles.module.css';
import RoleBadge from '@/components/RoleBadge';
import { LogOut } from 'lucide-react';
import { useUserStore } from '../../store/useDoctorStore';
import { useGetCurrentUser, useGetProfileById, useLogout, useUpdateProfile } from '../../hooks/useAuth';

export default function Profile() {
   const searchParams = useSearchParams();
  const profileId = searchParams.get('id')
  const mode = searchParams.get('mode')
  const router = useRouter();
  const { role, setData, setRole } = useUserStore();
  const updateProfileMutation = useUpdateProfile();
  const { data: profile, isLoading: profileLoading } = useGetProfileById(profileId);
  const currentUser = useGetCurrentUser()();
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const logout = useLogout();
  const updateflow = mode == 'update' && role === 'ADMIN'

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    setUser(profile);
  }, [currentUser, profile, router]);

  const initialValues = {
    email: user?.email || '',
    phone: user?.mobile || ''
  };

  const validate = values => {
    const errors = {};
    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }
    if (values.phone && !/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }
    return errors;
  };

  const handleSubmit = (values, { setSubmitting, resetForm }) => {
    setMessage('');
    updateProfileMutation.mutate(values, {
      onSuccess: updatedUser => {
        setMessage('Profile updated successfully!');
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        resetForm({ values });
      },
      onError: error => {
        setMessage(error?.response?.data?.error || 'Failed to update profile');
      },
      onSettled: () => {
        setSubmitting(false);
      }
    });
  };

  const handleLogout = () => {
    logout();
    setData({});
    setRole('');
    router.push('/');
  };

  if (!user || profileLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className="text-center">
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <div className={styles.header}>
              <div className={styles.titleSection}>
                <h1>Profile</h1>
                <p>Manage your account information</p>
              </div>
              {!updateflow && <button
                onClick={handleLogout}
                className={styles.logoutButton}
                title="Logout"
              >
                <LogOut size={20} />
              </button>}
            </div>

            {message && (
              <div
                className={`${styles.message} ${message.includes('successfully')
                  ? styles.messageSuccess
                  : styles.messageError
                  }`}
              >
                {message}
              </div>
            )}

            <div className={styles.grid}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Information</h2>
                <div className={styles.infoSection}>
                  <div className={styles.infoItem}>
                    <label>Name</label>
                    <p>{user?.name}</p>
                  </div>
                  {user?.email && (
                    <div className={styles.infoItem}>
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                  )}
                  {user?.role && (
                    <div className={styles.infoItem}>
                      <label>Role</label>
                      <div className={styles.roleContainer}>
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  )}
                  {user?.phone && (
                    <div className={styles.infoItem}>
                      <label>Phone</label>
                      <p>{user.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Update Profile</h2>
                <Formik
                  enableReinitialize
                  initialValues={initialValues}
                  validate={validate}
                  onSubmit={handleSubmit}
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className={styles.form}>
                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          disabled={!updateflow}
                          className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component="p" className={styles.errorText} />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>Phone Number</label>
                        <Field
                          type="tel"
                          id="phone"
                          name="phone"
                          disabled={!updateflow}
                          className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone" component="p" className={styles.errorText} />
                      </div>

                      {updateflow && <button
                        type="submit"
                        disabled={isSubmitting || updateProfileMutation.isLoading}
                        className={styles.submitButton}
                      >
                        {isSubmitting || updateProfileMutation.isLoading ? 'Updating...' : 'Update Profile'}
                      </button>}
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}