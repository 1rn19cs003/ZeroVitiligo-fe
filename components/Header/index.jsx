"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/images/NewLogo.svg";
import styles from "./styles.module.css";
import { NAVIGATION_LINKS, RESTRICTED_LINKS_IF_LOGGED_OUT } from "@/lib/constants";
import { BASE_URL } from "@/lib/app.const";
import { useUserStore } from "@/store/useDoctorStore";
import { LogOut } from "lucide-react";
import { useIsAuthenticated, useLogout } from "@/hooks/useAuth";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const logout = useLogout();


  const { data, setData, setRole } = useUserStore();


  useEffect(() => {
    setIsClient(true);
    setIsLoggedIn(useIsAuthenticated()());


    const handleAuthChange = () => {
      setIsLoggedIn(useIsAuthenticated()());
    };
    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);


  if (!isClient) {
    return <header className={styles.placeholderHeader} />;
  }

  const linksToShow = NAVIGATION_LINKS.filter(link => {
    if (RESTRICTED_LINKS_IF_LOGGED_OUT.includes(link.name) && !isLoggedIn) return false;
    if (link.name === "Login" && isLoggedIn) return false;
    return true;
  });

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    setData({});
    setRole('');
  };
  return (
    <header className={styles.header}>
      <div className={styles.logoSection}>
        <Image
          src={LogoImage}
          alt="Zero Vitiligo Logo"
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
          priority
          onClick={() => {
            window.location.href = BASE_URL;
          }}
        />
        <Link href="/" className={styles.logo}>
          <span className={styles.logoZero}>ZERO</span>
          <span className={styles.logoVitiligo}>VITILIGO</span>
        </Link>
        {data.role && <p className={`${styles.role} ${data.role === 'ADMIN' ? styles.roleAdmin : data.role === 'assistant' ? styles.roleAssistant : ''}`}>
          {data.role}
        </p>}
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        {linksToShow.map((link) => (
          <Link key={link.name} href={link.href} prefetch={false}>
            {link.name}
          </Link>
        ))}
        {isLoggedIn && (
          <button onClick={handleLogout} className={styles.logoutButton} type="button">
            Logout
          </button>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={styles.mobileMenuButton}
        aria-label="Toggle menu"
      >
        <span className={styles.bar} />
        <span className={styles.bar} />
        <span className={styles.bar} />
      </button>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className={styles.mobileNav}>
          {linksToShow.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleLogout} className={styles.logoutButton} type="button">
              <LogOut size={20} />
            </button>
          )}
        </div>
      )}
    </header>
  );
}
