import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import api from "@/lib/api";

import { IconPackages } from "@tabler/icons-react";

export function FornecedorDetalhes({ fornecedor }) {
  if (!fornecedor) return null;

  const formatarPreco = (valor) => {
    if (valor == null) return "R$ 0,00";
    return Number(valor).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handlePrintEstoques = async () => {
    try {
      const response = await api.get(
        `/fornecedores/${fornecedor.fornecedorId}/estoques/pdf`,
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
    } catch {
      alert("Erro ao imprimir");
    }
  };

  return (
    <div className="w-full max-w-2xl bg-card rounded-lg shadow-lg border">

      <Tabs defaultValue="estoques">
        <TabsList className="grid w-full grid-cols-1">
          <TabsTrigger value="estoques">Estoques</TabsTrigger>
        </TabsList>

        <TabsContent value="estoques">
          <Card>
            <CardHeader>
              
              <CardTitle>
                Peças fornecidas por {fornecedor.nomeFantasia}
              </CardTitle>
              
            </CardHeader>

            <CardContent className="space-y-2">
              {fornecedor.estoques?.length > 0 ? (
                fornecedor.estoques.map((e, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <IconPackages className="w-5 h-5 text-primary mt-1" />
                    <div>
                      <p>
                        <strong>Nome da peça: </strong>{e.nomePeca}{" - "} 
                        <strong>Qtd: </strong>{e.quantidadeDisponivelPeca}{" - "} 
                        <strong>Valor: </strong>{formatarPreco(e.precoUnitarioPeca)}
                      </p>
                    </div>
                  </div>
                  
                ))
              ) : (
                <p>Não há peças cadastradas.</p>
              )}
            </CardContent>
            <Button
              variant="outline"
              onClick={handlePrintEstoques}
            >
              Imprimir 
            </Button>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
