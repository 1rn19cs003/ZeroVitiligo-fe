"use client";
import styles from "./styles.module.css";
import { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thank you for contacting us! We’ll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <h1>Contact Us</h1>
        <p>
          We’d love to hear from you! Whether you have a question about features, pricing, or
          anything else — our team is ready to answer all your questions.
        </p>
      </section>

      <section className={styles.contactContent}>
        <div className={styles.formContainer}>
          <h2>Send us a message</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <textarea
              name="message"
              placeholder="Your Message"
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </form>
        </div>

        <div className={styles.infoContainer}>
          <h2>Get in touch</h2>
          <p>
            <strong>Address:</strong> 221B Baker Street, London, UK
          </p>
          <p>
            <strong>Phone:</strong> +44 123 456 7890
          </p>
          <p>
            <strong>Email:</strong> contact@yourcompany.com
          </p>

          <div className={styles.map}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2436.6817918965426!2d-0.1585552842206699!3d51.5237676170716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x48761adf4f09c8a7%3A0x42a0b0e36e0e41e!2s221B%20Baker%20St%2C%20London%20NW1%206XE%2C%20UK!5e0!3m2!1sen!2sin!4v1612455220016!5m2!1sen!2sin"
              width="100%"
              height="250"
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
}
