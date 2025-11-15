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
          Generally, improvements can be seen anywhere between <b>2 to 4 months</b>. 
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
          we’ve seen promising outcomes in thousands of patients.
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
          Our treatment minimizes this risk and aims to stabilize your skin early.
        </p>
      </>
    ),
  },
  {
    question: "Do you provide online consultations or remote treatments?",
    answer: (
      <>
        <p>
          Absolutely. We’ve successfully treated thousands of patients across India. 
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
          You can reach out anytime between 10 AM and 5 PM for any guidance. 
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

export const LeftVine = ({styles}) => (
  <svg className={styles.vineLeft} viewBox="0 0 150 450" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M20,0 Q15,30 25,60 Q35,90 25,120 Q15,150 25,180 Q35,210 25,240 Q15,270 25,300 Q35,330 25,360 Q15,390 25,420 L25,450" 
      fill="none" 
      stroke="#7C5D3B" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    
    <path d="M25,50 Q40,45 50,55 L45,60 Q35,55 25,50" fill="#6B9D3E"/>
    <path d="M25,80 Q10,75 5,85 L8,90 Q18,85 25,80" fill="#7FAB4A"/>
    <path d="M25,110 Q40,105 52,115 L47,120 Q37,112 25,110" fill="#5A8C34"/>
    <path d="M25,140 Q8,135 2,145 L6,150 Q16,142 25,140" fill="#6B9D3E"/>
    <path d="M25,170 Q42,165 54,175 L49,180 Q39,172 25,170" fill="#7FAB4A"/>
    <path d="M25,200 Q10,195 4,205 L8,210 Q18,202 25,200" fill="#5A8C34"/>
    <path d="M25,230 Q40,225 50,235 L45,240 Q35,232 25,230" fill="#6B9D3E"/>
    <path d="M25,260 Q8,255 3,265 L7,270 Q17,262 25,260" fill="#7FAB4A"/>
    <path d="M25,290 Q42,285 53,295 L48,300 Q38,292 25,290" fill="#5A8C34"/>
    <path d="M25,320 Q10,315 5,325 L9,330 Q19,322 25,320" fill="#6B9D3E"/>
    <path d="M25,350 Q40,345 51,355 L46,360 Q36,352 25,350" fill="#7FAB4A"/>
    <path d="M25,380 Q8,375 3,385 L7,390 Q17,382 25,380" fill="#5A8C34"/>
    <path d="M25,410 Q42,405 52,415 L47,420 Q37,412 25,410" fill="#6B9D3E"/>
  </svg>
);

export const RightVine = ({styles}) => (
  <svg className={styles.vineRight} viewBox="0 0 150 450" xmlns="http://www.w3.org/2000/svg">
    <path 
      d="M130,0 Q135,30 125,60 Q115,90 125,120 Q135,150 125,180 Q115,210 125,240 Q135,270 125,300 Q115,330 125,360 Q135,390 125,420 L125,450" 
      fill="none" 
      stroke="#7C5D3B" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    
    <path d="M125,50 Q110,45 100,55 L105,60 Q115,55 125,50" fill="#6B9D3E"/>
    <path d="M125,80 Q140,75 145,85 L142,90 Q132,85 125,80" fill="#7FAB4A"/>
    <path d="M125,110 Q110,105 98,115 L103,120 Q113,112 125,110" fill="#5A8C34"/>
    <path d="M125,140 Q142,135 148,145 L144,150 Q134,142 125,140" fill="#6B9D3E"/>
    <path d="M125,170 Q108,165 96,175 L101,180 Q111,172 125,170" fill="#7FAB4A"/>
    <path d="M125,200 Q140,195 146,205 L142,210 Q132,202 125,200" fill="#5A8C34"/>
    <path d="M125,230 Q110,225 100,235 L105,240 Q115,232 125,230" fill="#6B9D3E"/>
    <path d="M125,260 Q142,255 147,265 L143,270 Q133,262 125,260" fill="#7FAB4A"/>
    <path d="M125,290 Q108,285 97,295 L102,300 Q112,292 125,290" fill="#5A8C34"/>
    <path d="M125,320 Q140,315 145,325 L141,330 Q131,322 125,320" fill="#6B9D3E"/>
    <path d="M125,350 Q110,345 99,355 L104,360 Q114,352 125,350" fill="#7FAB4A"/>
    <path d="M125,380 Q142,375 147,385 L143,390 Q133,382 125,380" fill="#5A8C34"/>
    <path d="M125,410 Q108,405 98,415 L103,420 Q113,412 125,410" fill="#6B9D3E"/>
  </svg>
);

export const FilmReel = ({ images, direction, speed , styles }) => {
  const duplicatedImages = [...images, ...images];
  
  return (
    <div className={styles.filmStrip}>
      <div className={`${styles.filmTrack} ${direction === 'left' ? styles.scrollLeft : styles.scrollRight}`} style={{ animationDuration: `${speed}s` }}>
        {duplicatedImages.map((img, index) => (
          <div key={index} className={styles.filmFrame}>
            <div className={styles.frameHole}></div>
            <div className={styles.frameImage}>
              <img src={img} alt={`Frame ${index + 1}`} />
            </div>
            <div className={styles.frameHole}></div>
          </div>
        ))}
      </div>
    </div>
  );
};