import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Toaster } from "react-hot-toast";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body>
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
      </body>
    </html>
  );
};

export default RootLayout;
