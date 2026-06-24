"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api";
import { IconTrendingDown, IconTrendingUp, IconMinus } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function SectionCards() {
  const [data, setData] = useState(null)

  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await api.get("/dashboard");
        setData(data);
      } catch (err) {
        console.error(err);
      }
    }

    carregar();
  }, []);

  if (!data) return <div>Carregando...</div>

  
  const resumo = data.resumo

  const cardsData = [
    {
      title: "Agendamentos do Dia",
      value: resumo.agendamentosHoje,
      description: `Confirmados: ${resumo.agendamentosConfirmados} | Pendentes: ${resumo.agendamentosPendentes}`,
    },
    {
      title: "Ordens em Andamento",
      value: resumo.ordensEmAndamento,
    },
    {
      title: "Veículos em Serviço",
      value: resumo.veiculosEmServico,
    },
    {
      title: "Clientes Cadastrados",
      value: resumo.totalClientes,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cardsData.map((card, idx) => (
        <Card key={idx}>
          <CardHeader>
            <CardDescription>{card.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold">
              {card.value}
            </CardTitle>
          </CardHeader>

          {card.description && (
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div>{card.description}</div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  )
}
