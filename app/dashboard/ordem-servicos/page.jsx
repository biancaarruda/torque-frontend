"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./features/columns";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";

import { New } from "./features/new";
import { toast } from "sonner";
import { VeiculoDetalhes } from "../veiculos/features/veiculoDetalhes";

import { formatDate } from "@/lib/date";

export default function Page() {
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedOrdem, setSelectedOrdem] = useState(null);

  const [filters, setFilters] = useState({
    nome_servico: "",
    cliente: "",
    funcionario: "",
    Veiculo: "",
    data_abertura_ordem: "",
    data_previsao_conclusao_ordem: "",
    status_ordem: "",
    valor_total_ordem: "",
    observacao: "",
  });

  const handleFilterChange = (column, value) => {
    setFilters((prev) => ({
      ...prev,
      [column]: value,
    }));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/ordem-servicos");
      setOrdens(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar ordens de serviço");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (ordem) => {
    setSelectedItem(ordem);
    setSheetOpen(true);
  };

  const handleDelete = async (ordem) => {
    if (!confirm(`Apagar ordem de serviço "${ordem.nomeServico}"?`)) return;

    try {
      await api.delete(
        `/ordem-servicos/${ordem.ordemServicoId}`
      );
      toast.success("Ordem de Serviço deletada!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar ordem de serviço!");
    }
  };

  const handlePdf = async (ordem) => {
  try {
    const response = await api.get(
      `/ordem-servicos/${ordem.ordemServicoId}/pdf`,
      {
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(
      new Blob([response.data], {
        type: "application/pdf",
      })
    );

    window.open(url, "_blank");
  } catch (error) {
    console.error(error);
  }
};

  const handlePrint = async (ordem) => {
  try {

    const response = await api.get(
      `/ordem-servicos/${ordem.ordemServicoId}/pdf`,
      {
        responseType: "blob",
      }
    );

    const file = new Blob(
      [response.data],
      { type: "application/pdf" }
    );

    const url = URL.createObjectURL(file);

    const janela = window.open(url);

    janela.onload = () => {
      janela.print();
    };

  } catch {
    toast.error("Erro ao imprimir");
  }
};

  const filteredOrdens = useMemo(() => {
    return ordens.filter((o) => {
      return (
        (!filters.nome_servico || o.nomeServico?.toLowerCase().includes(filters.nome_servico.toLowerCase())) &&

        (!filters.status_ordem || o.statusOrdem ?.toLowerCase().includes(filters.status_ordem.toLowerCase())) &&

        (!filters.valor_total_ordem || String(o.valorTotalOrdem).includes(filters.valor_total_ordem)) &&

        (!filters.data_abertura_ordem || formatDate(o.dataAbertura).toLowerCase().includes(filters.data_abertura_ordem.toLowerCase())) &&
    
        (!filters.data_previsao_conclusao_ordem || formatDate(o.dataPrevisaoConclusao).toLowerCase().includes(filters.data_previsao_conclusao_ordem.toLowerCase())) &&

        (!filters.observacao || o.observacao?.toLowerCase().includes(filters.observacao.toLowerCase())) &&

        (!filters.cliente || o.cliente?.nome ?.toLowerCase().includes(filters.cliente.toLowerCase())) &&

        (!filters.veiculo || `${o.veiculo?.marca ?? ""} ${o.veiculo?.modelo ?? ""} ${o.veiculo?.placa ?? ""}`.toLowerCase().includes(filters.veiculo.toLowerCase())) &&

        (!filters.funcionario || o.funcionario?.nome ?.toLowerCase().includes(filters.funcionario.toLowerCase()))
      );
    });
  }, [ordens, filters]);

  const columns = useMemo(
    () =>
      getColumns(
        filters,
        handleFilterChange,
        handleEdit,
        handleDelete,
        handlePrint,
        handlePdf,
      ),
    [handleEdit]
  );

  return (
    <div className="py-6 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Ordens de Serviço</CardTitle>
          <CardDescription>Lista de Ordens de Serviço</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar OS
            </Button>

            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
              <New
                item={selectedItem}
                isOpen={sheetOpen}
                onClose={() => setSheetOpen(false)}
                onSuccess={fetchData}
              />
            </Sheet>
          </CardAction>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <DataTable columns={columns} data={filteredOrdens} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
