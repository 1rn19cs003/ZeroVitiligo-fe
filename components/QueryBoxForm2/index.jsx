import React, { useState } from 'react';
import styles from './styles.module.css';

export default function QueryBoxForm2 () {
    // ⭐ PASTE YOUR WHATSAPP NUMBER HERE (with country code, no + or spaces) ⭐
    const WHATSAPP_NUMBER = "919876543210 "; // Example: 919876543210 for India

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        bodyWeight: '',
        address: '',
        vitiligoDuration: '',
        currentMedicine: '',
        covidVaccine: '',
        vaccineDoses: '',
        otherDisease: '',
        familyHistory: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.age) newErrors.age = 'Age is required';
        if (!formData.bodyWeight) newErrors.bodyWeight = 'Body weight is required';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.vitiligoDuration) newErrors.vitiligoDuration = 'Please select duration';
        if (!formData.currentMedicine) newErrors.currentMedicine = 'Please select an option';
        if (!formData.covidVaccine) newErrors.covidVaccine = 'Please select an option';
        if (formData.covidVaccine === 'yes' && !formData.vaccineDoses) {
            newErrors.vaccineDoses = 'Please select number of doses';
        }
        if (!formData.familyHistory) newErrors.familyHistory = 'Please select an option';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        let message = `*New Vitiligo Query*\n\n`;
        message += `*Name:* ${formData.name}\n`;
        message += `*Age:* ${formData.age} years\n`;
        message += `*Body Weight:* ${formData.bodyWeight} kg\n`;
        message += `*Address:* ${formData.address}\n`;
        message += `*Vitiligo Duration:* ${formData.vitiligoDuration}\n`;
        message += `*Currently Taking Medicine:* ${formData.currentMedicine}\n`;
        message += `*COVID Vaccine:* ${formData.covidVaccine}`;

        if (formData.covidVaccine === 'yes') {
            message += ` (${formData.vaccineDoses} doses)`;
        }
        message += `\n`;

        message += `*Other Disease:* ${formData.otherDisease || 'None'}\n`;
        message += `*Family History:* ${formData.familyHistory}\n`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className={styles.container}>
            <div className={styles.formWrapper}>
                <div className={styles.header}>
                    <h1>Query Box</h1>
                    <p>Fill in your details and we'll connect with you on WhatsApp</p>
                </div>

                <form className={styles.formContainer} onSubmit={handleSubmit}>
                    {/* Two-Column Row for Age and Body Weight */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="age">Age *</label>
                            <input
                                type="number"
                                id="age"
                                name="age"
                                value={formData.age}
                                onChange={handleChange}
                                placeholder="Enter your age"
                                min="1"
                                max="120"
                                className={errors.age ? styles.error : ''}
                            />
                            {errors.age && <span className={styles.errorText}>{errors.age}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="bodyWeight">Body Weight (kg) *</label>
                            <input
                                type="number"
                                id="bodyWeight"
                                name="bodyWeight"
                                value={formData.bodyWeight}
                                onChange={handleChange}
                                placeholder="Enter weight in kg"
                                min="1"
                                max="500"
                                className={errors.bodyWeight ? styles.error : ''}
                            />
                            {errors.bodyWeight && <span className={styles.errorText}>{errors.bodyWeight}</span>}
                        </div>
                    </div>
                    
                    {/* Single Column for Name */}
                    <div className={styles.formGroup}>
                        <label htmlFor="name">Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            className={errors.name ? styles.error : ''}
                        />
                        {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>

                    {/* Single Column for Address */}
                    <div className={styles.formGroup}>
                        <label htmlFor="address">Address *</label>
                        <textarea
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Enter your complete address"
                            rows="3"
                            className={errors.address ? styles.error : ''}
                        />
                        {errors.address && <span className={styles.errorText}>{errors.address}</span>}
                    </div>
                    
                    {/* Single Column for Vitiligo Duration */}
                    <div className={styles.formGroup}>
                        <label htmlFor="vitiligoDuration">How long you have Vitiligo? *</label>
                        <select
                            id="vitiligoDuration"
                            name="vitiligoDuration"
                            value={formData.vitiligoDuration}
                            onChange={handleChange}
                            className={errors.vitiligoDuration ? styles.error : ''}
                        >
                            <option value="">Select duration</option>
                            <option value="Less than 6 months">Less than 6 months</option>
                            <option value="6 months - 1 year">6 months - 1 year</option>
                            <option value="1-2 years">1-2 years</option>
                            <option value="2-5 years">2-5 years</option>
                            <option value="5-10 years">5-10 years</option>
                            <option value="More than 10 years">More than 10 years</option>
                        </select>
                        {errors.vitiligoDuration && <span className={styles.errorText}>{errors.vitiligoDuration}</span>}
                    </div>

                    {/* Two-Column Row for Medicine and Family History */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="currentMedicine">Taking medicine now? *</label>
                            <select
                                id="currentMedicine"
                                name="currentMedicine"
                                value={formData.currentMedicine}
                                onChange={handleChange}
                                className={errors.currentMedicine ? styles.error : ''}
                            >
                                <option value="">Select option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            {errors.currentMedicine && <span className={styles.errorText}>{errors.currentMedicine}</span>}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="familyHistory">Vitiligo History in Family *</label>
                            <select
                                id="familyHistory"
                                name="familyHistory"
                                value={formData.familyHistory}
                                onChange={handleChange}
                                className={errors.familyHistory ? styles.error : ''}
                            >
                                <option value="">Select option</option>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                            {errors.familyHistory && <span className={styles.errorText}>{errors.familyHistory}</span>}
                        </div>
                    </div>
                    
                    {/* Two-Column Row for COVID Vaccine and Doses */}
                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label htmlFor="covidVaccine">Taken COVID vaccine? *</label>
                            <select
                                id="covidVaccine"
                                name="covidVaccine"
                                value={formData.covidVaccine}
                                onChange={handleChange}
                                className={errors.covidVaccine ? styles.error : ''}
                            >
                                <option value="">Select option</option>
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                            {errors.covidVaccine && <span className={styles.errorText}>{errors.covidVaccine}</span>}
                        </div>

                        {formData.covidVaccine === 'yes' && (
                            <div className={styles.formGroup}>
                                <label htmlFor="vaccineDoses">Number of doses? *</label>
                                <select
                                    id="vaccineDoses"
                                    name="vaccineDoses"
                                    value={formData.vaccineDoses}
                                    onChange={handleChange}
                                    className={errors.vaccineDoses ? styles.error : ''}
                                >
                                    <option value="">Select doses</option>
                                    <option value="1 dose">1 dose</option>
                                    <option value="2 doses">2 doses</option>
                                    <option value="3 doses">3 doses</option>
                                    <option value="4 or more doses">4 or more doses</option>
                                </select>
                                {errors.vaccineDoses && <span className={styles.errorText}>{errors.vaccineDoses}</span>}
                            </div>
                        )}
                        {/* Fallback for alignment when vaccineDoses is hidden (optional) */}
                        {formData.covidVaccine !== 'yes' && <div className={styles.formGroup} />} 
                    </div>

                    {/* Single Column for Other Disease */}
                    <div className={styles.formGroup}>
                        <label htmlFor="otherDisease">Do you have any other disease? (Optional)</label>
                        <textarea
                            id="otherDisease"
                            name="otherDisease"
                            value={formData.otherDisease}
                            onChange={handleChange}
                            placeholder="Please specify if any (e.g., Diabetes, Thyroid issues)"
                            rows="2"
                        />
                    </div>
                    
                    <button type="submit" className={styles.submitBtn}>
                        <span className={styles.whatsappIcon}>📱</span>
                        Send Query via WhatsApp
                    </button>
                </form>
            </div>
        </div>
    );
};