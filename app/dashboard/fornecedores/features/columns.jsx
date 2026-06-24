"use client";

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
  filters = {},
  handleFilterChange,
  onEdit,
  onDelete,
  onViewDetails,
  onPrint,
  onPdf,
) => [
    {
      accessorKey: "razaoSocial",
      id: "razao_social",
      header: (
        <ColumnFilter
          label="Razão Social"
          value={filters.razao_social}
          onChange={(value) => handleFilterChange("razao_social", value)}
          placeholder="Filtrar por razão social"
        />
      ),
      size: 180,
    },

    {
      accessorKey: "nomeFantasia",
      id: "nome_fantasia",
      header: (
        <ColumnFilter
          label="Nome Fantasia"
          value={filters.nome_fantasia}
          onChange={(value) => handleFilterChange("nome_fantasia", value)}
          placeholder="Filtrar por nome fantasia"
        />
      ),
      size: 90,
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
      accessorKey: "contato",
      id: "cnpj",
      header: (
        <ColumnFilter
          label="CNPJ"
          value={filters.cnpj}
          onChange={(value) => handleFilterChange("cnpj", value)}
          placeholder="Filtrar por CNPJ"
        />
      ),
      cell: (info) =>
        info.getValue()?.cnpj ||
        info.getValue()?.Cnpj ||
        "-",
      size: 120,
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
      accessorKey: "endereco",
      id: "cep",
      header: "CEP",
      header: (
        <ColumnFilter
          label="CEP"
          value={filters.cep}
          onChange={(value) => handleFilterChange("cep", value)}
          placeholder="Filtrar por CEP"
        />
      ),
      cell: (info) =>
        info.getValue()?.cep ||
        info.getValue()?.Cep ||
        "-",
      size: 150,
    },

    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex gap-2 whitespace-nowrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(row.original)}
          >
            Ver detalhes
          </Button>

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
              onClick={() => onPdf(row.original)}>
              Gerar PDF
              
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
              onClick={() => onPrint(row.original)}>
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
