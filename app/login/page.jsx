'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import styles from './styles.module.css';
import { useUserStore } from '../../store/useStatesStore';
import { useGetCurrentUser, useLogin } from '../../hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';

export default function Login() {
  const router = useRouter();
  const { setData, setRole } = useUserStore();
  const loginMutation = useLogin();
  const { t } = useLanguage();

  const initialValues = {
    email: '',
    password: ''
  };

  const validate = (values) => {
    const errors = {};
    if (!values.email.trim()) {
      errors.email = t('login.validation.emailRequired');
    }
    if (!values.password) {
      errors.password = t('login.validation.passwordRequired');
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
          submit: error?.response?.data?.error || t('login.validation.failed')
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
          {t('login.title')}
        </h1>
        <p className={styles.subtitle}>
          {t('login.subtitle')}
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
                  {t('login.email')}
                </label>
                <Field
                  type="text"
                  id="email"
                  name="email"
                  className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder={t('login.emailPlaceholder')}
                />
                <ErrorMessage name="email" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>
                  {t('login.password')}
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
                  placeholder={t('login.passwordPlaceholder')}
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
                {(isSubmitting || loginMutation.isLoading) ? t('login.signingIn') : t('login.signIn')}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.linkContainer}>
          <p className={styles.linkText}>
            {t('login.noAccount')}{' '}
            <Link href="/add-assistant" className={styles.link}>
              {t('login.signUp')}
            </Link>
            {' '}
            <Link href="/forgot-password" className={styles.forgotPassword}>
              {t('login.forgotPassword')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}