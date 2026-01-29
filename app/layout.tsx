"use client";

import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useUserStore } from "@/store/useStatesStore";
import { useGetCurrentUser } from "../hooks/useAuth";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import WhatsappLogoImage from "../public/images/WhatsApp.svg.webp";
import Image from "next/image";
import { COMPANY_INFO } from "@/lib/constants";
import styles from "./styles.module.css";
import ConsentModal from "@/components/ConsentModal";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DEFAULT_METADATA, generateOrganizationSchema, generateWebSiteSchema } from "@/lib/metadata";
import GlobalLoader from "@/components/GlobalLoader";
import { Phone } from "lucide-react";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 10,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
    []
  );

  const { setData, setRole } = useUserStore();

  useTokenRefresh();

  useEffect(() => {
    const initializeUser = async () => {
      try {
        const user = await useGetCurrentUser()();
        if (user) {
          setData(user);
          setRole(user.role);
        }
      } catch (e) {
        console.log("User not logged in");
      }
    };

    initializeUser();
  }, [setData, setRole]);

  // Generate structured data schemas
  const organizationSchema = useMemo(() => generateOrganizationSchema(), []);
  const websiteSchema = useMemo(() => generateWebSiteSchema(), []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon2.ico" sizes="32x32" />

        {/* Primary Meta Tags */}
        <title>{DEFAULT_METADATA.title.default}</title>
        <meta name="title" content={DEFAULT_METADATA.title.default} />
        <meta name="description" content={DEFAULT_METADATA.description} />
        <meta name="keywords" content={DEFAULT_METADATA.keywords?.join(', ')} />
        <meta name="author" content="ZeroVitiligo Medical Team" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={DEFAULT_METADATA.metadataBase?.toString()} />
        <meta property="og:title" content={DEFAULT_METADATA.openGraph.title} />
        <meta property="og:description" content={DEFAULT_METADATA.openGraph.description} />
        <meta property="og:image" content={`${DEFAULT_METADATA.metadataBase}${DEFAULT_METADATA.openGraph.images[0].url}`} />
        <meta property="og:site_name" content="ZeroVitiligo" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={DEFAULT_METADATA.metadataBase?.toString()} />
        <meta property="twitter:title" content={DEFAULT_METADATA.twitter.title} />
        <meta property="twitter:description" content={DEFAULT_METADATA.twitter.description} />
        <meta property="twitter:image" content={`${DEFAULT_METADATA.metadataBase}${DEFAULT_METADATA.twitter.images[0]}`} />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
      </head>
      <body>
        <LanguageProvider>
          <QueryClientProvider client={queryClient}>
            <GlobalLoader />
            <Header />
            <main>{children}</main>
            <a
              href={`https://wa.me/${COMPANY_INFO.contactNo}?text=Hi👋`}
              className={styles.whatsappFloat}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Contact us on WhatsApp"
            >
              <Image
                src={WhatsappLogoImage}
                width={60}
                height={60}
                alt="Contact ZeroVitiligo on WhatsApp"
                priority
                className={styles.whatsappIcon}
              />
            </a>
            <a
              href={`tel:${COMPANY_INFO.contactNo}`}
              className={styles.cellPhoneFloat}
              aria-label="Call us"
            >
              <Phone size={28} />
            </a>
            <Footer />
            <ConsentModal />
            <Toaster
              position="bottom-center"
              toastOptions={{
                duration: 3000,
                style: {
                  fontSize: "14px",
                  borderRadius: "10px",
                  padding: "10px 16px",
                },
              }}
            />
          </QueryClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
};

export default RootLayout;
