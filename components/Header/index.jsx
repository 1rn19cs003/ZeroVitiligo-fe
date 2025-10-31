"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoImage from "@/public/images/NewLogo.svg";
import styles from "./styles.module.css";
import { NAVIGATION_LINKS } from "@/lib/constants";

export const  Header=()=> {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setIsClient(true), 0);
    return () => clearTimeout(id);
  }, []);

  if (!isClient) {
    return <header className={styles.placeholderHeader} />;
  }

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
        />
        {/* <a className={styles.logoText}>{APP_NAME.toUpperCase()}</a> */}

         <Link href="/" className={styles.logo}>
              <span className={styles.logoZero}>ZERO</span>
              <span className={styles.logoVitiligo}>VITILIGO</span>
            </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className={styles.desktopNav}>
        {NAVIGATION_LINKS.map((link) => (
          <Link key={link.name} href={link.href} prefetch={false}>
            {link.name}
          </Link>
        ))}
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
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              prefetch={false}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
