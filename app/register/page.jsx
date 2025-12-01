'use client';

import { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Link from 'next/link';
import styles from './styles.module.css';
import { useIsAuthenticated, useRegister } from "../../hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

export default function Register() {
  const router = useRouter();
  const registerMutation = useRegister();
  const isAuthenticated = useIsAuthenticated()();
  const { t } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const initialValues = {
    name: '',
    password: '',
    email: '',
    phone: ''
  };

  const validate = (values) => {
    const errors = {};

    if (!values.name.trim()) {
      errors.name = t('register.validation.nameRequired');
    } else if (values.name.length < 3) {
      errors.name = t('register.validation.nameLength');
    }

    if (!values.password) {
      errors.password = t('register.validation.passwordRequired');
    } else if (values.password.length < 6) {
      errors.password = t('register.validation.passwordLength');
    }

    if (values.email && !/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t('register.validation.emailInvalid');
    }

    if (values.phone && !/^\d{10}$/.test(values.phone)) {
      errors.phone = t('register.validation.phoneInvalid');
    }

    return errors;
  };

  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    registerMutation.mutate(values, {
      onSuccess: () => {
        router.back();
      },
      onError: (error) => {
        setErrors({
          submit: error?.response?.data?.error || t('register.validation.failed')
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
        <h1 className={styles.title}>{t('register.title')}</h1>
        <p className={styles.subtitle}>{t('register.subtitle')}</p>

        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, errors, touched }) => (
            <Form className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>{t('register.name')}</label>
                <Field
                  type="text"
                  id="name"
                  name="name"
                  className={`${styles.input} ${errors.name && touched.name ? styles.inputError : ''}`}
                  placeholder={t('register.namePlaceholder')}
                />
                <ErrorMessage name="name" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>{t('register.email')}</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                  placeholder={t('register.emailPlaceholder')}
                />
                <ErrorMessage name="email" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>{t('register.phone')}</label>
                <Field
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`${styles.input} ${errors.phone && touched.phone ? styles.inputError : ''}`}
                  placeholder={t('register.phonePlaceholder')}
                />
                <ErrorMessage name="phone" component="p" className={styles.errorText} />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>{t('register.password')}</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  className={`${styles.input} ${errors.password && touched.password ? styles.inputError : ''}`}
                  placeholder={t('register.passwordPlaceholder')}
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
                disabled={isSubmitting || registerMutation.isLoading}
                className={styles.submitButton}
              >
                {isSubmitting || registerMutation.isLoading ? t('register.creatingAccount') : t('register.createAccount')}
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.linkContainer}>
          <p className={styles.linkText}>
            {t('register.alreadyAccount')}{' '}
            <Link href="/login" className={styles.link}>{t('register.signIn')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
