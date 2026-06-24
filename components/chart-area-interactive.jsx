"use client";

import * as React from "react";
import api from "@/lib/api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  PieChart,
  Pie,
  Tooltip,
  Cell,
} from "recharts";
import { DataTable } from "@/components/data-table";

const pieColors = ["#ffb86a", "#ff6900", "#f54a00", "#cb6115", "#9f2d00"];
const emptyConfig = {};

export default function ChartAreaInteractive() {
  const [loading, setLoading] = React.useState(true);
  const [agendamentosChartData, setAgendamentosChartData] = React.useState([]);
  const [ordensStatusData, setOrdensStatusData] = React.useState([]);
  const [proximosAgendamentos, setProximosAgendamentos] = React.useState([]);
  const [estoqueAlertas, setEstoqueAlertas] = React.useState([]);

  React.useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await api.get("/dashboard");
          
        setAgendamentosChartData(data.agendamentos || []);
        setOrdensStatusData(data.ordensStatus || []);
        setProximosAgendamentos(data.proximosAgendamentos || []);
        setEstoqueAlertas(data.estoqueAlertas || []);
      } catch (error) {
        console.error("Erro ao buscar dados do dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Carregando dados do dashboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos Últimos 7 dias</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={emptyConfig} className="h-80 w-full">
              <AreaChart data={agendamentosChartData}>
                <defs>
                  <linearGradient id="agendados" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="concluidos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#fb923c" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                    })
                  }
                />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })
                  }
                />
                <Area
                  dataKey="agendados"
                  stroke="#f97316"
                  fill="url(#agendados)"
                  type="monotone"
                />
                <Area
                  dataKey="concluidos"
                  stroke="#fb923c"
                  fill="url(#concluidos)"
                  type="monotone"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ordens de Serviço por Status</CardTitle>
            <CardDescription>Últimas semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={emptyConfig} className="h-80 w-full">
              <PieChart>
                <Tooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={ordensStatusData}
                  dataKey="total"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {ordensStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={pieColors[index % pieColors.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Agendamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { accessorKey: "horario", header: "Horário" },
                { accessorKey: "cliente", header: "Cliente" },
                { accessorKey: "veiculo", header: "Veículo" },
                { accessorKey: "servico", header: "Serviço" },
              ]}
              data={proximosAgendamentos}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas de Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {estoqueAlertas.map((item, idx) => (
              <div
                key={idx}
                className={`flex items-center justify-between p-4 rounded-md ${
                  item.nivel === "Crítico"
                    ? "bg-gradient-to-r from-red-100 to-red-50"
                    : "bg-gradient-to-r from-yellow-100 to-yellow-50"
                }`}
              >
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full ${
                    item.nivel === "Crítico"
                      ? "bg-red-600"
                      : "bg-yellow-400"
                  } text-white font-bold`}
                >
                  !
                </div>

                <div className="flex-1 ml-3">
                  <div className="text-black font-medium">{item.item}</div>
                  <div className="text-gray-500 text-sm">
                    Estoque atual: {item.atual} | mínimo: {item.minimo}
                  </div>
                </div>

                <div
                  className={`font-bold ${
                    item.nivel === "Crítico"
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {item.nivel}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
