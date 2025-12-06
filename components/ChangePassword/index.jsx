'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useChangePassword, useGetCurrentUser } from '../../hooks/useAuth';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../../hooks/useLanguage';

export default function ChangePassword({ title, userName = false }) {
    const { t } = useLanguage();
    const changePasswordMutation = useChangePassword();
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const getCurrentUser = useGetCurrentUser();
    const currentUser = getCurrentUser();
    const router = useRouter();

    const initialValues = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
        email: ''
    };

    const validate = values => {
        const errors = {};

        if (!values.oldPassword) {
            errors.oldPassword = t('changePassword.validation.currentPasswordRequired');
        }

        if (!values.newPassword) {
            errors.newPassword = t('changePassword.validation.newPasswordRequired');
        } else if (values.newPassword.length < 8) {
            errors.newPassword = t('changePassword.validation.newPasswordLength');
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = t('changePassword.validation.confirmPasswordRequired');
        } else if (values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = t('changePassword.validation.passwordMismatch');
        }

        if (values.oldPassword && values.newPassword && values.oldPassword === values.newPassword) {
            errors.newPassword = t('changePassword.validation.samePassword');
        }

        if (userName && !values.email) {
            errors.email = t('changePassword.validation.emailRequired');
        } else if (userName && values.email && !/\S+@\S+\.\S+/.test(values.email)) {
            errors.email = t('changePassword.validation.emailInvalid');
        }

        return errors;
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        changePasswordMutation.mutate(
            {
                email: userName ? values.email : currentUser?.email,
                oldPassword: values.oldPassword,
                newPassword: values.newPassword
            },
            {
                onSuccess: () => {
                    router.push('/login');
                },
                onError: () => {
                    resetForm();
                },
                onSettled: () => {
                    setSubmitting(false);
                }
            }
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Lock className={styles.icon} size={24} />
                <h2 className={styles.title}>{title ?? t('changePassword.title')}</h2>
            </div>
            <p className={styles.description}>
                {t('changePassword.description')}
            </p>

            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className={styles.form}>
                        {/* Email */}
                        {userName && <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                {t('changePassword.fields.email.label')}
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type="text"
                                    id="email"
                                    name="email"
                                    className={`${styles.input} ${errors.email && touched.email ? styles.inputError : ''}`}
                                    placeholder={t('changePassword.fields.email.placeholder')}
                                />
                            </div>
                            <ErrorMessage name="email" component="p" className={styles.errorText} />
                        </div>}
                        {/* Old Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword" className={styles.label}>
                                {t('changePassword.fields.currentPassword.label')}
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showOldPassword ? 'text' : 'password'}
                                    id="oldPassword"
                                    name="oldPassword"
                                    className={`${styles.input} ${errors.oldPassword && touched.oldPassword ? styles.inputError : ''}`}
                                    placeholder={t('changePassword.fields.currentPassword.placeholder')}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowOldPassword(!showOldPassword)}
                                    aria-label={showOldPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <ErrorMessage name="oldPassword" component="p" className={styles.errorText} />
                        </div>

                        {/* New Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="newPassword" className={styles.label}>
                                {t('changePassword.fields.newPassword.label')}
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    className={`${styles.input} ${errors.newPassword && touched.newPassword ? styles.inputError : ''}`}
                                    placeholder={t('changePassword.fields.newPassword.placeholder')}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    aria-label={showNewPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <ErrorMessage name="newPassword" component="p" className={styles.errorText} />
                        </div>

                        {/* Confirm Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="confirmPassword" className={styles.label}>
                                {t('changePassword.fields.confirmPassword.label')}
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`${styles.input} ${errors.confirmPassword && touched.confirmPassword ? styles.inputError : ''}`}
                                    placeholder={t('changePassword.fields.confirmPassword.placeholder')}
                                />
                                <button
                                    type="button"
                                    className={styles.eyeButton}
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <ErrorMessage name="confirmPassword" component="p" className={styles.errorText} />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || changePasswordMutation.isLoading}
                            className={styles.submitButton}
                        >
                            {isSubmitting || changePasswordMutation.isLoading ? t('changePassword.buttons.submitting') : t('changePassword.buttons.submit')}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
