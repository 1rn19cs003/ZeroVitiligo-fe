"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/images/NewLogo.svg";
import styles from "./styles.module.css";
import { NAVIGATION_LINKS, RESTRICTED_LINKS_IF_LOGGED_OUT } from "@/lib/constants";
import { BASE_URL } from "@/lib/app.const";
import { useUserStore } from "@/store/useDoctorStore";
import { LogOut, User } from "lucide-react";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { ROLES } from '../../lib/constants';
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/hooks/useLanguage";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { mutate: logout } = useLogout();
  const router = useRouter();
  const { t } = useLanguage();
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  const { data, setData, setRole } = useUserStore();

  const checkAuth = () => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  };

  useEffect(() => {
    setIsClient(true);
    checkAuth();

    window.addEventListener('authChanged', checkAuth);

    return () => {
      window.removeEventListener('authChanged', checkAuth);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  if (!isClient) {
    return <header className={styles.placeholderHeader} />;
  }

  const linksToShow = NAVIGATION_LINKS.filter(link => {
    if (RESTRICTED_LINKS_IF_LOGGED_OUT.includes(link.name) && !isLoggedIn)
      return false;
    if (link.name === "Login" && isLoggedIn)
      return false;
    return true;
  });

  const handleLogout = () => {
    setData({});
    setRole('');
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    logout();
  };

  const handleProfileClick = () => {
    router.push(`/profile?id=${data.id}`)
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
        {data.role && <p className={`${styles.role} ${data.role === ROLES.ADMIN ? styles.roleAdmin : data.role === ROLES.ASSISTANT ? styles.roleAssistant : ''}`}>
          {data.role}
        </p>}
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        {linksToShow.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            prefetch={false}
            className={styles.navLink}
            onClick={(e) => {
              if (link.name === 'Profile') {
                e.preventDefault();
                handleProfileClick();
              }
            }}
          >
            {link.name === 'Profile' ? <User size={20} className={styles.icon} /> : <>{t(`nav.${link.name.toLowerCase()}`)}</>}
          </Link>
        ))}
        <LanguageSelector />
        {isLoggedIn && (
          <button onClick={handleLogout} className={styles.logoutButton} type="button">
            <LogOut size={20} />
          </button>
        )}
      </nav>

      {/* Mobile Menu Button */}
      <button
        ref={buttonRef}
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
        <div className={styles.mobileNav} ref={menuRef}>
          {linksToShow.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              className={styles.navLink}
              onClick={(e) => {
                if (link.name === 'Profile') {
                  e.preventDefault();
                  handleProfileClick();
                }
                setIsMenuOpen(false)
              }}
            >
              {link.name === 'Profile' ? <User size={20} className={styles.icon} /> : <>{t(`nav.${link.name.toLowerCase()}`)}</>}
            </Link>
          ))}
          <div className={styles.mobileLanguageSelector}>
            <LanguageSelector />
          </div>
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
