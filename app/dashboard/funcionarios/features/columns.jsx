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
  onViewDetails,
  onPdf,
  onPrint,
) => [
    {
      accessorKey: "nome",
      id: "nome",
      header: (
        <ColumnFilter
          label="Nome"
          value={filters.nome}
          onChange={(value) => handleFilterChange("nome", value)}
          placeholder="Filtrar por nome"
        />
      ),
      cell: (info) => info.getValue() || "-",
      size: 180,
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
      accessorKey: "contato",
      id: "email",
      header: (
        <ColumnFilter
          label="Email"
          value={filters.email}
          onChange={(value) => handleFilterChange("email", value)}
          placeholder="Filtrar por email"
        />
      ),
      cell: (info) =>
        info.getValue()?.email ||
        info.getValue()?.Email ||
        "-",
      size: 200,
    },

    {
      accessorKey: "contato",
      id: "telefone",
      header: (
        <ColumnFilter
          label="Telefone"
          value={filters.telefone}
          onChange={(value) => handleFilterChange("telefone", value)}
          placeholder="Filtrar por telefone"
        />
      ),
      cell: (info) =>
        info.getValue()?.telefone ||
        info.getValue()?.Telefone ||
        "-",
      size: 140,
    },

    {
      accessorKey: "contato",
      id: "cpf",
      header: (
        <ColumnFilter
          label="CPF"
          value={filters.cpf}
          onChange={(value) => handleFilterChange("cpf", value)}
          placeholder="Filtrar por CPF"
        />
      ),
      cell: (info) =>
        info.getValue()?.cpf ||
        info.getValue()?.Cpf ||
        "-",
      size: 130,
    },

    {
      accessorKey: "endereco",
      id: "rua",
      header: (
        <ColumnFilter
          label="Rua"
          value={filters.rua}
          onChange={(value) => handleFilterChange("rua", value)}
          placeholder="Filtrar por rua"
        />
      ),
      cell: (info) =>
        info.getValue()?.rua ||
        info.getValue()?.Rua ||
        "-",
      size: 180,
    },

    {
      accessorKey: "endereco",
      id: "numero",
      header: (
        <ColumnFilter
          label="Número"
          value={filters.numero}
          onChange={(value) => handleFilterChange("numero", value)}
          placeholder="Filtrar por número"
        />
      ),
      cell: (info) =>
        info.getValue()?.numero ||
        info.getValue()?.Numero ||
        "-",
      size: 90,
    },

    {
      accessorKey: "endereco",
      id: "bairro",
      header: (
        <ColumnFilter
          label="Bairro"
          value={filters.bairro}
          onChange={(value) => handleFilterChange("bairro", value)}
          placeholder="Filtrar por bairro"
        />
      ),
      cell: (info) =>
        info.getValue()?.bairro ||
        info.getValue()?.Bairro ||
        "-",
      size: 150,
    },

    {
      accessorKey: "endereco",
      id: "cidade",
      header: (
        <ColumnFilter
          label="Cidade"
          value={filters.cidade}
          onChange={(value) => handleFilterChange("cidade", value)}
          placeholder="Filtrar por cidade"
        />
      ),
      cell: (info) =>
        info.getValue()?.cidade ||
        info.getValue()?.Cidade ||
        "-",
      size: 150,
    },

    {
      accessorKey: "endereco.estado",
      id: "estado",
      header: (
        <ColumnFilter
          label="Estado"
          value={filters.estado}
          onChange={(value) => handleFilterChange("estado", value)}
          placeholder="Filtrar por estado"
        />
      ),
      cell: ({ row }) => {
        const estado = row.original?.endereco?.estado;

        return typeof estado === "string"
          ? estado.toUpperCase()
          : "-";
      },
      size: 90,
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
                onClick={() => onPdf(row.original)}
              >
                Gerar PDF
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onPrint(row.original)}
              >
                Imprimir
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
