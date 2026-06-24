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

import { TrendingUp, TrendingDown, Users } from "lucide-react";

const chartConfig = {
  total: {
    label: "Faturamento:",
    color: "hsl(var(--primary))",
  },
};

export function PerfilGerente() {
  const [funcionarios, setFuncionarios] = useState(0);
  const [fornecedores, setFornecedores] = useState([]);
  const [faturamento, setFaturamento] = useState([]);
  const [variacao, setVariacao] = useState(0);

  useEffect(() => {
    async function carregar() {
      const [funcRes, fornRes, osRes] = await Promise.all([
        api.get("/funcionarios"),
        api.get("/fornecedores"),
        api.get("/ordem-servicos"),
      ]);

      const funcionariosData = Array.isArray(funcRes.data)
        ? funcRes.data
        : funcRes.data?.$values ?? [];

      const fornecedoresData = Array.isArray(fornRes.data)
        ? fornRes.data
        : fornRes.data?.$values ?? [];

      const osData = Array.isArray(osRes.data)
        ? osRes.data
        : osRes.data?.$values ?? [];

      const concluidas = osData.filter(
        (o) => o.statusOrdem === "Concluido"
      );

      const agrupado = {};

      concluidas.forEach((o) => {
        const date = new Date(o.dataAbertura);

        const key =
          date.getFullYear() * 100 + (date.getMonth() + 1);

        agrupado[key] =
          (agrupado[key] || 0) + Number(o.valorTotalOrdem || 0);
      });

      const chartData = Object.entries(agrupado)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([key, total]) => {
          const year = String(key).slice(0, 4);
          const month = String(key).slice(4, 6);

          const date = new Date(Number(year), Number(month) - 1);

          return {
            month: date.toLocaleString("pt-BR", { month: "short" }),
            total: Number(total),
          };
        });

      if (chartData.length >= 2) {
        const last = chartData.at(-1).total;
        const prev = chartData.at(-2).total;

        const diff = prev === 0 ? 100 : ((last - prev) / prev) * 100;
        setVariacao(diff);
      }

      setFuncionarios(funcionariosData.length);
      setFornecedores(fornecedoresData);
      setFaturamento(chartData);
    }

    carregar();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-500">
        Painel Gerencial
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-background text-foreground border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Funcionários
            </CardTitle>
          </CardHeader>

          <CardContent className="text-3xl font-bold text-foreground">
            {funcionarios}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-background text-foreground border-border">
        <CardHeader>
          <CardTitle>Faturamento Mensal</CardTitle>
          <CardDescription>
            Evolução do faturamento por mês
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ChartContainer config={chartConfig}>
            <BarChart data={faturamento}>
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
              />

              <ChartTooltip
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

        <CardFooter className="flex items-center gap-2 text-sm">
          {variacao >= 0 ? (
            <>
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">
                Crescimento de {variacao.toFixed(1)}%
              </span>
            </>
          ) : (
            <>
              <TrendingDown className="h-4 w-4 text-red-500" />
              <span className="text-red-500">
                Queda de {Math.abs(variacao).toFixed(1)}%
              </span>
            </>
          )}
        </CardFooter>
      </Card>

      <Card className="bg-background text-foreground border-border">
        <CardHeader>
          <CardTitle>Fornecedores</CardTitle>
        </CardHeader>

        <CardContent className="space-y-2">
          {fornecedores.map((f) => (
            <div
              key={f.fornecedorId}
              className="p-3 rounded-md border border-border bg-muted"
            >
              <div className="font-medium">
                {f.nomeFantasia}
              </div>

              <div className="text-sm text-muted-foreground">
                {f.contato?.email} • {f.contato?.telefone}
              </div>

              <div className="text-sm text-muted-foreground">
                {f.endereco?.cidade}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}