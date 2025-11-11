"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import DoctorTable from "./DoctorTable.jsx";
import { authService } from '@/lib/auth';

export default function DoctorPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null; 
  }

  return <DoctorTable />;
}