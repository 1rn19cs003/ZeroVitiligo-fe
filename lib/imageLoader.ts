import { StaticImageData } from 'next/image';
import { heroImages } from '@/public/images/HeroImages';

interface HeroImageData {
    id: number;
    imageSrc: StaticImageData;
    description: string;
    alt: string;
}


/**
 * Get all images from the HeroImages directory
 * @returns Array of image objects
 */
export function getHeroImages(): HeroImageData[] {
    return heroImages.map((img, index) => ({
        id: index + 1,
        imageSrc: img,
        description: 'Before & In Progress',
        alt: `Progress ${index + 1}`,
    }));
}
