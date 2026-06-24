"use client"

import api from "@/lib/api";

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconBrandSpeedtest,
  IconCalendar,
  IconPackages,
  IconCarGarage,
  IconSortAscendingShapes,
  IconInnerShadowTop,
  IconDashboard,
  IconReport,
  IconDatabase,
  IconFileWord,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
//import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard },
    { title: "Agendamentos", url: "/dashboard/agendamentos", icon: IconCalendar },
    { title: "Clientes", url: "/dashboard/clientes", icon: IconUsers },
    { title: "Estoque", url: "/dashboard/estoques", icon: IconPackages },
    { title: "Fornecedores", url: "/dashboard/fornecedores", icon: IconInnerShadowTop },
    { title: "Funcionários", url: "/dashboard/funcionarios", icon: IconUsers },
    { title: "Ordens de Serviço", url: "/dashboard/ordem-servicos", icon: IconSortAscendingShapes },
    { title: "Veículos", url: "/dashboard/veiculos", icon: IconCarGarage },
  ],/*
  navSecondary: [
    { title: "Configurações", url: "/dashboard/configuracoes", icon: IconSettings },
  ],*/
}

export function AppSidebar({ ...props }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
  async function fetchUser() {
    try {
      const res = await api.get("/conta");

      setUser({
        name: res.data.nome,
        role: res.data.cargo,
        avatar: res.data.avatar
          ? `${process.env.NEXT_PUBLIC_API_URL}${res.data.avatar}`
          : `https://ui-avatars.com/api/?name=${res.data.nome}`,
      });
    } catch (err) {
      console.error(err);
    }
  }

  fetchUser();
}, []);


  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <IconBrandSpeedtest className="!size-5 bg-primary text-primary-foreground flex size-6 rounded-md" />
                <span className="text-base font-semibold">Torque</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>

      <SidebarFooter>
        {user && <NavUser user={user} />}
      </SidebarFooter>
    </Sidebar>
  )
}