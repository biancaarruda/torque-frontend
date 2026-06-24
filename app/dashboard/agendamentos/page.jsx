"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { toast } from "sonner";

import api from "@/lib/api";
import { DataTable } from "@/components/data-table";
import { getColumns } from "./features/columns";
import { Sheet } from "@/components/ui/sheet";
import { formatDate } from "@/lib/date";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { New } from "./features/new";

export default function Page() {

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filters, setFilters] = useState({
    servico: "",
    cliente: "",
    veiculo: "",
    data: "",
    status: "",
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

      const res = await api.get("/agendamentos");

      setAgendamentos(res.data.data);
    }
    catch (error) {
      toast.error("Erro ao carregar agendamentos");
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (agendamento) => {
    setSelectedItem(agendamento);
    setSheetOpen(true);
  };

  const handleDelete = async (agendamento) => {
    if (!confirm(`Apagar agendamento: ${agendamento.servicoDesejado} ?`)) return;

    try {
      await api.delete(`/agendamentos/${agendamento.agendamentoId}`);

      toast.success("Agendamento deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar agendamento");
    }
  };

  const handlePdf = async (agendamento) => {
  try {
    const response = await api.get(
      `/agendamentos/${agendamento.agendamentoId}/pdf`,
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

  const handlePrint = async (agendamento) => {
  try {

    const response = await api.get(
      `/agendamentos/${agendamento.agendamentoId}/pdf`,
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

  const filteredAgendamentos = useMemo(() => {
    return agendamentos.filter((a) => {
      return (
        (!filters.servico || a.servicoDesejado?.toLowerCase().includes(filters.servico.toLowerCase())) &&

        (!filters.status || a.statusAgendamento?.toLowerCase().includes(filters.status.toLowerCase())) &&

        (!filters.data || formatDate(a.dataHoraAgendamento).toLowerCase().includes(filters.data.toLowerCase())) &&

        (!filters.cliente || a.cliente?.nome?.toLowerCase().includes(filters.cliente.toLowerCase())) &&

        (!filters.veiculo || `${a.veiculo?.marca ?? ""} ${a.veiculo?.modelo ?? ""} ${a.veiculo?.placa ?? ""}`.toLowerCase().includes(filters.veiculo.toLowerCase()))
      );
    });
  }, [agendamentos, filters]);

  const columns = useMemo(
    () =>
      getColumns(
        filters,
        handleFilterChange,
        handleEdit,
        handleDelete,
        handlePdf,
        handlePrint,
      ),
    [handleEdit]
  );

  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos</CardTitle>
          <CardDescription>
            Lista de agendamentos
          </CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar agendamento
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
          {loading
            ? <p>Carregando...</p>
            : <DataTable columns={columns} data={filteredAgendamentos} />
          }
        </CardContent>
      </Card>

    </div>

  );

}
