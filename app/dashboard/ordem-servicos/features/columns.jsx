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

import { formatDate } from "@/lib/date";


const formatMoney = (value) =>
  value != null
    ? Number(value).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    })
    : "-";

export const getColumns = (
  filters = {},
  handleFilterChange,
  onEdit,
  onDelete,
  onPdf,
  onPrint,
) => [

    {
      accessorKey: "nomeServico",
      id: "nome_servico",
      header: (
        <ColumnFilter
          label="Serviço"
          value={filters.nome_servico}
          onChange={(value) => handleFilterChange("nome_servico", value)}
          placeholder="Filtrar por serviço"
        />
      ),
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
      cell: ({ getValue }) => getValue() ?? "-",
    },

    {
      id: "funcionario",
      header: (
        <ColumnFilter
          label="Funcionário"
          value={filters.funcionario}
          onChange={(value) => handleFilterChange("funcionario", value)}
          placeholder="Filtrar por funcionário"
        />
      ),
      accessorFn: (row) => row.funcionario?.nome,
      cell: ({ getValue }) => getValue() ?? "-",
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
      accessorKey: "dataAbertura",
      id: "data_abertura_ordem",
      header: (
        <ColumnFilter
          label="Data de abertura"
          value={filters.data_abertura_ordem}
          onChange={(value) => handleFilterChange("data_abertura_ordem", value)}
          placeholder="Filtrar por abertura"
        />
      ),
      cell: (info) => formatDate(info.getValue()),
    },
    {
      accessorKey: "dataPrevisaoConclusao",
      id: "data_previsao_conclusao_ordem",
      header: (
        <ColumnFilter
          label="Previsão de Conclusão"
          value={filters.data_previsao_conclusao_ordem}
          onChange={(value) => handleFilterChange("data_previsao_conclusao_ordem", value)}
          placeholder="Filtrar por previsão"
        />
      ),
      cell: (info) => formatDate(info.getValue()),
    },

    {
      accessorKey: "statusOrdem",
      id: "status_ordem",
      header: (
        <ColumnFilter
          label="Status"
          value={filters.status_ordem}
          onChange={(value) => handleFilterChange("status_ordem", value)}
          placeholder="Filtrar por status"
        />
      ),
      cell: (info) => {
        const status = info.getValue();
        if (!status) return "-";

        const colors = {
          Confirmado: "bg-blue-500 text-white",
          Pendente: "bg-yellow-500 text-black",
          Concluido: "bg-green-500 text-white",
          Cancelado: "bg-red-500 text-white",
        };

        return (
          <span
            className={`px-2 py-1 rounded-md font-semibold ${colors[status] ?? "bg-gray-200"
              }`}
          >
            {status}
          </span>
        );
      },
    },

    {
      accessorKey: "valorTotalOrdem",
      id: "valor_total_ordem",
      header: (
        <ColumnFilter
          label="Total"
          value={filters.valor_total_ordem}
          onChange={(value) => handleFilterChange("valor_total_ordem", value)}
          placeholder="Filtrar por total"
        />
      ),
      cell: (info) => formatMoney(info.getValue()),
    },

    {
      accessorKey: "observacao",
      id: "observacao",
      header: (
        <ColumnFilter
          label="Observação"
          value={filters.observacao}
          onChange={(value) => handleFilterChange("observacao", value)}
          placeholder="Filtrar por observação"
        />
      ),
      cell: (info) => info.getValue() ?? "-",
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
