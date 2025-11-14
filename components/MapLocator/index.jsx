"use client";
import styles from "./styles.module.css";
import { COMPANY_INFO } from "@/lib/constants";

export default function MapLocator() {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1>Contact Us</h1>
        <p>
          Have questions about vitiligo treatment? Our dermatology experts are here to help you understand your options and guide you on your repigmentation journey. Reach out for personalized consultation.
        </p>
      </section>

      <section >
        <div className={styles.infoContainer}>
          <h2>Get in touch</h2>
          <p>
            <strong>Address:</strong> <br />
            <>
              {COMPANY_INFO.addressLine1}<br /> {COMPANY_INFO.addressLine2}
            </>
          </p>
          <p>
            <strong>Phone:</strong> {COMPANY_INFO.phone}
          </p>
          <p>
            <strong>Email:</strong> {COMPANY_INFO.email}
          </p>

          <div className={styles.map}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d898.2189151789973!2d81.40801136959259!3d25.77467019858398!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399b23002166a2f5%3A0xb18c427ee84a1eda!2sZERO%20VITILIGO!5e0!3m2!1sen!2sin!4v1761589408958!5m2!1sen!2sin"
              width="400"
              height="300"
              name="ZeroVitiligo"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
