"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAxios from "@/hooks/use-axios";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Eye, MoreHorizontal, Search, FilterX, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminChallenges() {
  const { api } = useAxios();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [relationalObjects, setRelationalObjects] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);

  const columns = [
    {
      accessorKey: "titulo",
      header: "Título",
      cell: ({ row }) => row.getValue("titulo"),
    },
    {
      accessorKey: "empresa",
      header: "Empresa",
      cell: ({ row }) => {
        const idUsuarioEmpresa = row.original.idUsuarioEmpresa;
        return (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={`/api/Account/GetAvatar/${idUsuarioEmpresa}`} />
              <AvatarFallback>{row.getValue("empresa")}</AvatarFallback>
            </Avatar>
            {row.getValue("empresa")}
          </div>
        );
      },
    },
    {
      accessorKey: "estatusDesafio",
      header: "Estatus",
      cell: ({ row }) => {
        return (
          <Badge variant={row.original.severidadEstatusDesafio}>
            <div className="flex items-center space-x-1 w-auto">
              <Icon name={row.original.iconoEstatusDesafio} size={16} />
              <span>{row.getValue("estatusDesafio")}</span>
            </div>
          </Badge>
        );
      },
    },
    {
      accessorKey: "fechaRegistro",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Registro
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue("fechaRegistro")).toLocaleDateString(),
    },
    {
      accessorKey: "fechaInicio",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Inicio
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue("fechaInicio")).toLocaleDateString(),
    },
    {
      accessorKey: "fechaLimite",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="w-full justify-start text-left font-normal"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Fecha Límite
          {column.getIsSorted() === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
          ) : column.getIsSorted() === "desc" ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUpDown className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => new Date(row.getValue("fechaLimite")).toLocaleDateString(),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Abrir menú</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigate(`/admin/challenge/${row.original.idDesafio}`)}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      setIsLoading(true);

      const [challengesResponse, relationalObjectsResponse] = await Promise.all([
        api.get("/api/Desafios", { requireLoading: false }),
        api.get("/api/Desafios/GetRelationalObjects", {
          requireLoading: false,
          params: { allEstatuses: true },
        }),
      ]);

      setData(challengesResponse.data);
      setRelationalObjects(relationalObjectsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
  });

  const clearFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
    setStatusFilter("");
    table.setGlobalFilter("");
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <Skeleton className="h-10 w-[250px]" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-4">
        <div className="relative w-full sm:max-w-lg">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por título de Desafío o Empresa"
            value={globalFilter ?? ""}
            onChange={(event) => {
              const value = event.target.value;
              setGlobalFilter(value);
              table.setGlobalFilter(value);
            }}
            className="pl-8"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => {
            setStatusFilter(value);
            table.setColumnFilters([{ id: "estatusDesafio", value }]);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estatus" />
          </SelectTrigger>
          <SelectContent>
            {relationalObjects.estatusDesafios?.map((status) => (
              <SelectItem key={status.idEstatusProceso} value={status.nombre}>
                <Badge variant={status.severidad}>
                  <div className="flex items-center space-x-1 w-auto">
                    <Icon name={status.claseIcono} size={16} />
                    <span>{status.nombre}</span>
                  </div>
                </Badge>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!globalFilter && !statusFilter}
          size="icon"
          tooltip="Limpiar filtros"
        >
          <FilterX className="h-4 w-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No se encontraron resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} fila(s) seleccionada(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
