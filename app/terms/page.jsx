"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export default function TermsPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backButton}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className={styles.content}>
                <h1 className={styles.title}>Terms and Conditions</h1>
                <p className={styles.lastUpdated}>Last Updated: November 27, 2025</p>

                <section className={styles.section}>
                    <h2>1. Acceptance of Terms</h2>
                    <p>
                        By accessing and using ZeroVitiligo's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Medical Disclaimer</h2>
                    <div className={styles.important}>
                        <p>
                            <strong>Important:</strong> The information provided on this website is for educational and informational purposes only and is not intended as medical advice, diagnosis, or treatment.
                        </p>
                    </div>
                    <ul>
                        <li>ZeroVitiligo provides vitiligo treatment services under qualified medical supervision</li>
                        <li>Individual results may vary based on various factors including skin type, vitiligo severity, and patient compliance</li>
                        <li>We do not guarantee specific outcomes or cure rates</li>
                        <li>All treatment plans are personalized and require proper medical consultation</li>
                        <li>Emergency medical conditions should be addressed at appropriate emergency facilities</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. Treatment Information</h2>
                    <p>
                        Our vitiligo treatment services include but are not limited to:
                    </p>
                    <ul>
                        <li>Initial consultation and diagnosis</li>
                        <li>Personalized treatment plans</li>
                        <li>Regular follow-up appointments</li>
                        <li>Diet and lifestyle guidance</li>
                        <li>Progress monitoring and documentation</li>
                    </ul>
                    <p>
                        All treatments are provided by qualified healthcare professionals. Treatment duration and effectiveness vary by individual case.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>4. User Responsibilities</h2>
                    <p>As a user of our services, you agree to:</p>
                    <ul>
                        <li>Provide accurate and complete medical information</li>
                        <li>Follow prescribed treatment plans and medication schedules</li>
                        <li>Attend scheduled appointments or notify us of cancellations</li>
                        <li>Inform us of any adverse reactions or side effects</li>
                        <li>Maintain confidentiality of your account credentials</li>
                        <li>Not share your treatment plan with others without medical consultation</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>5. Appointment and Cancellation Policy</h2>
                    <ul>
                        <li>Appointments must be scheduled in advance through our platform</li>
                        <li>Cancellations should be made at least 24 hours before the scheduled appointment</li>
                        <li>Repeated no-shows may result in service restrictions</li>
                        <li>Emergency cancellations will be handled on a case-by-case basis</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Payment and Fees</h2>
                    <ul>
                        <li>Treatment fees are determined based on individual treatment plans</li>
                        <li>Payment is required as per the agreed schedule</li>
                        <li>Refund policies are subject to specific treatment packages</li>
                        <li>Insurance claims, if applicable, are the patient's responsibility</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>7. Intellectual Property</h2>
                    <p>
                        All content on this website, including text, images, videos, logos, and treatment methodologies, is the property of ZeroVitiligo and is protected by copyright and intellectual property laws. You may not:
                    </p>
                    <ul>
                        <li>Reproduce or distribute our content without permission</li>
                        <li>Use our branding or logos without authorization</li>
                        <li>Copy or replicate our treatment methodologies</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>8. Limitation of Liability</h2>
                    <p>
                        To the fullest extent permitted by law, ZeroVitiligo shall not be liable for:
                    </p>
                    <ul>
                        <li>Any indirect, incidental, or consequential damages</li>
                        <li>Treatment outcomes that vary from expected results</li>
                        <li>Delays or interruptions in service delivery</li>
                        <li>Technical issues with the website or booking system</li>
                        <li>Actions taken based on information from third-party sources</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>9. Privacy and Data Protection</h2>
                    <p>
                        Your privacy is important to us. Please review our <a href="/privacy" className={styles.link}>Privacy Policy</a> to understand how we collect, use, and protect your personal and medical information.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>10. Modifications to Terms</h2>
                    <p>
                        We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting to the website. Continued use of our services after changes constitutes acceptance of the modified terms.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>11. Governing Law</h2>
                    <p>
                        These Terms and Conditions are governed by the laws of India. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts in Uttar Pradesh, India.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>12. Contact Information</h2>
                    <p>
                        For questions about these Terms and Conditions, please contact us:
                    </p>
                    <div className={styles.contactInfo}>
                        <p><strong>ZeroVitiligo</strong></p>
                        <p>Manikpur Kunda Pratapgarh</p>
                        <p>Uttar Pradesh 230202, India</p>
                        <p>Email: zerovitiligo@gmail.com</p>
                        <p>Phone: +91-9305819060</p>
                    </div>
                </section>

                <div className={styles.acknowledgment}>
                    <p>
                        By using our services, you acknowledge that you have read and understood these Terms and Conditions and agree to be bound by them.
                    </p>
                </div>
            </div>
        </div>
    );
}
