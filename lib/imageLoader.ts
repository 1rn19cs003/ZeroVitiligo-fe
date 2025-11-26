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
    caption: string;
}

interface HeroImageData {
    id: number;
    imageSrc: StaticImageData;
    description: string;
    alt: string;
}

/**
 * Get all images from the CollectionImages directory
 * @returns Array of image objects with id, url, and caption
 */
export function getCollectionImages(): ImageData[] {
    return collectionImages.map((img, index) => ({
        id: index + 1,
        url: img,
        caption: generateCaption(index),
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

/**
 * Generate a caption based on index
 */
function generateCaption(index: number): string {
    const captions = [
        'Treatment progress - Week 1',
        'Patient case study',
        'Before treatment',
        'After 3 months',
        'Clinical results',
        'Treatment session',
        'Recovery progress',
        'Patient testimonial',
        'Before and after comparison',
        'Treatment outcome'
    ];

    // Cycle through captions
    return captions[index % captions.length];
}
