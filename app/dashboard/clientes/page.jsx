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
import { ClienteDetalhes } from "./features/clienteDetalhes";
import { toast } from "sonner";

export default function Page() {
  const [clientes, setClientes] = useState([]);
  const [clientesLoading, setClientesLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [detalhesOpen, setDetalhesOpen] = useState(false);
  const [selectedCliente, setSelectedCliente] = useState(null);

  const [filters, setFilters] = useState({
    nome: "",
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
      const res = await api.get("/clientes");
      setClientes(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewDetails = (cliente) => {
    setSelectedCliente(cliente);
    setDetalhesOpen(true);
  };

  const handleEdit = (cliente) => {
    setSelectedItem(cliente);
    setSheetOpen(true);
  };

  const handleDelete = async (cliente) => {
    if (!confirm(`Apagar ${cliente.nome}?`)) return;

    try {
      await api.delete(`/clientes/${cliente.clienteId}`);
      toast.success("Cliente deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar cliente");
    }
  };

  const handlePdf = async (cliente) => {
    try {
      const response = await api.get(
        `/clientes/${cliente.clienteId}/pdf`,
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

  const handlePrint = async (cliente) => {
    try {

      const response = await api.get(
        `/clientes/${cliente.clienteId}/pdf`,
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
  
  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      return (
        (!filters.nome || c.nome?.toLowerCase().includes(filters.nome.toLowerCase())) &&

        (!filters.email || c.contato?.email?.toLowerCase().includes(filters.email.toLowerCase())) &&

        (!filters.telefone || c.contato?.telefone?.toLowerCase().includes(filters.telefone.toLowerCase())) &&

        (!filters.cpf || c.contato?.cpf?.toLowerCase().includes(filters.cpf.toLowerCase())) &&

        (!filters.cnpj || c.contato?.cnpj?.toLowerCase().includes(filters.cnpj.toLowerCase())) &&

        (!filters.rua || c.endereco?.rua?.toLowerCase().includes(filters.rua.toLowerCase())) &&

        (!filters.numero || String(c.endereco?.numero).includes(filters.numero)) &&

        (!filters.bairro || c.endereco?.bairro?.toLowerCase().includes(filters.bairro.toLowerCase())) &&

        (!filters.cidade || c.endereco?.cidade?.toLowerCase().includes(filters.cidade.toLowerCase())) &&

        (!filters.estado || c.endereco?.estado?.toLowerCase().includes(filters.estado.toLowerCase()))
      );
    });
  }, [clientes, filters]);

  const columns = useMemo(
    () =>
      getColumns(
        filters,
        handleFilterChange,
        handleEdit,
        handleDelete,
        handleViewDetails, 
        handlePrint,
        handlePdf,
      ),
    [handleEdit]
  );

  return (
    <div className="py-6 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Clientes</CardTitle>
          <CardDescription>Oficina - Torque</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar cliente
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
            <DataTable columns={columns} data={filteredClientes} />
          )}
        </CardContent>
      </Card>

      {detalhesOpen && selectedCliente && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-start pt-20">
          <div className="bg-card p-6 rounded-lg w-[600px] shadow-xl space-y-4">
            <Button onClick={() => setDetalhesOpen(false)}>
              Fechar
            </Button>

            <ClienteDetalhes cliente={selectedCliente} />
          </div>
        </div>
      )}


    </div>
  );
}
