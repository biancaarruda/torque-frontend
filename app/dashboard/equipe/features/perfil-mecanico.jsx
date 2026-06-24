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

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
} from "recharts";

import { TrendingUp } from "lucide-react";

const chartConfig = {
  total: {
    label: "OS Concluídas",
    color: "hsl(var(--primary))",
  },
};

export function PerfilMecanico({ usuario }) {
  const [ordensMes, setOrdensMes] = useState([]);
  const [emAndamento, setEmAndamento] = useState([]);

  useEffect(() => {
    async function carregar() {
      const [ordensRes] = await Promise.all([
        api.get("/ordem-servicos"),
      ]);

      const ordens = Array.isArray(ordensRes.data)
        ? ordensRes.data
        : ordensRes.data?.$values ?? [];

      const id = usuario.usuarioId;

      const minhasOS = ordens.filter(
        (o) => o.funcionario?.funcionarioId === id
      );

      const abertas = minhasOS.filter(
        (o) => o.statusOrdem === "Pendente"
      );

      const concluidas = minhasOS.filter(
        (o) => o.statusOrdem === "Concluido"
      );

      const agrupado = {};

      concluidas.forEach((o) => {
        const date = new Date(o.dataAbertura);

        const key =
          date.getFullYear() * 100 +
          (date.getMonth() + 1);

        agrupado[key] = (agrupado[key] || 0) + 1;
      });

      const chartData = Object.entries(agrupado)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([key, total]) => {
          const year = String(key).slice(0, 4);
          const month = String(key).slice(4, 6);

          const date = new Date(year, month - 1);

          return {
            month: date.toLocaleString("pt-BR", {
              month: "short",
            }),
            total,
          };
        });

      setOrdensMes(chartData);
      setEmAndamento(abertas);
    }

    carregar();
  }, [usuario]);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">
        Desempenho
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço Concluídas por Mês</CardTitle>
          <CardDescription>
            Histórico de entregas realizadas
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={ordensMes}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />

              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar
                dataKey="total"
                fill="var(--primary)"
                radius={6}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium text-orange-500">
            Evolução de entregas{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
        </CardFooter>
      </Card>

      <Card className="bg-background text-foreground border-border">
        <CardHeader>
          <CardTitle className="text-foreground">
            Ordens de Serviço em Andamento ({emAndamento.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {emAndamento.map((o) => (
            <div
              key={o.ordemServicoId}
              className="p-3 rounded-md bg-muted text-foreground border border-border"
            >
              <div className="font-medium text-foreground">
                {o.nomeServico}
              </div>
              <div className="text-sm text-foreground/70 dark:text-muted-foreground-sm text-muted-foreground">
                {o.statusOrdem}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}