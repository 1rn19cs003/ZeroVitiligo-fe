/**
 * Utility to dynamically load all images from directories
 * This eliminates the need to manually import each image one by one
 */

import { StaticImageData } from 'next/image';
import { collectionImages } from '@/public/images/CollectionImages';
import { heroImages } from '@/public/images/HeroImages';

interface ImageData {
    id: number;
    url: StaticImageData;
}

interface HeroImageData {
    id: number;
    imageSrc: StaticImageData;
    description: string;
    alt: string;
}

/**
 * Get all images from the CollectionImages directory
 * @returns Array of image objects with id and url
 */
export function getCollectionImages(): ImageData[] {
    return collectionImages.map((img, index) => ({
        id: index + 1,
        url: img,
    }));
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
