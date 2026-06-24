"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import api from "@/lib/api";
import { toast } from "sonner";

import { DataTable } from "@/components/data-table";
import { getColumns } from "../estoques/features/columns";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { New } from "../estoques/features/new";

const Page = () => {
  const [estoques, setEstoques] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filters, setFilters] = useState({
    nome_peca: "",
    codigo_referencia_peca: "",
    quantidade_disponivel_peca: "",
    preco_unitario_peca: "",
    fornecedor: "",
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

      const response = await api.get("/estoques");

      console.log("API RESPONSE:", response.data);

      const data = response.data.data ?? response.data;

      setEstoques(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar estoques");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (estoque) => {
    setSelectedItem(estoque);
    setSheetOpen(true);
  };

  const handleDelete = async (estoque) => {
    if (!confirm(`Apagar ${estoque.nomePeca}?`)) return;

    try {
      await api.delete(`/estoques/${estoque.estoqueId}`);
      toast.success("Estoque deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar Estoque");
    }
  };  
  
  const handlePdf = async (estoque) => {
  try {
    const response = await api.get(
      `/estoques/${estoque.estoqueId}/pdf`,
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

  const handlePrint = async (estoque) => {
  try {

    const response = await api.get(
      `/estoques/${estoque.estoqueId}/pdf`,
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

  const filteredEstoques = useMemo(() => {
      return estoques.filter((e) => {
        return (
          (!filters.nome_peca || e.nomePeca?.toLowerCase().includes(filters.nome_peca.toLowerCase())) &&
    
          (!filters.preco_unitario_peca || String(e.precoUnitarioPeca).includes(filters.preco_unitario_peca)) &&

          (!filters.quantidade_disponivel_peca || String(e.quantidadeDisponivelPeca).includes(filters.quantidade_disponivel_peca)) &&

          (!filters.codigo_referencia_peca || e.codigoReferenciaPeca?.toLowerCase().includes(filters.codigo_referencia_peca.toLowerCase())) &&
  
          (!filters.fornecedor || e.fornecedor?.nomeFantasia ?.toLowerCase().includes(filters.fornecedor.toLowerCase()))
    
        );
      });
    }, [estoques, filters]);

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
    [handleEdit],
    (item) => {
      setSelectedItem(item);
      setSheetOpen(true);
    },
    handleDelete
  );


  return (
    <div className="py-4 md:py-6 px-4 lg:px-6">
      <Card>
        <CardHeader>
          <CardTitle>Estoques</CardTitle>
          <CardDescription>Lista de Estoques</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar item
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
            <DataTable columns={columns} data={filteredEstoques} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
