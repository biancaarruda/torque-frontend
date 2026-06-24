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

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const getColumns = (
  filters,
  handleFilterChange,
  onEdit,
  onDelete,
  onPdf,
  onPrint,
) => [

    {
      accessorKey: "servicoDesejado",
      id: "servico",
      header: (
              <ColumnFilter
                label="Serviço"
                value={filters.servico}
                onChange={(value) => handleFilterChange("servico", value)}
                placeholder="Filtrar por serviço"
              />
            ),
      cell: (info) => info.getValue() || "-",
    },

    {
      accessorKey: "dataHoraAgendamento",
      id: "data",
      header: (
              <ColumnFilter
                label="Data/Hora"
                value={filters.data}
                onChange={(value) => handleFilterChange("data", value)}
                placeholder="Filtrar por data/hora"
              />
            ),
      cell: (info) => {
        const raw = info.getValue();
        if (!raw) return "-";

        try {
          return format(new Date(raw), "dd/MM/yyyy HH:mm", {
            locale: ptBR,
          });
        } catch {
          return raw;
        }
      },
    },

    {
      accessorKey: "statusAgendamento",
      id: "status",
      header: (
              <ColumnFilter
                label="Status"
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
                placeholder="Filtrar por status"
              />
            ),

      cell: (info) => {
        const value = info.getValue();
        if (!value) return "-";

        const colors = {
          Confirmado: "bg-blue-500 text-white",
          Pendente: "bg-yellow-500 text-black",
          Concluido: "bg-green-500 text-white",
          Cancelado: "bg-red-500 text-white",
        };

        return (
          <span
            className={`px-2 py-1 rounded-md font-semibold ${colors[value] || "bg-gray-200"
              }`}
          >
            {value}
          </span>
        );
      },
    },

    {
      id: "cliente",
      header: (
              <ColumnFilter
                label="Cliente"
                value={filters.cliente}
                onChange={(value) => handleFilterChange("cliente", value)}
                placeholder="Filtrar por cliente"
              />
            ),
      accessorFn: (row) => row.cliente?.nome,
      cell: ({ getValue }) => getValue() || "-",
    },


    {
      id: "veiculo",
      header: (
              <ColumnFilter
                label="Veículo"
                value={filters.veiculo}
                onChange={(value) => handleFilterChange("veiculo", value)}
                placeholder="Filtrar por veículo"
              />
            ),
      accessorFn: (row) =>
        row.veiculo
          ? `${row.veiculo.marca} ${row.veiculo.modelo} - ${row.veiculo.placa}`
          : "-",
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
