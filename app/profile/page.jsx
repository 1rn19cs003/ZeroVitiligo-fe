'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { authService } from '@/lib/auth';
import styles from './styles.module.css';
import RoleBadge from '@/components/RoleBadge';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    setUser(currentUser);

    fetchProfile();
  }, [router]);

  const fetchProfile = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const initialValues = {
    email: user?.email || '',
    phone: user?.phone || ''
  };

  const validate = (values) => {
    const errors = {};

    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (values.phone && !/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setMessage('');

    try {
      await authService.updateProfile(values);
      setMessage('Profile updated successfully!');
      setUser(response);
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Reset form with new values
      resetForm({ values });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  if (!user) {
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
              <button
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                Logout
              </button>
            </div>

            {message && (
              <div className={`${styles.message} ${message.includes('successfully')
                ? styles.messageSuccess
                : styles.messageError
                }`}>
                {message}
              </div>
            )}

            <div className={styles.grid}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Information</h2>
                <div className={styles.infoSection}>
                  <div className={styles.infoItem}>
                    <label>name</label>
                    <p>{user?.name}</p>
                  </div>
                  {user?.email && (
                    <div className={styles.infoItem}>
                      <label>Email</label>
                      <p>{user?.email}</p>
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
                      <p>{user?.phone}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Update Profile</h2>
                <Formik
                  initialValues={initialValues}
                  validate={validate}
                  onSubmit={handleSubmit}
                  enableReinitialize
                >
                  {({ isSubmitting, errors, touched }) => (
                    <Form className={styles.form}>
                      <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>
                          Email
                        </label>
                        <Field
                          type="email"
                          id="email"
                          name="email"
                          className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''
                            }`}
                          placeholder="Enter your email"
                        />
                        <ErrorMessage name="email" component="p" className={styles.errorText} />
                      </div>

                      <div className={styles.formGroup}>
                        <label htmlFor="phone" className={styles.label}>
                          Phone Number
                        </label>
                        <Field
                          type="tel"
                          id="phone"
                          name="phone"
                          className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''
                            }`}
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone" component="p" className={styles.errorText} />
                      </div>

                      <button
                        type="submit"
                        // disabled={isSubmitting}
                        disabled={true}
                        className={styles.submitButton}
                      >
                        {isSubmitting ? 'Updating...' : 'Update Profile'}
                      </button>
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