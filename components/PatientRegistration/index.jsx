"use client";
import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './styles.module.css';
import { initialValues, validationSchema } from './index.utils';
import toast from 'react-hot-toast';
import { FORM_OPTIONS, PATIENT_STATUS } from '@/lib/constants';
import RegistrationSuccess from "@/components/RegistrationSuccess";
import { useLanguage } from '@/hooks/useLanguage';
import api from "@/hooks/axios.config";

export default function PatientRegistration() {
    const { t } = useLanguage();

    const URL = process.env.NEXT_PUBLIC_SERVER_URL;
    const [registeredId, setRegisteredId] = useState(null);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const payload = {
                ...values,
                status: PATIENT_STATUS.NEW_REGISTRATION
            }
            const response = await api.post(`${URL}/patients`, payload);
            if (response.data.data) {
                toast.success(t('registration.messages.success'));
                setRegisteredId(response.data.data.patientId)
                resetForm();
            } else {
                toast.error(t('registration.messages.generalError'));
            }
        } catch (error) {
            console.error("Submission error:", error);
            toast.error(t('registration.messages.error'));
        } finally {
            setSubmitting(false);
        }
    };

    if (registeredId) {
        return <RegistrationSuccess registeredId={registeredId} onBack={() => setRegisteredId(null)} />;
    }

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1>{t('registration.title')}</h1>
                    <p>{t('registration.subtitle')}</p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting, errors, touched, isValid, dirty }) => (
                        <Form className={styles.formContainer}>

                            {/* === Name, Age and Gender === */}
                            <div className={styles.rowThree}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">{t('registration.fields.name.label')}</label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder={t('registration.fields.name.placeholder')}
                                        className={errors.name && touched.name ? styles.error : ''}
                                    />
                                    <ErrorMessage name="name" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="age">{t('registration.fields.age.label')}</label>
                                    <Field
                                        type="number"
                                        id="age"
                                        name="age"
                                        placeholder={t('registration.fields.age.placeholder')}
                                        min="1"
                                        max="120"
                                        className={errors.age && touched.age ? styles.error : ''}
                                    />
                                    <ErrorMessage name="age" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="gender">{t('registration.fields.gender.label')}</label>
                                    <Field as="select" id="gender" name="gender" className={`${styles.selectBox} ${errors.gender && touched.gender ? styles.error : ''}`}>
                                        <option value="">{t('registration.fields.gender.placeholder')}</option>
                                        {FORM_OPTIONS.gender.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="gender" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* === Mobile Number === */}
                            <div className={styles.row}>

                                <div className={styles.formGroup}>
                                    <label htmlFor="mobile">{t('registration.fields.mobile.label')}</label>
                                    <Field
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder={t('registration.fields.mobile.placeholder')}
                                        pattern="^\+?[0-9\s-]{10,15}$"
                                        className={errors.mobile && touched.mobile ? styles.error : ''}
                                    />
                                    <ErrorMessage name="mobile" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="bodyWeight">{t('registration.fields.bodyWeight.label')}</label>
                                    <Field
                                        type="number"
                                        id="bodyWeight"
                                        name="bodyWeight"
                                        placeholder={t('registration.fields.bodyWeight.placeholder')}
                                        min="1"
                                        max="500"
                                        className={errors.bodyWeight && touched.bodyWeight ? styles.error : ''}
                                    />
                                    <ErrorMessage name="bodyWeight" component="span" className={styles.errorText} />
                                </div>
                            </div>
                            {/* === India / State === */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="vitiligoDuration">{t('registration.fields.vitiligoDuration.label')}</label>
                                    <Field
                                        type="number"
                                        id="vitiligoDuration"
                                        name="vitiligoDuration"
                                        placeholder={t('registration.fields.vitiligoDuration.placeholder')}
                                        min="1"
                                        max="500"
                                        className={errors.vitiligoDuration && touched.vitiligoDuration ? styles.error : ''}
                                    />
                                    <ErrorMessage name="vitiligoDuration" component="span" className={styles.errorText} />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="state">{t('registration.fields.state.label')}</label>
                                    <Field as="select" id="state" name="state" className={styles.selectBox}>
                                        <option value="">{t('registration.fields.state.placeholder')}</option>
                                        {FORM_OPTIONS.indianStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="state" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* === Medicine / Family History === */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="currentMedicine">{t('registration.fields.currentMedicine.label')}</label>
                                    <Field as="select" id="currentMedicine" name="currentMedicine">
                                        <option value="">{t('registration.fields.currentMedicine.placeholder')}</option>
                                        {FORM_OPTIONS.yesNo.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="currentMedicine" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="familyHistory">{t('registration.fields.familyHistory.label')}</label>
                                    <Field as="select" id="familyHistory" name="familyHistory">
                                        <option value="">{t('registration.fields.familyHistory.placeholder')}</option>
                                        {FORM_OPTIONS.yesNo.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="familyHistory" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* === COVID Vaccine === */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="vaccineDoses">{t('registration.fields.vaccineDoses.label')}</label>
                                    <Field as="select" id="vaccineDoses" name="vaccineDoses">
                                        <option value="">{t('registration.fields.vaccineDoses.placeholder')}</option>
                                        {FORM_OPTIONS.vaccineDoses.map((dose) => (
                                            <option key={dose} value={dose}>{dose}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="vaccineDoses" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* === Other Disease === */}
                            <div className={styles.formGroup}>
                                <label htmlFor="hasDisease">{t('registration.fields.hasDisease.label')}</label>
                                <Field as="select" id="hasDisease" name="hasDisease" className={styles.selectBox}>
                                    <option value="">{t('registration.fields.hasDisease.placeholder')}</option>
                                    {FORM_OPTIONS.yesNo.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </Field>
                            </div>

                            {values.hasDisease === "Yes" && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="diseaseDetails">{t('registration.fields.diseaseDetails.label')}</label>
                                    <Field
                                        type="text"
                                        id="diseaseDetails"
                                        name="diseaseDetails"
                                        placeholder={t('registration.fields.diseaseDetails.placeholder')}
                                        className={styles.inputBox}
                                    />
                                </div>
                            )}

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <Field type="checkbox" name="terms" />
                                    <span className={styles.checkboxText}>
                                        {t('registration.fields.terms.label')}
                                    </span>
                                </label>
                                <ErrorMessage name="terms" component="span" className={styles.errorText} />
                            </div>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={isSubmitting || !isValid || !dirty || !values.terms}
                            >
                                {isSubmitting ? t('registration.buttons.submitting') : t('registration.buttons.submit')}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
