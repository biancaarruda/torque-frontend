"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { New } from "./features/new";
import { FornecedorDetalhes } from "./features/fornecedorDetalhes";

export default function Page() {
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedFornecedor, setSelectedFornecedor] = useState(null);

  const [filters, setFilters] = useState({
    razao_social: "",
    nome_fantasia: "",
    email: "",
    telefone: "",
    cpf: "",
    cnpj: "",
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
    try {
      setLoading(true);

      const res = await api.get("/fornecedores", {
        params: { page, pageSize },
      });

      setFornecedores(res.data ?? []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar fornecedores");
      setFornecedores([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (item) => {
    if (!confirm(`Excluir "${item.razaoSocial}"?`)) return;

    try {
      await api.delete(`/fornecedores/${item.fornecedorId}`);
      toast.success("Fornecedor deletado!");
      fetchData();
    } catch (error) {
      console.error(error);
       if (error.response?.status === 500) {
        toast.error(
          "Exclua primeiro os itens de estoque fornecidos por este fornecedor."
        );
      } else {
        toast.error("Falha ao deletar fornecedor");
      }
    }
  };

  const handleEdit = (fornecedor) => {
    setSelectedItem(fornecedor);
    setSheetOpen(true);
  };

  const handleViewDetails = (fornecedor) => {
    setSelectedFornecedor(fornecedor);
    setDetalhesOpen(true);
  };

  const handlePageSizeChange = (value) => {
    setPageSize(Number(value));
    setPage(1);
  };

  const handlePdf = async (fornecedor) => {
    try {
      const response = await api.get(
        `/fornecedores/${fornecedor.fornecedorId}/pdf`,
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

  const handlePrint = async (fornecedor) => {
    try {

      const response = await api.get(
        `/fornecedores/${fornecedor.fornecedorId}/pdf`,
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

  const filteredFornecedores = useMemo(() => {
    return fornecedores.filter((f) => {
      return (
        (!filters.razao_social || f.razaoSocial?.toLowerCase().includes(filters.razao_social.toLowerCase())) &&

        (!filters.nome_fantasia || f.nomeFantasia?.toLowerCase().includes(filters.nome_fantasia.toLowerCase())) &&

        (!filters.email || f.contato?.email?.toLowerCase().includes(filters.email.toLowerCase())) &&

        (!filters.telefone || f.contato?.telefone?.toLowerCase().includes(filters.telefone.toLowerCase())) &&

        (!filters.cpf || f.contato?.cpf?.toLowerCase().includes(filters.cpf.toLowerCase())) &&

        (!filters.cnpj || f.contato?.cnpj?.toLowerCase().includes(filters.cnpj.toLowerCase())) &&

        (!filters.rua || f.endereco?.rua?.toLowerCase().includes(filters.rua.toLowerCase())) &&

        (!filters.numero || String(f.endereco?.numero).includes(filters.numero)) &&

        (!filters.bairro || f.endereco?.bairro?.toLowerCase().includes(filters.bairro.toLowerCase())) &&

        (!filters.cidade || f.endereco?.cidade?.toLowerCase().includes(filters.cidade.toLowerCase())) &&

        (!filters.estado || f.endereco?.estado?.toLowerCase().includes(filters.estado.toLowerCase()))
      );
    });
  }, [fornecedores, filters]);

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
          <CardTitle>Fornecedores</CardTitle>
          <CardDescription>Lista de Fornecedores</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar fornecedor
            </Button>

            <New
              item={selectedItem}
              isOpen={sheetOpen}
              onClose={() => setSheetOpen(false)}
              onSuccess={() => {
                setSheetOpen(false);
                fetchData();
              }}
            />
          </CardAction>
        </CardHeader>

        <CardContent>
          {loading ? (
            <p className="text-muted-foreground">Carregando...</p>
          ) : (
            <DataTable columns={columns} data={filteredFornecedores} />
          )}

          <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Select
                value={String(pageSize)}
                onValueChange={handlePageSizeChange}
              >
                <SelectTrigger className="w-[80px] h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>por página</span>
            </div>

            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
              >
                ‹
              </Button>

              <span className="px-3 py-1">Página {page}</span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setPage((p) => p + 1)}
              >
                ›
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {detalhesOpen && selectedFornecedor && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20 z-50">
          <div className="bg-card p-6 rounded-lg w-[600px]">
            <Button
              variant="outline"
              onClick={() => setDetalhesOpen(false)}
              className="mb-4"
            >
              Fechar
            </Button>

            <FornecedorDetalhes fornecedor={selectedFornecedor} />
          </div>
        </div>
      )}
    </div>
  );
}
