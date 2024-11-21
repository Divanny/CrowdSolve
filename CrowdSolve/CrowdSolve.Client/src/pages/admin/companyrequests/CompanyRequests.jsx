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
  CircleCheckBig,
  ChevronDown,
  CircleSlash2,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  X,
  Search,
  FilterX,
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
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { CategoryFormDialog } from "../../../components/admin/categories/CategoryFormDialog";

export default function CompanyRequests() {
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [tamañosEmpresa, setTamañosEmpresa] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCompanyRequest, setSelectedCompanyRequest] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view");
  const [sectorFilter, setSectorFilter] = useState("");
  const [tamañoEmpresaFilter, setTamañoEmpresaFilter] = useState("");
  const [sectorSearch, setSectorSearch] = useState("");
  const [tamañoEmpresaSearch, setTamañoEmpresaSearch] = useState("");


  const validarEmpresa = async (id) => {
    try {
      const response = await api.put(`api/Empresas/Aprobar/${id}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(id);
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success("Operación exitosa", {
        description: response.data.message,
      });
    } else {
      toast.warning("Operación fallida", {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error('Hubo un error al realizar la operación');
      console.error('Error:', error);
    }
  };

  const rechazarEmpresa = async (id) => {
    try {
      const response = await api.put(`api/Empresas/Rechazar/${id}`,null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(id);
  
       // Check if the response was successful
    if (response.data.success) {
      toast.success("Operación exitosa", {
        description: response.data.message,
      });
    } else {
      toast.warning("Operación fallida", {
        description: response.data.message,
      });
      console.log(response.data);
    }
    } catch (error) {
      toast.error('Hubo un error al realizar la operación');
      console.error('Error:', error);
    }
  };
  

  

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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="w-full justify-start text-left font-normal"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Nombre Empresa
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
    {
      accessorKey: "descripcion",
      header: "Descripcion",
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
      cell:({getValue})=>{
        return(
        <div className="w-80">
            {getValue()}
          </div>
        );
    }
    },
    {
      accessorKey: "telefono",
      header: "Telefono",
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
    },
    {
      accessorKey: "paginaWeb",
      header: "Pagina Web",
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
    },
    {
      accessorKey: "tamañoEmpresa",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tamaño
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell:({getValue})=>{
        return(
        <div className="w-20 text-center">
            {getValue()}
          </div>
        );
    }
    },
    {
      accessorKey: "sector",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Sector
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell:({getValue})=>{
        return(
        <div className="w-20 text-center">
            {getValue()}
          </div>
        );
    }
    },
    {
      accessorKey: "direccion",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dirección
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
        accessorKey: "avatar",
        header: "Avatar",
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={row.getValue("avatar")}
                />
                <AvatarFallback>{row.getValue("avatar")}</AvatarFallback>
              </Avatar>
              <span>{row.getValue("avatar")}</span>
            </div>
          ),
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
              Cant. Desafios
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell:({getValue})=>{
            return(
            <div className="text-center">
                {getValue()}
              </div>
            );
        }
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
              Cant. Soluciones
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell:({getValue})=>{
            return(
            <div  style={{ width: "80px", textAlign: "center" }}>
                {getValue()}
              </div>
            );
        }
      },
      {
        accessorKey: "estatusUsuario",
        header: "Estatus Empresa",
        /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
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
              onClick={() => validarEmpresa(row.original.idEmpresa)}
            >
              <CircleCheckBig className="mr-2 h-4 w-4" />
              Validar Empresa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => rechazarEmpresa(row.original.idEmpresa)}
            >
              <CircleSlash2 className="mr-2 h-4 w-4" />
              Rechazar Empresa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const [companyRequestsResponse, relationalObjectsResponse] =
        await Promise.all([
          api.get("/api/Empresas/GetEmpresasPendientesValidar", { requireLoading: false }),
          api.get("/api/Empresas/GetRelationalObjects", {
            requireLoading: false,
          }),
        ]);

      setData(companyRequestsResponse.data);
      setSectores(relationalObjectsResponse.data.sectores);
      setTamañosEmpresa(relationalObjectsResponse.data.tamañosEmpresa);

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
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
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
    setSectorFilter("");
    setTamañoEmpresaFilter("");
    table.setGlobalFilter("");
  };

  const filteredSectores = sectores.filter((sector) =>
    sector.nombre.toLowerCase().includes(sectorSearch.toLowerCase())
  );

  const filteredTamañoEmpresa = tamañosEmpresa.filter((tamaño) =>
    tamaño.nombre.toLowerCase().includes(tamañoEmpresaSearch.toLowerCase())
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
            placeholder="Buscar por nombre de Empresa"
            value={globalFilter ?? ""}
            onChange={(event) => {
                const value = event.target.value;
                setGlobalFilter(value);
                table.setGlobalFilter(value);
            }}
            className="pl-8"
          />
        </div>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sector
              {sectorFilter ? `: ${sectorFilter}` : ""}
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
                  value={sectorSearch}
                  onChange={(e) => setSectorSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {sectorFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setSectorFilter("");
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
                  setSectorFilter(sector.nombre);
                  table.getColumn("sector")?.setFilterValue(sector.nombre);
                }}
              >
                {sector.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Tamaño Empresa
              {tamañoEmpresaFilter ? `: ${tamañoEmpresaFilter}` : ""}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex items-center px-2 py-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar tamaño..."
                  value={tamañoEmpresaSearch}
                  onChange={(e) => setTamañoEmpresaSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {tamañoEmpresaFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setTamañoEmpresaFilter("");
                  table.getColumn("tamañoEmpresa")?.setFilterValue(undefined);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Limpiar filtro
              </DropdownMenuItem>
            )}
            {filteredTamañoEmpresa.map((tamaño) => (
              <DropdownMenuItem
                key={tamaño.idTamañoEmpresa}
                onSelect={() => {
                  setTamañoEmpresaFilter(tamaño.nombre);
                  table.getColumn("tamañoEmpresa")?.setFilterValue(tamaño.nombre);
                }}
              >
                {tamaño.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        

        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!globalFilter && !sectorFilter && !tamañoEmpresaFilter}
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

      {selectedCompanyRequest && (
        <CategoryFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={() => {
            setIsDialogOpen(false);
            fetchData();
          }}
          category={selectedCompanyRequest}
          mode={dialogMode}
          /* relationalObjects={{ nivelesEducativos, estatusUsuarios }} */
        />
      )}
    </div>
  );
}