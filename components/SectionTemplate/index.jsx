"use client";
import styles from "./styles.module.css";

export default function SectionTemplate({ id,title, paragraphs, highlights }) {
  return (
    <section id={id} className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>

        <div className={styles.textBlock}>
          {paragraphs.map((p, i) => (
            <p key={i} className={styles.paragraph}>
              {p}
            </p>
          ))}
        </div>

        {highlights && highlights.length > 0 && (
          <ul className={styles.highlightList}>
            {highlights.map((point, i) => (
              <li key={i} className={styles.highlightItem}>
                <span className={styles.icon}>✔</span>
                <span className={styles.highlightText}>{point}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
