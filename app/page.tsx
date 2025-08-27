"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/Loading";

export default function RedirectPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        router.replace("/dashboard"); 
      } else {
        router.replace("/login"); 
      }
    }
  }, [isAuthenticated, isLoading, router]);

  return (
  <Loading/>
  );
}