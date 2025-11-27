"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import styles from "./styles.module.css";

export default function PrivacyPage() {
    const router = useRouter();

    return (
        <div className={styles.container}>
            <button onClick={() => router.back()} className={styles.backButton}>
                <ArrowLeft size={20} />
                Back
            </button>

            <div className={styles.content}>
                <h1 className={styles.title}>Privacy Policy</h1>
                <p className={styles.lastUpdated}>Last Updated: November 27, 2025</p>

                <section className={styles.section}>
                    <h2>1. Introduction</h2>
                    <p>
                        At ZeroVitiligo, we are committed to protecting your privacy and ensuring the security of your personal and medical information. This Privacy Policy explains how we collect, use, store, and protect your data when you use our website and services.
                    </p>
                    <p>
                        By using our services, you consent to the data practices described in this policy.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>2. Information We Collect</h2>

                    <h3>2.1 Personal Information</h3>
                    <ul>
                        <li>Name, age, and contact details (phone number, email address)</li>
                        <li>Physical address and location information</li>
                        <li>Account credentials (username, password)</li>
                        <li>Payment and billing information</li>
                    </ul>

                    <h3>2.2 Medical Information</h3>
                    <ul>
                        <li>Medical history and vitiligo-related information</li>
                        <li>Current medications and treatments</li>
                        <li>Vaccination records</li>
                        <li>Disease history and family medical history</li>
                        <li>Body weight and physical measurements</li>
                        <li>Treatment progress photographs</li>
                        <li>Appointment and consultation records</li>
                    </ul>

                    <h3>2.3 Technical Information</h3>
                    <ul>
                        <li>IP address and device information</li>
                        <li>Browser type and version</li>
                        <li>Operating system</li>
                        <li>Pages visited and time spent on our website</li>
                        <li>Referring website addresses</li>
                        <li>Cookies and similar tracking technologies</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>3. How We Use Your Information</h2>
                    <p>We use your information for the following purposes:</p>

                    <h3>3.1 Medical Services</h3>
                    <ul>
                        <li>Providing personalized vitiligo treatment and care</li>
                        <li>Creating and managing treatment plans</li>
                        <li>Scheduling and managing appointments</li>
                        <li>Monitoring treatment progress</li>
                        <li>Communicating with you about your treatment</li>
                    </ul>

                    <h3>3.2 Administrative Purposes</h3>
                    <ul>
                        <li>Processing payments and maintaining billing records</li>
                        <li>Sending appointment reminders and notifications</li>
                        <li>Responding to your inquiries and support requests</li>
                        <li>Improving our services and website functionality</li>
                    </ul>

                    <h3>3.3 Legal and Safety</h3>
                    <ul>
                        <li>Complying with legal obligations and regulations</li>
                        <li>Protecting against fraud and unauthorized access</li>
                        <li>Enforcing our Terms and Conditions</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>4. Data Storage and Security</h2>
                    <div className={styles.important}>
                        <p>
                            <strong>Security Measures:</strong> We implement industry-standard security measures to protect your data from unauthorized access, disclosure, alteration, or destruction.
                        </p>
                    </div>
                    <ul>
                        <li>Encrypted data transmission using SSL/TLS protocols</li>
                        <li>Secure database storage with access controls</li>
                        <li>Regular security audits and updates</li>
                        <li>Limited employee access to personal information</li>
                        <li>Secure backup and disaster recovery procedures</li>
                    </ul>
                    <p>
                        Your medical records are stored in compliance with healthcare data protection regulations and are accessible only to authorized healthcare professionals involved in your treatment.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>5. Data Sharing and Disclosure</h2>
                    <p>
                        We do not sell, rent, or trade your personal information. We may share your information only in the following circumstances:
                    </p>

                    <h3>5.1 Healthcare Providers</h3>
                    <ul>
                        <li>With doctors and medical staff involved in your treatment</li>
                        <li>With laboratory services for diagnostic purposes</li>
                        <li>With specialists for consultation when necessary</li>
                    </ul>

                    <h3>5.2 Service Providers</h3>
                    <ul>
                        <li>Payment processors for billing purposes</li>
                        <li>Cloud storage providers for data hosting</li>
                        <li>Communication services for appointment reminders</li>
                    </ul>

                    <h3>5.3 Legal Requirements</h3>
                    <ul>
                        <li>When required by law or legal process</li>
                        <li>To protect our rights and property</li>
                        <li>In emergency situations to protect health and safety</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>6. Cookies and Tracking Technologies</h2>
                    <p>
                        We use cookies and similar technologies to enhance your experience on our website:
                    </p>
                    <ul>
                        <li><strong>Essential Cookies:</strong> Required for website functionality</li>
                        <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our site</li>
                        <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                    </ul>
                    <p>
                        You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>7. Your Rights and Choices</h2>
                    <p>You have the following rights regarding your personal information:</p>

                    <h3>7.1 Access and Correction</h3>
                    <ul>
                        <li>Request access to your personal and medical information</li>
                        <li>Request corrections to inaccurate or incomplete data</li>
                        <li>Download your medical records</li>
                    </ul>

                    <h3>7.2 Data Deletion</h3>
                    <ul>
                        <li>Request deletion of your account and personal data</li>
                        <li>Note: Medical records may be retained as required by law</li>
                    </ul>

                    <h3>7.3 Communication Preferences</h3>
                    <ul>
                        <li>Opt-out of marketing communications</li>
                        <li>Manage notification preferences</li>
                        <li>Update contact information</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>8. Data Retention</h2>
                    <p>
                        We retain your information for as long as necessary to:
                    </p>
                    <ul>
                        <li>Provide ongoing medical services</li>
                        <li>Comply with legal and regulatory requirements</li>
                        <li>Resolve disputes and enforce agreements</li>
                    </ul>
                    <p>
                        Medical records are retained in accordance with healthcare regulations, typically for a minimum of 7 years after the last treatment.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>9. Children's Privacy</h2>
                    <p>
                        Our services are not directed to individuals under 18 years of age. Treatment for minors requires parental or guardian consent. We collect and process information about minors only with appropriate parental authorization.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>10. International Data Transfers</h2>
                    <p>
                        Your information is primarily stored and processed in India. If data is transferred internationally, we ensure appropriate safeguards are in place to protect your information in accordance with applicable data protection laws.
                    </p>
                </section>

                <section className={styles.section}>
                    <h2>11. Changes to This Privacy Policy</h2>
                    <p>
                        We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify you of significant changes by:
                    </p>
                    <ul>
                        <li>Posting the updated policy on our website</li>
                        <li>Updating the "Last Updated" date</li>
                        <li>Sending email notifications for material changes</li>
                    </ul>
                </section>

                <section className={styles.section}>
                    <h2>12. Contact Us</h2>
                    <p>
                        If you have questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact us:
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
                        By using our services, you acknowledge that you have read and understood this Privacy Policy and consent to the collection, use, and disclosure of your information as described herein.
                    </p>
                </div>
            </div>
        </div>
    );
}
