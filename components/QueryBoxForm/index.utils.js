import * as Yup from 'yup';

export const initialValues = {
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
};

export const validationSchema = Yup.object().shape({
    name: Yup.string().trim().required('Name is required'),
    age: Yup.number()
        .typeError('Age must be a number')
        .min(1, 'Age must be at least 1')
        .max(120, 'Age seems too high')
        .required('Age is required'),
    bodyWeight: Yup.number()
        .typeError('Body weight must be a number')
        .min(1, 'Weight must be greater than 0')
        .max(500, 'Weight seems too high')
        .required('Body weight is required'),
    address: Yup.string().trim().required('Address is required'),
    vitiligoDuration: Yup.string().required('Please enter duration'),
    currentMedicine: Yup.string().required('Please select an option'),
    covidVaccine: Yup.string().required('Please select an option'),
    vaccineDoses: Yup.string().when('covidVaccine', {
        is: 'yes',
        then: (schema) => schema.required('Please select number of doses'),
        otherwise: (schema) => schema.notRequired(),
    }),
    otherDisease: Yup.string().optional(),
    familyHistory: Yup.string().required('Please select an option'),
});

export const generateWhatsAppMessage = (values, WHATSAPP_NUMBER) => {
    let message = `*New Vitiligo Query*\n\n`;
    message += `*Name:* ${values.name}\n`;
    message += `*Age:* ${values.age} years\n`;
    message += `*Body Weight:* ${values.bodyWeight} kg\n`;
    message += `*Address:* ${values.address}\n`;
    message += `*Vitiligo Duration:* ${values.vitiligoDuration}\n`;
    message += `*Currently Taking Medicine:* ${values.currentMedicine}\n`;
    message += `*COVID Vaccine:* ${values.covidVaccine}`;

    if (values.covidVaccine === 'yes') {
        message += ` (${values.vaccineDoses})`;
    }
    message += `\n`;

    message += `*Other Disease:* ${values.otherDisease || 'None'}\n`;
    message += `*Family History:* ${values.familyHistory}\n`;

    return message;
};

export const handleSubmitWrapper = (values, { setSubmitting }, WHATSAPP_NUMBER) => {
    const message = generateWhatsAppMessage(values);
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setSubmitting(false);
};