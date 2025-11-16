"use client";

import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useUserStore } from "@/store/useDoctorStore";
import { useGetCurrentUser } from "../hooks/useAuth";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  const { setData, setRole } = useUserStore();

  useEffect(() => {
    const currentUser = useGetCurrentUser()();
    if (currentUser) {
      setData(currentUser);
      setRole(currentUser.role);
    }
  }, [setData, setRole]);

  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <Header />
          <main>{children}</main>
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
