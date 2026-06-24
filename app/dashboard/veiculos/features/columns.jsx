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
    onViewDetails,
    onPdf,
    onPrint,

) => [
        {
            accessorKey: "marca",
            id: "marca",
            header: (
                <ColumnFilter
                    label="Marca"
                    value={filters.marca}
                    onChange={(value) => handleFilterChange("marca", value)}
                    placeholder="Filtrar por marca"
                />
            ),
            cell: ({ row }) => row.original.marca || "-",
        },

        {
            accessorKey: "tipoVeiculo",
            id: "tipoVeiculo",
            header: (
                <ColumnFilter
                    label="Tipo"
                    value={filters.tipoVeiculo}
                    onChange={(value) => handleFilterChange("tipoVeiculo", value)}
                    placeholder="Filtrar por tipo"
                />
            ),
            cell: ({ row }) => {

                const tipoVeiculo = row.original.tipoVeiculo;

                if (!tipoVeiculo) return "-";

                const cores = {
                    Carro: "bg-blue-500 text-white",
                    Caminhoneta: "bg-green-500 text-white",
                    Moto: "bg-gray-500 text-white",
                };

                return (
                    <span
                        className={`px-2 py-1 rounded-md text-xs font-semibold ${cores[tipoVeiculo] || "bg-gray-200 text-black"
                            }`}
                    >
                        {tipoVeiculo}
                    </span>
                );
            },
        },

        {
            accessorKey: "modelo",
            id: "modelo",
            header: (
                <ColumnFilter
                    label="Modelo"
                    value={filters.modelo}
                    onChange={(value) => handleFilterChange("modelo", value)}
                    placeholder="Filtrar por modelo"
                />
            ),
            cell: ({ row }) => row.original.modelo || "-",
        },

        {
            accessorKey: "anoVeiculo",
            id: "anoVeiculo",
            header: (
                <ColumnFilter
                    label="Ano"
                    value={filters.anoVeiculo}
                    onChange={(value) => handleFilterChange("anoVeiculo", value)}
                    placeholder="Filtrar por ano"
                />
            ),
            cell: ({ row }) => row.original.anoVeiculo || "-",
        },

        {
            accessorKey: "placa",
            id: "placa",
            header: (
                <ColumnFilter
                    label="Placa"
                    value={filters.placa}
                    onChange={(value) => handleFilterChange("placa", value)}
                    placeholder="Filtrar por placa"
                />
            ),
            cell: ({ row }) => row.original.placa || "-",
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
