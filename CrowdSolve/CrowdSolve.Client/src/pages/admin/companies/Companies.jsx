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
import { Checkbox } from "@/components/ui/checkbox";
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

export default function Companies() {
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
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Seleccionar todo"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Seleccionar fila"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "nombre",
            header: "Nombre",
            cell: ({ row }) => (
                <div className="flex items-center space-x-2">
                    <Avatar>
                        <AvatarImage
                            src={`/api/Account/GetAvatar/${row.getValue("idUsuario")}`}
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
            accessorKey: "descripcion",
            header: "Descripcion",
        },
        {
            accessorKey: "direccion",
            header: "Direccion",
        },
        {
            accessorKey: "telefono",
            header: "Teléfono",
        },
        {
            accessorKey: "paginaWeb",
            header: "Página Web",
        },
        {
            accessorKey: "tamañoEmpresa",
            header: "Tamaño Empresa",
        },
        {
            accessorKey: "sector",
            header: "Sector",
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
                    Cantidad de Desafíos
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
        },
        {
            accessorKey: "cantidadSoluciones",
            header: ({ column }) => {
                return (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-left font-normal"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                  >
                    Cantidad de Soluciones
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                );
              },
        },     
        {
            accessorKey: "estatusUsuario",
            header: "Estatus",
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
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedCompany(row.original)
                                setDialogMode("edit")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                setSelectedCompany(row.original)
                                setDialogMode("view")
                                setIsDialogOpen(true)
                            }}
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                console.log("Ver desafíos", row.original.idEmpresa)
                            }
                        >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver desafíos
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
            console.log(empresasResponse);
            console.log(relationalObjectsResponse);
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
                        placeholder="Buscar por nombre..."
                        value={globalFilter ?? ""}
                        onChange={(event) => setGlobalFilter(event.target.value)}
                        className="pl-8"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                            Tamaño Empresa
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
                                    placeholder="Buscar..."
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
                                <X className="mr-2 h-4 w-4" /> Limpiar filtro
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
                            Sector
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
                                <X className="mr-2 h-4 w-4" /> Limpiar filtro
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
                    tooltip="Limpiar filtros"
                >
                    <FilterX className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columnas <ChevronDown className="ml-2 h-4 w-4" />
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