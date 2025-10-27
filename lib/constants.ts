import { HeartIcon, UsersIcon, ScienceIcon } from "@/components/icons";
import personImage from "@/public/images/images.jpg";

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
    title: "Holistic Wellness",
    icon: HeartIcon,
  },
  {
    title: "Supportive Community",
    icon: UsersIcon,
  },
  {
    title: "Science-backed Solutions",
    icon: ScienceIcon,
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
    imageSrc: personImage,
    alt: 'Progress week 2',
  },
  {
    id: 3,
    weeks: 'Before & In Progress',
    imageSrc: personImage,
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
