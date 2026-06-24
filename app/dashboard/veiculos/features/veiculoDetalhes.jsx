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
  IconCalendar,
  IconSortAscendingShapesFilled,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export function VeiculoDetalhes({ veiculo }) {
  if (!veiculo) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    if (dateString.startsWith("0001-01-01")) return "-";

    const d = new Date(dateString);
    if (isNaN(d)) return "-";

    const pad = (n) => String(n).padStart(2, "0");

    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} - ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const handlePrintAgendamentos = async () => {
  try {
    const response = await api.get(
      `/veiculos/${veiculo.veiculoId}/agendamentos/pdf`,
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

    janela.onload = () => janela.print();
  } catch (error) {
    console.error(error);
    alert("Erro ao imprimir agendamentos");
  }
};

const handlePrintOrdens = async () => {
  try {
    const response = await api.get(
      `/veiculos/${veiculo.veiculoId}/ordens/pdf`,
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

    janela.onload = () => janela.print();
  } catch (error) {
    console.error(error);
    alert("Erro ao imprimir ordens");
  }
};

  const agendamentos =
    veiculo.agendamentos ||
    veiculo.Agendamentos ||
    [];

  const ordens =
    veiculo.OrdemServicos ||
    veiculo.ordemServicos ||
    [];

  return (
    <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg border p-4">
      <Tabs defaultValue="agendamentos">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="agendamentos">
            Agendamentos
          </TabsTrigger>

          <TabsTrigger value="ordens">
            Ordens de Serviço
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agendamentos">
          <Card>
            <CardHeader>
              <CardTitle>Agendamentos</CardTitle>
              <CardDescription>
                Histórico de agendamentos do veículo
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {agendamentos.length > 0 ? (
                agendamentos.map((a, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <IconCalendar className="w-5 h-5 text-primary mt-1" />

                    <div>
                      <p>
                        <strong>Data:</strong> {formatDate( a.dataHoraAgendamento )}{" - "}
                        <strong>Serviço:</strong>{" "}{a.servicoDesejado}{" - "}
                        <strong>Status:</strong>{" "}{a.statusAgendamento}
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
                onClick={handlePrintAgendamentos}
              >
                Imprimir
              </Button>
          </Card>
        </TabsContent>

        <TabsContent value="ordens">
          <Card>
            <CardHeader>
              <CardTitle>Ordens de Serviço</CardTitle>
              <CardDescription>
                Histórico de ordens do veículo
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {ordens.length > 0 ? (
                ordens.map((o, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <IconSortAscendingShapesFilled className="w-5 h-5 text-primary mt-1" />

                    <div>
                      <p>
                        <strong>Abertura:</strong>{" "}
                        {formatDate( o.dataAbertura || o.data_abertura_ordem )} {" - "}
                      
                        <strong>Previsão:</strong>{" "}
                        {formatDate( o.dataPrevisaoConclusao || o.data_previsao_conclusao_ordem )}
                      
                        {" - "}<strong>Status:</strong>{" "} {o.statusOrdem} {" - "}
                      
                        <strong>Valor:</strong>{" "} R${Number(o.valorTotalOrdem).toFixed(2)}
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
                onClick={handlePrintAgendamentos}
              >
                Imprimir
              </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
