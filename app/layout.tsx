"use client";

import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useDoctorStore";
import { useGetCurrentUser } from "../hooks/useAuth";
import LogoImage from "../public/images/whatsappIcon.avif";
import Image from "next/image";
import { COMPANY_INFO } from "@/lib/constants";
import styles from "./styles.module.css";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const { setData, setRole } = useUserStore();

  useEffect(() => {
    (async () => {
      try {
        const user = await useGetCurrentUser()();
        if (user) {
          setData(user);
          setRole(user.role);
        }
      } catch (e) {
        console.log("User not logged in");
      }
    })();
  }, []);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Header />
          <main>{children}</main>
          <a
            href={`https://wa.me/${COMPANY_INFO.contactNo}?text=Hi👋`}
            className={styles.whatsappFloat}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src={LogoImage}
              width={40}
              height={40}
              alt="WhatsApp"
              priority
              className={styles.whatsappIcon}
            />
          </a>
          <Footer />
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
      </body>
    </html>
  );
};

export default RootLayout;
