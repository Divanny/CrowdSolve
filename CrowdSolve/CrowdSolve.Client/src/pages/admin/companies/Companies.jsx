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
    FileText,
    MoreHorizontal,
    X,
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
import { CompanyFormDialog } from "../../../components/admin/companies/CompanyFormDialog";
import { useTranslation } from 'react-i18next';

export default function Companies() {
    const { t } = useTranslation();
    const { api } = useAxios();
    const [data, setData] = useState([]);
    const [tamanosEmpresas, setTamanosEmpresas] = useState([]);
    const [sectores, setSectores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sorting, setSorting] = useState([]);
    const [columnFilters, setColumnFilters] = useState([]);
    const [columnVisibility, setColumnVisibility] = useState({});
    const [rowSelection, setRowSelection] = useState({});
    const [globalFilter, setGlobalFilter] = useState("");
    const [tamanosEmpresaFilter, setTamanosEmpresaFilter] = useState("");
    const [sectoresFilter, setSectoresFilter] = useState("");
    const [tamanosEmpresaSearch, setTamanosEmpresaSearch] = useState("");
    const [sectoresSearch, setSectoresSearch] = useState("");
    const [selectedCompany, setSelectedCompany] = useState(null)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [dialogMode, setDialogMode] = useState("view")

    const columns = [
        {
            accessorKey: "nombre",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage
                            src={`/api/Account/GetAvatar/${row.original.idUsuario}`}
                            alt={row.getValue("nombre")}
                        />
                        <AvatarFallback>
                            {row.getValue("nombre").slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <span>{row.getValue("nombre")}</span>
                </div>
            ),
        },
        {
            accessorKey: "telefono",
            header: t('CompaniesPage.telefono'),
        },
        {
            accessorKey: "paginaWeb",
            header: t('CompaniesPage.paginaWeb'),
        },
        {
            accessorKey: "tamañoEmpresa",
            header: t('CompaniesPage.tamanoEmpresa'),
        },
        {
            accessorKey: "sector",
            header: t('CompaniesPage.sector'),
        },
        {
            accessorKey: "cantidadDesafios",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    {t('CompaniesPage.cantidadDesafios')}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
        },
        {
            accessorKey: "estatusUsuario",
            header: t('CompaniesPage.estatusUsuario'),
            cell: ({ row }) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${row.getValue("estatusUsuario") === "Activo"
                        ? "bg-green-100 text-green-800"
                        : row.getValue("estatusUsuario") === "Inactivo"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                >
                    {row.getValue("estatusUsuario")}
                </span>
            ),
        },
        {
            id: "actions",
            cell: ({ row }) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t('CompaniesPage.abrirMenu')}</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('CompaniesPage.acciones')}</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedCompany(row.original)
                                setDialogMode("edit")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('CompaniesPage.editar')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedCompany(row.original)
                                setDialogMode("view")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('CompaniesPage.verDetalles')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                console.log("Ver desafíos", row.original.idEmpresa)
                            }
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            {t('CompaniesPage.verDesafios')}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    const fetchData = async () => {
        try {
            const [empresasResponse, relationalObjectsResponse] =
                await Promise.all([
                    api.get("/api/Empresas", { requireLoading: false }),
                    api.get("/api/Empresas/GetRelationalObjects", {
                        requireLoading: false,
                    }),
                ]);
            setData(empresasResponse.data);
            setTamanosEmpresas(relationalObjectsResponse.data.tamañosEmpresa);
            setSectores(relationalObjectsResponse.data.sectores);
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
        const searchableColumns = "nombre";
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
        globalFilterFn,
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
        setTamanosEmpresaFilter("");
        setSectoresFilter("");
        table.setGlobalFilter("");
    };

    const filteredTamanosEmpresas = tamanosEmpresas.filter((tamano) =>
        tamano.nombre.toLowerCase().includes(tamanosEmpresaSearch.toLowerCase())
    );

    const filteredSectores = sectores.filter((sector) =>
        sector.nombre.toLowerCase().includes(sectoresSearch.toLowerCase())
    );

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
                        placeholder={t('CompaniesPage.buscarPorNombre')}
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        {t('CompaniesPage.tamanoEmpresaFiltro')}
                            {tamanosEmpresaFilter ? `: ${tamanosEmpresaFilter}` : ""}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <div className="flex items-center px-2 py-1.5">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder={t('CompaniesPage.buscar')}
                                    value={tamanosEmpresaSearch}
                                    onChange={(e) => setTamanosEmpresaSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        {tamanosEmpresaFilter && (
                            <DropdownMenuItem
                                onSelect={() => {
                                    setTamanosEmpresaFilter("");
                                    table.getColumn("tamañoEmpresa")?.setFilterValue(undefined);
                                }}
                            >
                                <X className="mr-2 h-4 w-4" /> {t('CompaniesPage.limpiarFiltro')}
                            </DropdownMenuItem>
                        )}
                        {filteredTamanosEmpresas.map((tamano) => (
                            <DropdownMenuItem
                                key={tamano.idTamañoEmpresa}
                                onSelect={() => {
                                    setTamanosEmpresaFilter(tamano.nombre);
                                    table.getColumn("tamañoEmpresa")?.setFilterValue(tamano.idTamañoEmpresa);
                                }}
                            >
                                {tamano.nombre}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                        {t('CompaniesPage.sectorFiltro')}
                            {sectoresFilter ? `: ${sectoresFilter}` : ""}
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <div className="flex items-center px-2 py-1.5">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="Buscar..."
                                    value={sectoresSearch}
                                    onChange={(e) => setSectoresSearch(e.target.value)}
                                    className="pl-8"
                                />
                            </div>
                        </div>
                        {sectoresFilter && (
                            <DropdownMenuItem
                                onSelect={() => {
                                    setSectoresFilter("");
                                    table.getColumn("sector")?.setFilterValue(undefined);
                                }}
                            >
                                <X className="mr-2 h-4 w-4" /> {t('CompaniesPage.limpiarFiltro')}
                            </DropdownMenuItem>
                        )}
                        {filteredSectores.map((sector) => (
                            <DropdownMenuItem
                                key={sector.idSector}
                                onSelect={() => {
                                    setSectoresFilter(sector.nombre);
                                    table.getColumn("sector")?.setFilterValue(sector.idSector);
                                }}
                            >
                                {sector.nombre}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    variant="outline"
                    onClick={clearFilters}
                    disabled={!globalFilter && !tamanosEmpresaFilter && !sectoresFilter}
                    size="icon"
                    tooltip={t('CompaniesPage.limpiarFiltros')}
                >
                    <FilterX className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                        {t('CompaniesPage.columnaBoton')} <ChevronDown className="ml-2 h-4 w-4" />
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
                                    {t('CompaniesPage.noResultsFound')}
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
                        {t('CompaniesPage.previous')}
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        {t('CompaniesPage.next')}
                    </Button>
                </div>
            </div>

            {selectedCompany && (
                <CompanyFormDialog
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSaved={() => {
                        setIsDialogOpen(false);
                        fetchData();
                    }}
                    company={selectedCompany}
                    mode={dialogMode}
                    relationalObjects={{ tamanosEmpresas, sectores }}
                />
            )}
        </div>
    );
}