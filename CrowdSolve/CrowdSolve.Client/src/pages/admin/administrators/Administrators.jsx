"use client";

import { useEffect, useState } from "react";
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ArrowUpDown,
    ChevronDown,
    Edit,
    Eye,
    MoreHorizontal,
    Search,
    FilterX
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAxios from "@/hooks/use-axios";
import { Skeleton } from "@/components/ui/skeleton";
import { AdministratorFormDialog } from "../../../components/admin/administrators/AdministratorFormDialog";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";

export default function Companies() {
    const { t } = useTranslation();
    const { api } = useAxios();
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedAdmin, setSelectedAdmin] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState("view")


    const columns = [
        {
            accessorKey: "nombreUsuario",
            header: t('Administrators.columns.nombreUsuario'),
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage
                            src={`/api/Account/GetAvatar/${row.original.idUsuario}`}
                            alt={row.getValue("nombreUsuario")}
                        />
                        <AvatarFallback>
                            {row.getValue("nombreUsuario").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span>{row.getValue("nombreUsuario")}</span>
                </div>
            ),
        },
        {
            accessorKey: "correoElectronico",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    {t('Administrators.columns.correoElectronico.header')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
            },
        },
        {
            accessorKey: "nombreCompleto",
            header: () => t('Participants.nombre_completo'),
            cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`,
          },
          {
            accessorKey: "telefono",
            header: () => t('Participants.telefono'),
          },
        {
            accessorKey: "fechaRegistro",
            header: t('Administrators.columns.fechaRegistro'),
            cell: ({ row }) =>
              new Date(row.getValue("fechaRegistro")).toLocaleDateString(),
        },
        {
            accessorKey: "estatusUsuario",
            header: t('Administrators.columns.nombreEstatusUsuario.status'),
            cell: ({ row }) => (
                <Badge
                  variant={`${row.getValue("estatusUsuario") === 'Activo' || row.getValue("estatusUsuario") === 'Asset'
                    ? "success"
                    : row.getValue("estatusUsuario") === 'Empresa rechazada' || row.getValue("estatusUsuario") === 'Company rejected'
                      ? "destructive"
                      : "warning"
                    }`}
                >
                  {row.getValue("estatusUsuario")}
                </Badge>
              ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('Administrators.abrirMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('Administrators.columns.actions.menu')}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedAdmin(row.original)
                                setDialogMode("edit")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('Administrators.columns.actions.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedAdmin(row.original)
                                setDialogMode("view")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('Administrators.columns.actions.viewDetails')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const usuariosResponse =
                await Promise.all([
                    api.get("/api/Usuarios/GetAdministrators", { requireLoading: false })
                    
                ]);
            const administrators = usuariosResponse[0].data
            setData(administrators);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const globalFilterFn = (row, columnId, filterValue) => {
        const searchableColumns = ["nombreUsuario", "correoElectronico"];
        if (searchableColumns.includes(columnId)) {
            const value = row.getValue(columnId);
            return value && String(value).toLowerCase().includes(String(filterValue).toLowerCase());
        }
        return true;
    };

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = row.getValue(columnId);
            return value != null
              ? String(value)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
              : false;
          },
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
            globalFilter,
        },
    });

    const clearFilters = () => {
        setGlobalFilter("");
        setColumnFilters([]);
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
                        placeholder={t('Administrators.placeholders.search')}
                        value={globalFilter ?? ""}
                        onChange={(event) => {
                            const value = event.target.value;
                            setGlobalFilter(value);
                            table.setGlobalFilter(value);
                          }}
                        className="pl-8"
                    />
                </div>
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!globalFilter}
                    size="icon"
                    tooltip={t('Administrators.buttons.clearFilters')}
                >
                    <FilterX className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                        {t('Administrators.buttons.columns')} <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                );
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    {t('Administrators.placeholders.noResults')}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        {t('Administrators.buttons.previousPage')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                         {t('Administrators.buttons.nextPage')}
                    </Button>
                </div>
            </div>

            {selectedAdmin && (
                <AdministratorFormDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSaved={() => {
                        setIsDialogOpen(false);
                        fetchData();
                    }}
                    admin={selectedAdmin}
                    mode={dialogMode}
                />
            )}
        </div>
    );
}