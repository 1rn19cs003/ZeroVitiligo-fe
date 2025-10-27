import styles from './styles.module.css';
import Image from 'next/image';

const progressData = [
  {
    id: 1,
    weeks: 'Before & In Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress week 1',
  },
  {
    id: 2,
    weeks: 'Before & In Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress week 2',
  },
  {
    id: 3,
    weeks: 'Before & In Progress',
    imageSrc: '/images/images.jpg',
    alt: 'Progress week 3',
  },
];

const testimonials = [
  {
    id: 1,
    text: '12-Year Personalized Journey',
    bgColor: '#e97c4c',
  },
  {
    id: 2,
    text: 'Yoqasmart Hee Talented Stus',
    bgColor: '#e97c4c',
  },
];

export default function ProgressSection() {
  return (
    <section className={styles.progressSection}>
        <div className={styles.container}>
          <div className={styles.mainLayout}>

            {/* LEFT: Progress Showcase */}
            <div className={styles.progressShowcase}>
              <h2 className={styles.heading}>Progress We're Proud Of</h2>

              <div className={styles.progressGrid}>
                {progressData.map((item) => (
                  <div key={item.id} className={styles.progressCard}>
                    <div className={styles.imageWrapper}>
                      <Image
                        src={item.imageSrc}
                        alt={item.alt}
                        width={300}
                        height={300}
                        className={styles.progressImage}
                      />
                    </div>
                    <p className={styles.progressLabel}>{item.weeks}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: Stats, Doctor, and Testimonials Column */}
            <div className={styles.rightColumn}>

              {/* 94% Stats Card */}
              <div className={styles.statsCard}>
                <div className={styles.statNumber}>94%</div>
                <p className={styles.statText}>
                  of users report improved<br />
                  skin confidence
                </p>
              </div>

            </div>

          </div>
        </div>
        <div className={styles.testimonialsSection}>
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className={styles.testimonialCard}
              style={{ backgroundColor: testimonial.bgColor }}
            >
              <div className={styles.quoteIcon}>"</div>
              <p className={styles.testimonialText}>{testimonial.text}</p>
            </div>
          ))}

      </div>
    </section>
  );
}