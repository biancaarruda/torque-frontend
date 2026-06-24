import ColumnFilter from "@/components/ColumnFilter";
import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { IconDotsVertical } from "@tabler/icons-react";

export const getColumns = (
  filters,
  handleFilterChange,
  onEdit,
  onDelete,
) => [
  {
    accessorKey: "nome",
    id: "nome",
    header: "Nome",
    cell: (info) => info.getValue() || "-",
    size: 200,
  },

  {
    accessorKey: "nomeUsuario",
    header: "Usuário",
    cell: (info) => info.getValue() || "-",
    size: 160,
  },

  {
    accessorKey: "cargo",
    header: "Cargo",
    cell: (info) => {
      const cargo = info.getValue();

      const cargoLabel = {
        Administrador: "Administrador",
        Atendente: "Atendente",
        Gerente: "Gerente",
        Mecanico: "Mecânico",
        Mecânico: "Mecânico",
      };

      return cargoLabel[cargo] || cargo || "-";
    },
    size: 150,
  },

  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2 whitespace-nowrap">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="data-[state=open]:bg-muted"
            >
              <IconDotsVertical />
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => onEdit(row.original)}
            >
              Editar
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600"
              onClick={() => onDelete(row.original)}
            >
              Apagar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    size: 200,
  },
];
