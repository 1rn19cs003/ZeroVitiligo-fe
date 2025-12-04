import { Metadata } from 'next';
import { COMPANY_INFO } from './constants';

export const DEFAULT_METADATA = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'https://zerovitiligo.com'),
    title: {
        default: 'ZeroVitiligo - Natural Vitiligo Treatment & Wellness',
        template: '%s | ZeroVitiligo'
    },
    description: 'Expert vitiligo treatment with personalized care, natural remedies, and holistic healing. Achieve visible results with our proven treatment plans and lifestyle guidance.',
    keywords: [
        'vitiligo treatment',
        'vitiligo cure',
        'natural vitiligo treatment',
        'skin pigmentation treatment',
        'vitiligo specialist',
        'holistic vitiligo care',
        'ayurvedic vitiligo treatment',
        'vitiligo wellness',
        'skin repigmentation',
        'vitiligo doctor'
    ],
    authors: [{ name: 'ZeroVitiligo Medical Team' }],
    creator: 'ZeroVitiligo',
    publisher: 'ZeroVitiligo',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: '/',
        siteName: 'ZeroVitiligo',
        title: 'ZeroVitiligo - Natural Vitiligo Treatment & Wellness',
        description: 'Expert vitiligo treatment with personalized care, natural remedies, and holistic healing.',
        images: [
            {
                url: '/images/NewLogo.svg',
                width: 1200,
                height: 630,
                alt: 'ZeroVitiligo Logo',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'ZeroVitiligo - Natural Vitiligo Treatment & Wellness',
        description: 'Expert vitiligo treatment with personalized care, natural remedies, and holistic healing.',
        images: ['/images/NewLogo.svg'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    verification: {
        google: 'your-google-verification-code', // Replace with actual verification code
    },
};

export function generatePageMetadata({
    title,
    description,
    keywords,
    path = '/',
    images,
}: {
    title: string;
    description: string;
    keywords?: string[];
    path?: string;
    images?: { url: string; width?: number; height?: number; alt?: string }[];
}): Metadata {
    const url = `${DEFAULT_METADATA.metadataBase}${path}`;

    return {
        title,
        description,
        keywords: keywords || DEFAULT_METADATA.keywords,
        openGraph: {
            title,
            description,
            url,
            siteName: 'ZeroVitiligo',
            images: images || DEFAULT_METADATA.openGraph.images,
            locale: 'en_US',
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: images ? images.map(img => img.url) : ['/images/NewLogo.svg'],
        },
        alternates: {
            canonical: url,
        },
    };
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: COMPANY_INFO.name,
        description: 'Expert vitiligo treatment center providing personalized care, natural remedies, and holistic healing solutions.',
        url: DEFAULT_METADATA.metadataBase?.toString(),
        logo: `${DEFAULT_METADATA.metadataBase}/images/NewLogo.svg`,
        image: `${DEFAULT_METADATA.metadataBase}/images/NewLogo.svg`,
        telephone: COMPANY_INFO.phone,
        email: COMPANY_INFO.email,
        address: {
            '@type': 'PostalAddress',
            streetAddress: COMPANY_INFO.addressLine1,
            addressLocality: 'Pratapgarh',
            addressRegion: 'Uttar Pradesh',
            postalCode: '230202',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '25.8949',
            longitude: '81.9408',
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                opens: '09:00',
                closes: '18:00',
            },
        ],
        priceRange: '$$',
        medicalSpecialty: 'Dermatology',
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'ZeroVitiligo',
        url: DEFAULT_METADATA.metadataBase?.toString(),
        description: 'Expert vitiligo treatment with personalized care, natural remedies, and holistic healing.',
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${DEFAULT_METADATA.metadataBase}/search?q={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
        },
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${DEFAULT_METADATA.metadataBase}${item.url}`,
        })),
    };
}
