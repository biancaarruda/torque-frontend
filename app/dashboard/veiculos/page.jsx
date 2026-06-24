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
import { VeiculoDetalhes } from "./features/veiculoDetalhes";
import { toast } from "sonner";

export default function Page() {
  const [veiculos, setVeiculos] = useState([]);
  const [veiculosLoading, setVeiculosLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedVeiculo, setSelectedVeiculo] = useState(null);

  const [filters, setFilters] = useState({
    marca: "",
    tipoVeiculo: "",
    modelo: "",
    anoVeiculo: "",
    placa: "",
    cliente: "",
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
      const res = await api.get("/veiculos");
      setVeiculos(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar veículos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetails = (veiculo) => {
    setSelectedVeiculo(veiculo);
    setDetalhesOpen(true);
  };

  const handleEdit = (veiculo) => {
    setSelectedItem(veiculo);
    setSheetOpen(true);
  };

  const handleDelete = async (veiculo) => {
    if (!confirm(`Apagar ${veiculo.tipoVeiculo}: ${veiculo.placa} ?`)) return;

    try {
      await api.delete(`/veiculos/${veiculo.veiculoId}`);
      toast.success("Veículo deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar veículo");
    }
  };

  const handlePdf = async (veiculo) => {
  try {
    const response = await api.get(
      `/veiculos/${veiculo.veiculoId}/pdf`,
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

  const handlePrint = async (veiculo) => {
  try {

    const response = await api.get(
      `/veiculos/${veiculo.veiculoId}/pdf`,
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

  const filteredVeiculos = useMemo(() => {
    return veiculos.filter((v) => {
      return (
        (!filters.marca || v.marca?.toLowerCase().includes(filters.marca.toLowerCase())) &&

        (!filters.tipoVeiculo || v.tipoVeiculo ?.toLowerCase().includes(filters.tipoVeiculo.toLowerCase())) &&

        (!filters.modelo || v.modelo?.toLowerCase().includes(filters.modelo.toLowerCase())) &&

        (!filters.anoVeiculo || String(v.anoVeiculo).includes(filters.anoVeiculo)) &&

        (!filters.placa || v.placa?.toLowerCase().includes(filters.placa.toLowerCase())) &&

        (!filters.cliente || v.cliente?.nome ?.toLowerCase().includes(filters.cliente.toLowerCase()))
      );
    });
  }, [veiculos, filters]);

  const columns = useMemo(
    () =>
      getColumns(
        filters,
        handleFilterChange,
        handleEdit,
        handleDelete,
        handleViewDetails,
        handlePdf,
        handlePrint,
      ),
    [handleEdit]
  );

  return (
    <div className="py-6 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Veículos</CardTitle>
          <CardDescription>Oficina - Torque </CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar veículo
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
            <DataTable columns={columns} data={filteredVeiculos} />
          )}
        </CardContent>
      </Card>

      {detalhesOpen && selectedVeiculo && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20">
          <div className="bg-card p-6 rounded-lg w-[600px] shadow-xl space-y-4">
            <Button onClick={() => setDetalhesOpen(false)}>
              Fechar
            </Button>

            <VeiculoDetalhes veiculo={selectedVeiculo} />
          </div>
        </div>
      )}
    </div>
  );
}
