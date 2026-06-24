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
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [accessDenied, setAccessDenied] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const res = await api.get("/usuarios");
      setUsuarios(res.data);
      setAccessDenied(false);
    } catch (err) {
      if (err.response?.status === 403) {
        setAccessDenied(true);
        return;
      }
      toast.error("Erro ao carregar integrante da equipe!");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = (usuario) => {
    setSelectedItem(usuario);
    setSheetOpen(true);
  };

  const handleDelete = async (usuario) => {
    if (!confirm(`Primeiro apague o usuário na janela de funcionários. Deseja apagar integrante ${usuario.nome}?`)) return;

    try {
      await api.delete(`/usuarios/${usuario.usuarioId}`);
      toast.success("Integrante da equipe deletado!");
      fetchData();
    } catch (error) {
      toast.error("Erro ao deletar integrante da equipe!");
    }
  };

  const columns = useMemo(
    () => getColumns({}, () => { }, handleEdit, handleDelete),
    [handleEdit]
  );

  if (accessDenied) {
    return (
      <div className="py-6 px-6">
        <Card>
          <CardHeader>
            <CardTitle style={{ textAlign: 'center', color: '#F54A00' }}>Acesso negado!</CardTitle>
            <CardDescription style={{ textAlign: 'center' }}>
              Somente administradores e gerentes têm acesso ao cadastro de funcionários.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-6">
      <Card>
        <CardHeader>
          <CardTitle>Integrantes da Equipe</CardTitle>
          <CardDescription>Oficina - Torque</CardDescription>

          <CardAction>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setSheetOpen(true);
              }}
            >
              Adicionar integrante
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
            <DataTable columns={columns} data={usuarios} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
