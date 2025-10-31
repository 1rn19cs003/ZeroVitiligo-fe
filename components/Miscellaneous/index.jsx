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

export const FAQ_DATA = [
  {
    question: "How long does it take to see visible improvement?",
    answer: (
      <>
        <p>Every individual responds differently to treatment. The time taken to notice visible changes depends on several key factors:</p>
        <ul>
          <li>Area of the body affected</li>
          <li>Presence or absence of hair on the white patch</li>
          <li>How long you’ve had the condition</li>
        </ul>
        <p>
          Generally, improvements can be seen anywhere between <b>3 to 12 months</b>. 
          We know this may feel like a long journey, but being realistic with expectations ensures steady and healthy progress.
        </p>
      </>
    ),
  },
  {
    question: "What is the cost of Zero Vitiligo treatment?",
    answer: (
      <>
        <p>
          The treatment cost varies based on the extent and location of vitiligo. The main factors include:
        </p>
        <ul>
          <li>Whether vitiligo is limited to the face or involves other body areas</li>
          <li>Size and number of white patches</li>
        </ul>
        <p>
          To offer a precise estimate, we request you to share clear images of the affected area. 
          Our team will review them and suggest a personalized treatment plan.
        </p>
      </>
    ),
  },
  {
    question: "I’ve tried Allopathy, Homeopathy, and Ayurveda without results. How is your treatment different?",
    answer: (
      <>
        <p>
          Many patients come to us after trying different approaches. 
          Most conventional treatments focus on suppressing symptoms or controlling spread.
        </p>
        <p>
          At ZeroVitiligo, we follow a <b>combination therapy</b> — balancing medical science with holistic care. 
          Our approach focuses on both:
        </p>
        <ul>
          <li>Controlling further spread of white patches</li>
          <li>Encouraging natural re-pigmentation simultaneously</li>
        </ul>
        <p>This dual focus helps achieve sustainable and visible results.</p>
      </>
    ),
  },
  {
    question: "Do I need to follow strict diet restrictions?",
    answer: (
      <>
        <p>
          Not at all. We do not recommend strict diet plans. 
          While a balanced diet supports overall wellness, diet alone plays a minor role in vitiligo management.
        </p>
        <p>
          Our philosophy focuses more on consistent treatment, regular follow-ups, and stress management — 
          not rigid food rules.
        </p>
      </>
    ),
  },
  {
    question: "What kind of results can I expect?",
    answer: (
      <>
        <p>The outcome of vitiligo treatment depends on factors such as:</p>
        <ul>
          <li>Your consistency in following the treatment plan</li>
          <li>How old the condition is</li>
          <li>Location and size of affected areas</li>
          <li>Color of hair over the patches</li>
          <li>Previous therapies undertaken</li>
        </ul>
        <p>
          Results differ from person to person, but with discipline and guided care, 
          we’ve seen promising outcomes in hundreds of patients.
        </p>
      </>
    ),
  },
  {
    question: "Can vitiligo spread even after starting your treatment?",
    answer: (
      <>
        <p>
          Occasionally, patients switching from allopathic treatments may notice 
          temporary flaring of patches within the first few months.
        </p>
        <p>
          This happens because the previous therapy may have suppressed the condition. 
          Our combination-based approach minimizes this risk and aims to stabilize your skin early.
        </p>
      </>
    ),
  },
  {
    question: "Do you provide online consultations or remote treatments?",
    answer: (
      <>
        <p>
          Absolutely. We’ve successfully treated thousands of patients across India and abroad. 
          You can connect with us via call, WhatsApp, or by submitting the form on our website.
        </p>
        <p>Our team will guide you throughout your recovery journey — no matter where you are.</p>
      </>
    ),
  },
  {
    question: "What happens after I begin treatment?",
    answer: (
      <>
        <p>
          Once you join us, you’re assigned a dedicated health advisor and doctor 
          who will stay connected with you throughout your journey.
        </p>
        <p>
          You can reach out anytime between 9 AM and 5 PM for any guidance. 
          We believe open communication and consistent follow-ups are the keys to success in vitiligo management.
        </p>
      </>
    ),
  },
  {
    question: "Is treatment available for children with vitiligo?",
    answer: (
      <>
        <p>
          Yes, we specialize in treating children affected by vitiligo. 
          Our protocols are designed to be gentle yet effective, ensuring comfort and safety for young patients.
        </p>
      </>
    ),
  },
];
