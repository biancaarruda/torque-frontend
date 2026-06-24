import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  IconCar,
  IconTruck,
  IconMotorbike,
  IconHelpCircle,
  IconCalendar,
  IconSortAscendingShapesFilled
} from "@tabler/icons-react"

import api from "@/lib/api";

export function ClienteDetalhes({ cliente }) {
  if (!cliente) return null;

  const getVeiculoIcon = (tipoVeiculo) => {
    switch (tipoVeiculo?.toLowerCase()) {
      case "carro":
        return <IconCar className="inline-block w-5 h-5 text-primary mr-2" />;
      case "moto":
        return <IconMotorbike className="inline-block w-5 h-5 text-primary mr-2" />;
      case "caminhoneta":
        return <IconTruck className="inline-block w-5 h-5 text-primary mr-2" />;
      default:
        return <IconHelpCircle className="inline-block w-5 h-5 text-muted-foreground mr-2" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    if (dateString.startsWith("0001-01-01")) return "-";

    const d = new Date(dateString);
    if (isNaN(d)) return "-";

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const imprimirAgendamentos = async () => {
  try {
    const response = await api.get(
      `/clientes/${cliente.clienteId}/agendamentos/pdf`,
      {
        responseType: "blob",
      }
    );

    const url = URL.createObjectURL(
      new Blob([response.data], {
        type: "application/pdf",
      })
    );

    const janela = window.open(url);

    if (janela) {
      janela.onload = () => janela.print();
    }
  } catch {
    alert("Erro ao imprimir agendamentos");
  }
};

  const imprimirOrdens = async () => {
    try {
      const response = await api.get(
        `/clientes/${cliente.clienteId}/ordens/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const janela = window.open(url);

      if (janela) {
        janela.onload = () => janela.print();
      }
    } catch {
      alert("Erro ao imprimir ordens");
    }
  };

  const imprimirVeiculos = async () => {
    try {
      const response = await api.get(
        `/clientes/${cliente.clienteId}/veiculos/pdf`,
        {
          responseType: "blob",
        }
      );

      const url = URL.createObjectURL(
        new Blob([response.data], {
          type: "application/pdf",
        })
      );

      const janela = window.open(url);

      if (janela) {
        janela.onload = () => janela.print();
      }
    } catch {
      alert("Erro ao imprimir veículos");
    }
  };

  return (
    <div className="  w-full max-w-2xl bg-card rounded-lg shadow-lg border">

      <Tabs defaultValue="agendamento">
        <TabsList className="grid w-full grid-cols-3">

          <TabsTrigger value="agendamento">Agendamentos</TabsTrigger>
          <TabsTrigger value="ordemServicos">Ordens de Serviço</TabsTrigger>
          <TabsTrigger value="veiculos">Veículos</TabsTrigger>
        </TabsList>

        <TabsContent value="veiculos">
          <Card>
            <CardHeader>
              <CardTitle>Veículos de {cliente.nome}</CardTitle>
              <CardDescription>

              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {cliente.veiculos?.length ? (
                cliente.veiculos.map((v, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    {getVeiculoIcon(v.tipoVeiculo)}
                    <div>
                      <p>
                        <strong>Modelo: </strong>{v.modelo}{" - "}
                        <strong>Placa: </strong>{v.placa}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Sem veículos cadastrados.</p>
              )}
            </CardContent>
            <Button
              variant="outline"
              onClick={imprimirVeiculos}
            >
              Imprimir
            </Button>
          </Card>
        </TabsContent>



        <TabsContent value="agendamento">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos de {cliente.nome}</CardTitle>
              <CardDescription>

              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {cliente.agendamentos?.length ? (
                cliente.agendamentos.map((a, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <IconCalendar className="w-5 h-5 text-primary" />
                    <div>
                      <p>
                          <strong>Data/hora marcada: </strong>{formatDate( a.dataHoraAgendamento )}{" - "}    
                          <strong>Serviço: </strong>{a.servicoDesejado}{" - "}  
                          <strong>Status: </strong>{a.statusAgendamento}     
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>Sem agendamentos.</p>
              )}
            </CardContent>
            <Button
              variant="outline"
              onClick={imprimirAgendamentos}
            >
              Imprimir
            </Button>
          </Card>
        </TabsContent>

        <TabsContent value="ordemServicos">
          <Card>
            <CardHeader>
              <CardTitle>
                Ordens de Serviço de {cliente.nome}
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-2">
              {cliente.ordemServicos?.length ? (
                cliente.ordemServicos.map((o, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <IconSortAscendingShapesFilled className="w-5 h-5 text-primary mr-2" />
                    <div>
                      <p>
                        <strong>Abertura: </strong>{formatDate(o.dataAbertura)}{" - "}
                        <strong>Previsão: </strong>{formatDate(o.dataPrevisaoConclusao)}{" - "}
                        <strong>Status: </strong>{o.statusOrdem}{" - "}
                        <strong>Valor: </strong>R${Number(o.valorTotalOrdem).toFixed(2)}
                      </p>


                    </div>
                  </div>
                ))
              ) : (
                <p>Sem ordens de serviço.</p>
              )}
            </CardContent>
            <Button
              variant="outline"
              onClick={imprimirOrdens}
            >
              Imprimir
            </Button>
          </Card>
        </TabsContent>
            
      </Tabs>
    </div>
  );
}
