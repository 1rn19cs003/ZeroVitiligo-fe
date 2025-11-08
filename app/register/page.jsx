'use client';
import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import { authService } from '../../lib/auth';
import styles from './styles.module.css';

export default function Register() {
  const router = useRouter();


  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const initialValues = {
    name: '',
    password: '',
    email: '',
    phone: ''
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = 'name is required';
    } else if (values.name.length < 3) {
      errors.name = 'name must be at least 3 characters';
    }

    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = 'Email is invalid';
    }

    if (values.phone && !/^\d{10}$/.test(values.phone)) {
      errors.phone = 'Phone number must be 10 digits';
    }

    return errors;
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await authService.register(values);
      router.push('/');
    } catch (error) {
      setErrors({
        submit: error.response?.data?.error || 'Registration failed. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Create Account
        </h1>
        <p className={styles.subtitle}>
          Join us today!
        </p>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  Name *
                </label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''
                    }`}
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="p" className={styles.errorText} />
              </div>

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
                  placeholder="Enter your email (optional)"
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
                  placeholder="Enter your phone number (optional)"
                />
                <ErrorMessage name="phone" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password *
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''
                    }`}
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="p" className={styles.errorText} />
              </div>

              {errors.submit && (
                <div className={styles.errorAlert}>
                  <p className={styles.errorText}>{errors.submit}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.linkContainer}>
          <p className={styles.linkText}>
            Already have an account?{' '}
            <Link href="/login" className={styles.link}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}