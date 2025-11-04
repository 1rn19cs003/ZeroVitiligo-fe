import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import styles from './styles.module.css';
import { initialValues, validationSchema, generateWhatsAppMessage } from './index.utils';
import axios from 'axios';

const WHATSAPP_NUMBER = "919876543210";
const URL = process.env.NEXT_PUBLIC_SERVER_URL;
export default function QueryBoxForm() {
    const [submitStatus, setSubmitStatus] = useState(''); // 'success', 'error', ''
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            setSubmitStatus('');

            // Option 1: Send to your API for automation
            await axios.post(URL + '/patients', values)
                .then(response => {
                    console.log({ response });
                }).catch(error => {
                    console.log('Error:', error);
                })
        } catch (error) {
            console.error('Submission error:', error);
            setSubmitStatus('error');
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
                            <div className={styles.row}>
                                {/* Single Column for Name */}
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
                                {/* Two-Column Row for Age and Body Weight */}
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

                            <div className={styles.row}>
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

                            {/* Single Column for Address */}
                            <div className={styles.formGroup}>
                                <label htmlFor="address">Address *</label>
                                <Field
                                    as="textarea"
                                    id="address"
                                    name="address"
                                    placeholder="Enter your complete address"
                                    rows="3"
                                    className={errors.address && touched.address ? styles.error : ''}
                                />
                                <ErrorMessage name="address" component="span" className={styles.errorText} />
                            </div>

                            {/* Two-Column Row for Medicine and Family History */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="currentMedicine">Taking medicine now? *</label>
                                    <Field
                                        as="select"
                                        id="currentMedicine"
                                        name="currentMedicine"
                                        className={errors.currentMedicine && touched.currentMedicine ? styles.error : ''}
                                    >
                                        <option value="">Select option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Field>
                                    <ErrorMessage name="currentMedicine" component="span" className={styles.errorText} />
                                </div>

                                <div className={styles.formGroup}>
                                    <label htmlFor="familyHistory">Vitiligo History in Family *</label>
                                    <Field
                                        as="select"
                                        id="familyHistory"
                                        name="familyHistory"
                                        className={errors.familyHistory && touched.familyHistory ? styles.error : ''}
                                    >
                                        <option value="">Select option</option>
                                        <option value="Yes">Yes</option>
                                        <option value="No">No</option>
                                    </Field>
                                    <ErrorMessage name="familyHistory" component="span" className={styles.errorText} />
                                </div>
                            </div>

                            {/* Two-Column Row for COVID Vaccine and Doses */}
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="covidVaccine">Taken COVID vaccine? *</label>
                                    <Field
                                        as="select"
                                        id="covidVaccine"
                                        name="covidVaccine"
                                        className={errors.covidVaccine && touched.covidVaccine ? styles.error : ''}
                                    >
                                        <option value="">Select option</option>
                                        <option value="yes">Yes</option>
                                        <option value="no">No</option>
                                    </Field>
                                    <ErrorMessage name="covidVaccine" component="span" className={styles.errorText} />
                                </div>

                                {/* Conditional Doses Field */}
                                {values.covidVaccine === 'yes' ? (
                                    <div className={styles.formGroup}>
                                        <label htmlFor="vaccineDoses">Number of doses? *</label>
                                        <Field
                                            as="select"
                                            id="vaccineDoses"
                                            name="vaccineDoses"
                                            className={errors.vaccineDoses && touched.vaccineDoses ? styles.error : ''}
                                        >
                                            <option value="">Select doses</option>
                                            <option value="0 dose">0 dose</option>
                                            <option value="1 doses">1 doses</option>
                                            <option value="2 doses">2 doses</option>
                                        </Field>
                                        <ErrorMessage name="vaccineDoses" component="span" className={styles.errorText} />
                                    </div>
                                ) : (
                                    <div className={styles.formGroup} />
                                )}
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="otherDisease">Do you have any other disease? (Optional)</label>
                                <Field
                                    as="textarea"
                                    id="otherDisease"
                                    name="otherDisease"
                                    placeholder="Please specify if any (e.g., Diabetes, Thyroid issues) or NA"
                                    rows="2"
                                />
                            </div>

                            <button type="submit" className={styles.submitBtn} disabled={isSubmitting || !isValid || !dirty}>
                                {submitStatus ? 'Submitting...' : 'Send Query'}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}