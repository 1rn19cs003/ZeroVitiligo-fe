'use client';
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './styles.module.css';

export default function Profile() {
  const [user] = useState({
    id: 'user_123456789',
    username: 'john_doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567'
  });

  const [message, setMessage] = useState('');

  const initialValues = {
    email: user.email,
    phone: user.phone
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

  const handleSubmit = async (values, { setSubmitting }) => {
    setMessage('');
    
    // Simulate API call
    setTimeout(() => {
      setMessage('Profile updated successfully! (This is a demo)');
      setSubmitting(false);
    }, 1000);
  };

  const handleLogout = () => {
    alert('Logout clicked! (This is a demo)');
  };

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
              <div className={`${styles.message} ${styles.messageSuccess}`}>
                {message}
              </div>
            )}

            <div className={styles.grid}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Account Information</h2>
                <div className={styles.infoSection}>
                  <div className={styles.infoItem}>
                    <label>Username</label>
                    <p>{user.username}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>User ID</label>
                    <p className={styles.userId}>{user.id}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Email</label>
                    <p>{user.email}</p>
                  </div>
                  <div className={styles.infoItem}>
                    <label>Phone</label>
                    <p>{user.phone}</p>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Update Profile</h2>
                <Formik
                  initialValues={initialValues}
                  validate={validate}
                  onSubmit={handleSubmit}
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
                          className={`${styles.input} ${
                            errors.email && touched.email ? styles.inputError : ''
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
                          className={`${styles.input} ${
                            errors.phone && touched.phone ? styles.inputError : ''
                          }`}
                          placeholder="Enter your phone number"
                        />
                        <ErrorMessage name="phone" component="p" className={styles.errorText} />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
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