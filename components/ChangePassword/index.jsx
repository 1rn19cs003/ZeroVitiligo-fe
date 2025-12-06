'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { useChangePassword, useGetCurrentUser } from '../../hooks/useAuth';
import styles from './styles.module.css';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
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
        confirmPassword: ''
    };

    const validate = values => {
        const errors = {};

        if (!values.oldPassword) {
            errors.oldPassword = 'Current password is required';
        }

        if (!values.newPassword) {
            errors.newPassword = 'New password is required';
        } else if (values.newPassword.length < 8) {
            errors.newPassword = 'Password must be at least 8 characters long';
        }

        if (!values.confirmPassword) {
            errors.confirmPassword = 'Please confirm your new password';
        } else if (values.newPassword !== values.confirmPassword) {
            errors.confirmPassword = 'Passwords do not match';
        }

        if (values.oldPassword && values.newPassword && values.oldPassword === values.newPassword) {
            errors.newPassword = 'New password must be different from current password';
        }

        return errors;
    };

    const handleSubmit = (values, { setSubmitting, resetForm }) => {
        changePasswordMutation.mutate(
            {
                email: currentUser?.email,
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
                <h2 className={styles.title}>Change Password</h2>
            </div>
            <p className={styles.description}>
                Update your password to keep your account secure. You will be logged out after changing your password.
            </p>

            <Formik
                initialValues={initialValues}
                validate={validate}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className={styles.form}>
                        {/* Old Password */}
                        <div className={styles.formGroup}>
                            <label htmlFor="oldPassword" className={styles.label}>
                                Current Password
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showOldPassword ? 'text' : 'password'}
                                    id="oldPassword"
                                    name="oldPassword"
                                    className={`${styles.input} ${errors.oldPassword && touched.oldPassword ? styles.inputError : ''}`}
                                    placeholder="Enter your current password"
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
                                New Password
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    className={`${styles.input} ${errors.newPassword && touched.newPassword ? styles.inputError : ''}`}
                                    placeholder="Enter your new password"
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
                                Confirm New Password
                            </label>
                            <div className={styles.passwordWrapper}>
                                <Field
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    className={`${styles.input} ${errors.confirmPassword && touched.confirmPassword ? styles.inputError : ''}`}
                                    placeholder="Confirm your new password"
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
                            {isSubmitting || changePasswordMutation.isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}
