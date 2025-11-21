import { InspectionIcon, LeafIcon, PlanIcon } from "@/components/Miscellaneous";
import HeroImage1 from "@/public/images/HeroImages/IMG_20251102_190814.png";
import HeroImage2 from "@/public/images/HeroImages/IMG_20251108_150513.png";
import HeroImage3 from "@/public/images/HeroImages/IMG_20251108_175048.jpg";
import CollectionImg1 from "@/public/images/CollectionImages/5_20251108_174948_0004.jpg";
import CollectionImg2 from "@/public/images/CollectionImages/IMG_20251102_121002.png";
import CollectionImg3 from "@/public/images/CollectionImages/IMG_20251102_190655.png";
import CollectionImg4 from "@/public/images/CollectionImages/IMG_20251102_190725.png";
import CollectionImg5 from "@/public/images/CollectionImages/IMG_20251102_190753.png";
import CollectionImg6 from "@/public/images/CollectionImages/IMG_20251102_190814.png";
import CollectionImg7 from "@/public/images/CollectionImages/IMG_20251102_191004.jpg";
import CollectionImg8 from "@/public/images/CollectionImages/IMG_20251108_150121.png";
import CollectionImg9 from "@/public/images/CollectionImages/IMG_20251108_175127.jpg"
import CollectionImg10 from "@/public/images/CollectionImages/IMG_20251108_175106.jpg";
import CollectionImg11 from "@/public/images/CollectionImages/IMG_20251108_175037.jpg";
import { ICompanyInfo } from "@/Interface/constant";

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Results", href: "/media" },
  { name: "Patients", href: "/doctor" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Profile", href: "/profile" },
  { name: "Login", href: "/login" },
];

export const RESTRICTED_LINKS_IF_LOGGED_OUT = ["Profile", "Doctor", "Register", "Patients", "Login"];


export const IMAGES_DATA = [
  { id: 1, url: CollectionImg1, caption: 'Treatment progress - Week 1' },
  { id: 2, url: CollectionImg2, caption: 'Patient case study' },
  { id: 3, url: CollectionImg3, caption: 'Before treatment' },
  { id: 4, url: CollectionImg4, caption: 'After 3 months' },
  { id: 5, url: CollectionImg5, caption: 'Clinical results' },
  { id: 19, url: CollectionImg6, caption: 'Clinical results' },
  { id: 11, url: CollectionImg7, caption: 'Clinical results' },
  { id: 6, url: CollectionImg8, caption: 'Treatment session' },
  { id: 7, url: CollectionImg9, caption: 'Treatment session' },
  { id: 8, url: CollectionImg10, caption: 'Treatment session' },
  { id: 9, url: CollectionImg11, caption: 'Treatment session' },
];

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
    imageSrc: HeroImage1,
    alt: 'Progress week 1',
  },
  {
    id: 2,
    description: 'Before & In Progress',
    imageSrc: HeroImage2,
    alt: 'Progress week 2',
  },
  {
    id: 3,
    description: 'Before & In Progress',
    imageSrc: HeroImage3,
    alt: 'Progress week 3',
  },
];

export const COMPANY_INFO: ICompanyInfo = {
  name: "ZeroVitiligo",
  addressLine1: "Manikpur Kunda Pratapgarh",
  addressLine2: "Uttar Pradesh 230202",
  email: "zerovitiligo@gmail.com",
  phone: "+91-9305819060",
  contactNo: "+919305819060",
};

export const VIDEO_DATA = [
  {
    id: 1,
    youtubeUrl: "https://www.youtube.com/watch?v=jWur9gEVMr4&pp=ygUMemVyb3ZpdGlsaWdv",
  },
  {
    id: 2,
    youtubeUrl: "https://www.youtube.com/watch?v=e_PSUUCy_qE&pp=ygUMemVyb3ZpdGlsaWdv",
  },
  {
    id: 3,
    youtubeUrl: "https://www.youtube.com/shorts/MQWqc7bsvPs",
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
  vaccineDoses: ["0 dose", "1 dose", "2 doses", "3 doses"],
  indianStates: [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
    "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan",
    "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh",
    "Uttarakhand", "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Other"
  ],
};


// For Roles in profile
export interface RoleConfig {
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
}

export const ROLE_CONFIG: Record<string, RoleConfig> = {
  admin: {
    label: 'Administrator',
    color: '#DC2626', // red-600
    bgColor: '#FEE2E2', // red-100
    textColor: '#991B1B', // red-800
  },
  assistant: {
    label: 'Assistant',
    color: '#2563EB', // blue-600
    bgColor: '#DBEAFE', // blue-100
    textColor: '#1E40AF', // blue-800
  },
  doctor: {
    label: 'Doctor',
    color: '#059669', // emerald-600
    bgColor: '#D1FAE5', // emerald-100
    textColor: '#065F46', // emerald-800
  },
  patient: {
    label: 'Patient',
    color: '#7C3AED', // violet-600
    bgColor: '#EDE9FE', // violet-100
    textColor: '#5B21B6', // violet-800
  },
  // Add more roles as needed
};

export const getRoleConfig = (role: string): RoleConfig => {
  return ROLE_CONFIG[role?.toLowerCase()] || {
    label: role || 'Unknown',
    color: '#6B7280', // gray-500
    bgColor: '#F3F4F6', // gray-100
    textColor: '#374151', // gray-700
  };
};

export const VISIT_MODE = {
  VISIT: "visit",
  SCHEDULE: "schedule",
  HISTORY: "history"
};

export const APPOINTMENT_STATUS = {
  SCHEDULED: "SCHEDULED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  MISSED: "MISSED",
}