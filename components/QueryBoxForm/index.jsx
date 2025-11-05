"use client";
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './styles.module.css';
import { initialValues, validationSchema } from './index.utils';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FORM_OPTIONS } from '@/lib/constants';

export default function QueryBoxForm() {
    const URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            await axios.post(`${URL}/patients`, values);
            toast.success("Form submitted successfully!");
            resetForm();
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to submit the form. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1>Query Box</h1>
                    <p>Fill in your details and we'll connect with you on WhatsApp</p>
                </div>

                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit}
                >
                    {({ values, isSubmitting, errors, touched, isValid, dirty }) => (
                        <Form className={styles.formContainer}>

                            {/* === Name and Age === */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Name *</label>
                                    <Field
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Enter your full name"
                                        className={errors.name && touched.name ? styles.error : ''}
                                    />
                                    <ErrorMessage name="name" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="age">Age *</label>
                                    <Field
                                        type="number"
                                        id="age"
                                        name="age"
                                        placeholder="Enter your age"
                                        min="1"
                                        max="120"
                                        className={errors.age && touched.age ? styles.error : ''}
                                    />
                                    <ErrorMessage name="age" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* === Mobile Number === */}
                            <div className={styles.row}>

                                <div className={styles.formGroup}>
                                    <label htmlFor="mobile">Mobile Number (with country code) *</label>
                                    <Field
                                        type="tel"
                                        id="mobile"
                                        name="mobile"
                                        placeholder="+91 9876543210"
                                        pattern="^\+?[0-9\s-]{10,15}$"
                                        className={errors.mobile && touched.mobile ? styles.error : ''}
                                    />
                                    <ErrorMessage name="mobile" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="bodyWeight">Body Weight (kg) *</label>
                                    <Field
                                        type="number"
                                        id="bodyWeight"
                                        name="bodyWeight"
                                        placeholder="Enter weight in kg"
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
                                    <label htmlFor="fromIndia">Are you from India? *</label>
                                    <Field as="select" id="fromIndia" name="fromIndia" className={styles.selectBox}>
                                        <option value="">Select option</option>
                                        {FORM_OPTIONS.yesNo.map((option) => (
                                            <option key={option} value={option}>{option}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="fromIndia" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="vitiligoDuration">How long you have Vitiligo (years)? * </label>
                                    <Field
                                        type="number"
                                        id="vitiligoDuration"
                                        name="vitiligoDuration"
                                        placeholder="For less than 1 year enter 1"
                                        min="1"
                                        max="500"
                                        className={errors.vitiligoDuration && touched.vitiligoDuration ? styles.error : ''}
                                    />
                                    <ErrorMessage name="vitiligoDuration" component="span" className={styles.errorText} />
                                </div>
                            </div>
                            {values.fromIndia === "Yes" ? (
                                <div className={styles.formGroup}>
                                    <label htmlFor="state">Select your state *</label>
                                    <Field as="select" id="state" name="state" className={styles.selectBox}>
                                        <option value="">Select State</option>
                                        {FORM_OPTIONS.indianStates.map((state) => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="state" component="span" className={styles.errorText} />
                                </div>
                            ) : values.fromIndia === "No" ? (
                                <div className={styles.formGroup}>
                                    <label htmlFor="country">Enter your country *</label>
                                    <Field
                                        type="text"
                                        id="country"
                                        name="country"
                                        placeholder="Enter your country"
                                        className={errors.country && touched.country ? styles.error : ''}
                                    />
                                    <ErrorMessage name="country" component="span" className={styles.errorText} />
                                </div>
                            ) : null}

                            {/* === Medicine / Family History === */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="currentMedicine">Taking medicine now? *</label>
                                    <Field as="select" id="currentMedicine" name="currentMedicine">
                                        <option value="">Select option</option>
                                        {FORM_OPTIONS.yesNo.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="currentMedicine" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="familyHistory">Vitiligo History in Family *</label>
                                    <Field as="select" id="familyHistory" name="familyHistory">
                                        <option value="">Select option</option>
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
                                    <label htmlFor="covidVaccine">Taken COVID vaccine? *</label>
                                    <Field as="select" id="covidVaccine" name="covidVaccine">
                                        <option value="">Select option</option>
                                        {FORM_OPTIONS.covidVaccine.map((opt) => (
                                            <option key={opt} value={opt.toLowerCase()}>{opt}</option>
                                        ))}
                                    </Field>
                                    <ErrorMessage name="covidVaccine" component="span" className={styles.errorText} />
                                </div>

                                {values.covidVaccine === "yes" && (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="vaccineDoses">Number of doses *</label>
                                        <Field as="select" id="vaccineDoses" name="vaccineDoses">
                                            <option value="">Select doses</option>
                                            {FORM_OPTIONS.vaccineDoses.map((dose) => (
                                                <option key={dose} value={dose}>{dose}</option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="vaccineDoses" component="span" className={styles.errorText} />
                                    </div>
                                )}
                            </div>

                            {/* === Other Disease === */}
                            <div className={styles.formGroup}>
                                <label htmlFor="hasDisease">Do you have any other disease?</label>
                                <Field as="select" id="hasDisease" name="hasDisease" className={styles.selectBox}>
                                    <option value="">Select option</option>
                                    {FORM_OPTIONS.yesNo.map((opt) => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </Field>
                            </div>

                            {values.hasDisease === "Yes" && (
                                <div className={styles.formGroup}>
                                    <label htmlFor="diseaseDetails">Please mention your disease (optional)</label>
                                    <Field
                                        type="text"
                                        id="diseaseDetails"
                                        name="diseaseDetails"
                                        placeholder="e.g., Diabetes, Thyroid issues"
                                        className={styles.inputBox}
                                    />
                                </div>
                            )}


                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !isValid || !dirty}>
                                {isSubmitting ? "Submitting..." : "Send Query"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}
