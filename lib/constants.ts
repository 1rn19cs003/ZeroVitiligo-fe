import { InspectionIcon, LeafIcon, PlanIcon } from "@/components/Miscellaneous";
import personImage from "@/public/images/images.jpg";
import image2 from "@/public/images/image2.jpg";
import image3 from "@/public/images/image3.jpg";

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Results", href: "/media" },
  { name: "Query Box", href: "/querybox" },
  { name: "Contact", href: "/contact" },
  { name: "About", href: "/about" },
  { name: "Login", href: "/login" },
  { name: "Profile", href: "/profile" },
  { name: "Doctor", href: "/doctor" },
  { name: "Register", href: "/register" },
];

export const RESTRICTED_LINKS_IF_LOGGED_OUT = ["Profile", "About", "Doctor", "Register"];



export const BUTOON_TYPES = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
};
export const FEATURES = [
  {
    id: 1,
    title: 'Inspection & Diagnosis',
    icon: InspectionIcon,
    link: '/ZeroVitiligo-fe/treatment#inspection-diagnosis',
  },
  {
    id: 2,
    title: 'Personalized Treatment Plans',
    icon: PlanIcon,
    link: '/ZeroVitiligo-fe/treatment#personalized-treatment',
  },
  {
    id: 3,
    title: 'Diet & Lifestyle Guidance',
    icon: LeafIcon,
    link: '/ZeroVitiligo-fe/treatment#diet-lifestyle-guidance',
  },
];


export const PROGRESS_DATA = [
  {
    id: 1,
    description: 'Before & In Progress',
    imageSrc: personImage,
    alt: 'Progress week 1',
  },
  {
    id: 2,
    description: 'Before & In Progress',
    imageSrc: image2,
    alt: 'Progress week 2',
  },
  {
    id: 3,
    description: 'Before & In Progress',
    imageSrc: image3,
    alt: 'Progress week 3',
  },
];

export const COMPANY_INFO: ICompanyInfo = {
  name: "ZeroVitiligo",
  addressLine1: "Piro - Jagdishpur Rd, Manikpur, Mirgarhwa,",
  addressLine2: "Uttar Pradesh 230202",
  email: "zerovitiligo@gmail.com",
  phone: "+91-9305819060",
};

export const VIDEO_DATA = [
  {
    id: 1,
    youtubeUrl: "https://www.youtube.com/watch?v=Jzk0g977Hns",
  },
  {
    id: 2,
    youtubeUrl: "https://www.youtube.com/shorts/YfwN6vGZFII",
  },
  {
    id: 3,
    youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_3",
  }
];

export const treatmentContent = {
  inspection: {
    title: "Accurate Inspection & Diagnosis — The Foundation of Effective Healing",
    paragraphs: [
      "At our center, every healing journey begins with a comprehensive inspection and diagnosis. We believe that understanding the root cause is essential before beginning any treatment. Our practitioners conduct a thorough assessment of your symptoms, medical history, and lifestyle patterns to uncover the underlying imbalances affecting your health.",
      "Through advanced diagnostic tools, physical evaluations, and mindful observation, we ensure no symptom is overlooked. Our approach blends modern diagnostic methods with traditional insights, helping us create a complete picture of your health.",
      "Whether it’s digestive concerns, chronic pain, or stress-related issues, our diagnostic process is designed to provide clarity, confidence, and a clear direction for your personalized healing plan."
    ],
    highlights: [
      "In-depth body and mind assessment",
      "Identification of root causes, not just symptoms",
      "Blend of modern and traditional diagnostic approaches",
      "Transparent explanation of findings before treatment begins"
    ]
  },

  personalized: {
    title: "Treatment Designed Just for You — Because Every Body is Different",
    paragraphs: [
      "Once we’ve identified the root cause of your health concerns, we design a Personalized Treatment Plan tailored specifically to your needs. We recognize that no two individuals respond to the same therapy in the same way — that’s why our treatment plans are adaptive, holistic, and unique.",
      "Your plan may include a combination of therapeutic procedures, natural remedies, guided exercises, and nutritional recommendations. Each step is chosen with your comfort, recovery speed, and long-term health in mind.",
      "Our focus is not just on immediate relief, but on sustainable wellness — helping your body and mind restore their natural balance."
    ],
    highlights: [
      "Customized treatment based on individual diagnosis",
      "Focus on holistic healing — body, mind, and spirit",
      "Periodic progress reviews and adjustments",
      "Gentle, non-invasive, and result-oriented therapies"
    ]
  },

  diet: {
    title: "Heal from Within — Transform Your Diet and Lifestyle",
    paragraphs: [
      "True healing extends beyond treatment sessions. Our Diet & Lifestyle Guidance empowers you to make daily choices that support your recovery and sustain your health.",
      "We create personalized nutrition plans that align with your body type, health condition, and treatment goals. Alongside diet, we focus on lifestyle adjustments — improving your sleep, physical activity, and emotional well-being.",
      "Our experts help you understand how simple changes can lead to long-term transformation. By following our tailored guidance, you’ll experience increased energy, better digestion, reduced stress, and an overall sense of balance in your daily life."
    ],
    highlights: [
      "Tailored diet plans for your body type and condition",
      "Lifestyle modifications that promote healing and vitality",
      "Focus on sustainable, real-life changes",
      "Ongoing support and progress tracking"
    ]
  }
};

export const row1Images = [
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400',
  'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=400',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=400'
];

export const row2Images = [
  'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400',
  'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400',
  'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400',
  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400'
];

export const row3Images = [
  'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400',
  'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
  'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=400',
  'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=400'
];

export const FORM_OPTIONS = {
  yesNo: ["Yes", "No"],
  covidVaccine: ["Yes", "No"],
  vaccineDoses: ["0 dose", "1 dose", "2 doses"],
  indianStates: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh"
  ],
};
