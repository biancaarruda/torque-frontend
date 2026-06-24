"use client";

import { Button } from "@/components/ui/button";
import { IconEdit, IconTrash } from "@tabler/icons-react";

export const getColumns = (onEdit, onDelete) => [
  {
    header: "Nome",
    accessorKey: "Nome",
  },
  {
    header: "NomeUsuario",
    accessorKey: "NomeUsuario",
  },
  {
    header: "Telefone",
    accessorKey: "Telefone",
  },
  {
    header: "Cargo",
    accessorKey: "Funcao",
  },
  {
    header: "Status",
    accessorKey: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const isAtivo = status === "ativo";

      return (
        <span
          className={`px-2 py-1 rounded-full text-white text-xs font-medium ${
            isAtivo ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    header: "Permissões",
    accessorKey: "Permissoes",
    cell: ({ row }) => {
      const perms = row.original.permissoes ?? [];

      return (
        <span>
          {perms.length} {perms.length === 1 ? "permissão" : "permissões"}
        </span>
      );
    },
  },
  {
    header: "Ações",
    id: "acoes",
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="text-orange-500 border-orange-500 hover:bg-orange-100"
            onClick={() => onEdit(item)}
          >
            <IconEdit size={16} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="text-red-500 border-red-500 hover:bg-red-100"
            onClick={() => onDelete(item)}
          >
            <IconTrash size={16} />
          </Button>
        </div>
      );
    },
  },
];
