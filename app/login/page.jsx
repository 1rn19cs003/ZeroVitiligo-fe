'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import styles from './styles.module.css';
import { useUserStore } from '../../store/useDoctorStore';
import { useGetCurrentUser, useLogin } from '../../hooks/useAuth';

export default function Login() {
  const router = useRouter();
  const { setData, setRole } = useUserStore();
  const loginMutation = useLogin();

  const initialValues = {
    email: '',
    password: ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email.trim()) {
      errors.email = 'Email is required';
    }
    if (!values.password) {
      errors.password = 'Password is required';
    }
    return errors;
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    setErrors({});
    loginMutation.mutate(values, {
      onSuccess: () => {
        const userInfo = useGetCurrentUser()();
        if (userInfo) {
          setData(userInfo);
          setRole(userInfo.role);
        }
        router.push('/');
      },
      onError: (error) => {
        setErrors({
          submit: error?.response?.data?.error || 'Login failed. Please check your credentials.'
        });
      },
      onSettled: () => {
        setSubmitting(false);
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>
          Welcome Back
        </h1>
        <p className={styles.subtitle}>
          Sign in to your account
        </p>

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
                  type="text"
                  id="email"
                  name="email"
                  className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
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
                disabled={isSubmitting || loginMutation.isLoading}
                className={styles.submitButton}
              >
                {(isSubmitting || loginMutation.isLoading) ? 'Signing In...' : 'Sign In'}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.linkContainer}>
          <p className={styles.linkText}>
            Don't have an account?{' '}
            <Link href="/register" className={styles.link}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}