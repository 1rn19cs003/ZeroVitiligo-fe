import styles from "./styles.module.css";
export const InspectionIcon = (
  <svg
    viewBox="0 0 64 64"
    className={styles.icon}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="28" cy="28" r="12" />
    <line x1="38" y1="38" x2="50" y2="50" />
    <path d="M24 22 L32 22 M24 28 L32 28 M24 34 L28 34" />
  </svg>
);

export const PlanIcon = (
  <svg
    viewBox="0 0 64 64"
    className={styles.icon}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="16" y="12" width="32" height="40" rx="4" />
    <rect x="26" y="8" width="12" height="6" rx="2" />
    <path d="M22 24 L28 24 M22 32 L28 32 M22 40 L28 40" />
    <path d="M34 24 L42 24 M34 32 L42 32 M34 40 L42 40" />
  </svg>
);

export const LeafIcon = (
  <svg
    viewBox="0 0 64 64"
    className={styles.icon}
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M32 12 C24 20, 18 28, 18 36 C18 48, 28 52, 32 52 C36 52, 46 48, 46 36 C46 28, 40 20, 32 12 Z" />
    <path d="M32 20 L32 44" />
    <path d="M32 28 C28 30, 26 34, 26 38" />
    <path d="M32 28 C36 30, 38 34, 38 38" />
  </svg>
);
