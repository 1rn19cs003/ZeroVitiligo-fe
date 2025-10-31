import { InspectionIcon, LeafIcon, PlanIcon } from "@/components/Miscellaneous";
import personImage from "@/public/images/images.jpg";
import image2 from "@/public/images/image2.jpg";
import image3 from "@/public/images/image3.jpg";

export const NAVIGATION_LINKS = [
  { name: "Home", href: "/" },
  { name: "Contact", href: "/contact" },
  { name: "About Us", href: "/about" },
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
  },
  {
    id: 2,
    title: 'Personalized Treatment Plans',
    icon: PlanIcon,
  },
  {
    id: 3,
    title: 'Diet & Lifestyle Guidance',
    icon: LeafIcon,
  },
];


export const PROGRESS_DATA = [
  {
    id: 1,
    weeks: 'Before & In Progress',
    imageSrc: personImage,
    alt: 'Progress week 1',
  },
  {
    id: 2,
    weeks: 'Before & In Progress',
    imageSrc: image2,
    alt: 'Progress week 2',
  },
  {
    id: 3,
    weeks: 'Before & In Progress',
    imageSrc: image3,
    alt: 'Progress week 3',
  },
];

export const TESTIMONIALS = [
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
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_2",
    },
    {
        id: 3,
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_3",
    },
    {
        id: 4,
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_4",
    },
    {
        id: 5,
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_4",
    },
    {
        id: 6,
        youtubeUrl: "https://www.youtube.com/watch?v=VIDEO_ID_4",
    }
];
