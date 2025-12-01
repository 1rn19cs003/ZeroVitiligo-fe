"use client"
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import DoctorTable from "./DoctorTable.jsx";
import { useIsAuthenticated } from "@/hooks/useAuth.js";

export default function DoctorPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (!useIsAuthenticated()()) {
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