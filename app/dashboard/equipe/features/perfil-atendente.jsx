"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import { TrendingUp, Users, Calendar, CheckCircle2 } from "lucide-react";

export function PerfilAtendente({ usuario }) {
  const [clientes, setClientes] = useState(0);
  const [agendamentos, setAgendamentos] = useState(0);
  const [osConcluidas, setOsConcluidas] = useState(0);

  useEffect(() => {
    async function carregar() {
      const [clientesRes, agendamentosRes, osRes] = await Promise.all([
        api.get("/clientes"),
        api.get("/agendamentos"),
        api.get("/ordem-servicos"),
      ]);

      const clientesData = Array.isArray(clientesRes.data)
        ? clientesRes.data
        : clientesRes.data?.$values ?? [];

      const agendamentosRaw = agendamentosRes.data;

      const agendamentosData = Array.isArray(agendamentosRaw)
        ? agendamentosRaw
        : agendamentosRaw?.$values ??
          agendamentosRaw?.data ??
          [];

      const osData = Array.isArray(osRes.data)
        ? osRes.data
        : osRes.data?.$values ?? [];

      const concluidas = osData.filter(
        (o) => o.statusOrdem === "Concluido"
      ).length;

      setClientes(clientesData.length);
      setAgendamentos(agendamentosData.length);
      setOsConcluidas(concluidas);
    }

    carregar();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">
        Desempenho
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        <Card className="bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Clientes
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {clientes}
          </CardContent>
        </Card>

        <Card className="bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Agendamentos
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {agendamentos}
          </CardContent>
        </Card>

        <Card className="bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Faturamentos Fechados
            </CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {osConcluidas}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}