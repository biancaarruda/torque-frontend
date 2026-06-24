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

export default function Page() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedFuncionario, setSelectedFuncionario] = useState(null);

  const [filters, setFilters] = useState({
    nome: "",
    cargo: "",
    email: "",
    telefone: "",
    cpf: "",
    rua: "",
    numero: "",
    bairro: "",
    cidade: "",
    estado: "",
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
      const res = await api.get("/funcionarios");
      setFuncionarios(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar funcionários!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetails = (funcionario) => {
    setSelectedFuncionario(funcionario);
    setDetalhesOpen(true);
  };

  const handleEdit = (funcionario) => {
    setSelectedItem(funcionario);
    setSheetOpen(true);
  };

  const handleDelete = async (funcionario) => {
    if (!confirm(`Apagar ${funcionario.nome}?`)) return;

    try {
      await api.delete(
        `/funcionarios/${funcionario.funcionarioId}`
      );
      toast.success("Funcionário deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar funcionário!");
    }
  };

  const handlePdf = async (funcionario) => {
  try {
    const response = await api.get(
      `/funcionarios/${funcionario.funcionarioId}/pdf`,
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

  const handlePrint = async (funcionario) => {
  try {

    const response = await api.get(
      `/funcionarios/${funcionario.funcionarioId}/pdf`,
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

  const filteredFuncionarios = useMemo(() => {
    return funcionarios.filter((f) => {
      return (
        (!filters.nome || f.nome?.toLowerCase().includes(filters.nome.toLowerCase())) &&

        (!filters.cargo || f.cargo?.toLowerCase().includes(filters.cargo.toLowerCase())) &&

        (!filters.email || f.contato?.email?.toLowerCase().includes(filters.email.toLowerCase())) &&

        (!filters.telefone || f.contato?.telefone?.toLowerCase().includes(filters.telefone.toLowerCase())) &&

        (!filters.cpf || f.contato?.cpf?.toLowerCase().includes(filters.cpf.toLowerCase())) &&

        (!filters.rua || f.endereco?.rua?.toLowerCase().includes(filters.rua.toLowerCase())) &&

        (!filters.numero || String(f.endereco?.numero).includes(filters.numero)) &&

        (!filters.bairro || f.endereco?.bairro?.toLowerCase().includes(filters.bairro.toLowerCase())) &&

        (!filters.cidade || f.endereco?.cidade?.toLowerCase().includes(filters.cidade.toLowerCase())) &&

        (!filters.estado || f.endereco?.estado?.toLowerCase().includes(filters.estado.toLowerCase()))
      );
    });
  }, [funcionarios, filters]);

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
          <CardTitle>Funcionários</CardTitle>
          <CardDescription>Oficina - Torque</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar funcionário
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
            <DataTable columns={columns} data={filteredFuncionarios} />
          )}
        </CardContent>
      </Card>

      {detalhesOpen && selectedFuncionario && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20">
          <div className="bg-card p-6 rounded-lg w-[600px] shadow-xl space-y-4">
            <Button onClick={() => setDetalhesOpen(false)}>
              Fechar
            </Button>

            <FuncionarioDetalhes funcionario={selectedFuncionario} />
          </div>
        </div>
      )}
    </div>
  );
}
