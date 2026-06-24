

"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar";

import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

import api from "@/lib/api";

export default function Page({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        await api.get("/conta")
        setLoading(false)
      } catch (err) {
        console.error("Erro na autenticação:", err.response?.status, err.response?.data);
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])


  if (loading) {
    return (
      <IconLoader className="size-10 animate-spin mx-auto h-screen text-orange-600" />
    );
  }

  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 72)",
        "--header-height": "calc(var(--spacing) * 12)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
