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
  filters,
  handleFilterChange,
  onEdit,
  onDelete,
  onPdf,
  onPrint,
) => [
    {
      accessorKey: "nomePeca",
      id: "nome_peca",
      header: (
        <ColumnFilter
          label="Nome da Peça"
          value={filters.nome_peca}
          onChange={(value) => handleFilterChange("nome_peca", value)}
          placeholder="Filtrar por nome"
        />
      ),
    },
    {
      accessorKey: "codigoReferenciaPeca",
      id: "codigo_referencia_peca",
      header: (
        <ColumnFilter
          label="Código"
          value={filters.codigo_referencia_peca}
          onChange={(value) => handleFilterChange("codigo_referencia_peca", value)}
          placeholder="Filtrar por código"
        />
      ),
    },
    {
      accessorKey: "quantidadeDisponivelPeca",
      id: "quantidade_disponivel_peca",
      header: (
        <ColumnFilter
          label="Quantidade Disponível"
          value={filters.quantidade_disponivel_peca}
          onChange={(value) => handleFilterChange("quantidade_disponivel_peca", value)}
          placeholder="Filtrar por quantidade"
        />
      ),
      cell: (info) => (
        <span className="text-left block">
          {info.getValue()}
        </span>
      ),
    },
    {
      accessorKey: "precoUnitarioPeca",
      id: "preco_unitario_peca",
      header: (
        <ColumnFilter
          label="Preço Unitário"
          value={filters.preco_unitario_peca}
          onChange={(value) => handleFilterChange("preco_unitario_peca", value)}
          placeholder="Filtrar por preço"
        />
      ),
      cell: (info) => {
        const preco = info.getValue();

        return (
          <span className="text-left block">
            {preco?.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </span>
        );
      },
    },
    {
      id: "fornecedor",
      header: (
        <ColumnFilter
          label="Fornecedor"
          value={filters.fornecedor}
          onChange={(value) => handleFilterChange("fornecedor", value)}
          placeholder="Filtrar por fornecedor"
        />
      ),
      accessorFn: (row) => row.fornecedor?.nomeFantasia,
      cell: ({ getValue }) => getValue() || "-",
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
