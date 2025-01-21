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
  Eye,
  FileX,
  FileCheck,
  UserPen,
  MoreHorizontal,
  X,
  Search,
  FilterX,
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
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { SupportDialog } from "../../../components/admin/Requests/SupportRequestDialog";
import EstatusProcesoEnum from "@/enums/EstatusProcesoEnum";

export default function SupportRequests() {
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [estatusProcesos, setEstatusProcesos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedSupportRequest, setSelectedSupportRequest] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view");
  const [usuarioAdminFilter, setUsuarioAdminFilter] = useState("");
  const [estatusProcesoFilter, setEstatusProcesoFilter] = useState("");
  const [usuarioAdminSearch, setUsuarioAdminSearch] = useState("");
  const [estatusProcesoSearch, setEstatusProcesoSearch] = useState("");


  const columns = [
    {
      accessorKey: "nombreUsuario",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuario Afectado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "titulo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Titulo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "mensaje",
      header: "Mensaje",
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
    },
    {
      accessorKey: "fecha",
      header: "Fecha Soporte",
      cell: ({ row }) => `${new Date(row.original.fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}`,
    },
    {
      accessorKey: "nombres",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombres
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className="w-20 text-center">
            {getValue()}
          </div>
        );
      }
    },
    {
      accessorKey: "apellidos",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Apellidos
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className="w-20 text-center">
            {getValue()}
          </div>
        );
      }
    },
    {
      accessorKey: "correoElectronico",
      header: "Correo Electronico",
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
    },
    {
      accessorKey: "nombreAsignado",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Usuario Asignado
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ getValue }) => {
        return (
          <div className="w-20 text-center">
            {getValue()}
          </div>
        );
      }
    },
    {
      accessorKey: "idEstatusProceso",
      header: "Estatus Solicitud",
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
              onClick={() => {
                console.log(row.original);
                setSelectedSupportRequest(row.original)
                setDialogMode("view")
                setIsDialogOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              Ver Detalle
            </DropdownMenuItem>

            {row.original.idUsuarioAsignado === null && (
              <DropdownMenuItem
                onClick={() => {
                  assignMe(row.original.idSoporte)

                }}
              >
                <UserPen className="mr-2 h-4 w-4" />
                Asignarme Solicitud
              </DropdownMenuItem>
            )}

            {row.original.asignadoAMi === true && row.original.idEstatusProceso != 20
              && row.original.idEstatusProceso != 19 && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSupportRequest(row.original.idSoporte)
                    setDialogMode("closeSupport")
                    setIsDialogOpen(true)
                  }}
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Finalizar Solicitud
                </DropdownMenuItem>
              )}


            {row.original.asignadoAMi === true && row.original.idEstatusProceso != 20
              && row.original.idEstatusProceso != 19 && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedSupportRequest(row.original.idSoporte)
                    setDialogMode("declineSupport")
                    setIsDialogOpen(true)
                  }}
                >
                  <FileX className="mr-2 h-4 w-4" />
                  Descargar Solicitud
                </DropdownMenuItem>
              )}

          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const [supportRequestsResponse, relationalObjectsResponse] =
        await Promise.all([
          api.get("/api/Soportes", { requireLoading: false }),
          api.get("/api/Soportes/GetRelationalObjects", {
            requireLoading: false,
          }),
        ]);


      setData(supportRequestsResponse.data);
      setUsuariosAdmin(relationalObjectsResponse.data.usuariosAdmin);
      setEstatusProcesos(relationalObjectsResponse.data.estatusProcesos);


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

  const assignMe = async (supportId) => {
    try {
      const response = await api.put(`api/Soportes/AsignarMe/${supportId}`, null, {
        headers: {
          'Content-Type': 'application/json',
        },
      });


      // Check if the response was successful
      if (response.data.success) {
        toast.success("Operación exitosa", {
          description: response.data.message,
        });

        fetchData();
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
  }

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
    setUsuarioAdminFilter("");
    setEstatusProcesoFilter("");
    table.setGlobalFilter("");

  };

  const filteredUsuariosAdmin = usuariosAdmin.filter((usuario) =>
    usuario.nombreUsuario.toLowerCase().includes(usuarioAdminSearch.toLowerCase()),


  );

  const filteredEstatusProceso = estatusProcesos.filter((estatus) =>
    estatus.nombre.toLowerCase().includes(estatusProcesoSearch.toLowerCase())
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
            placeholder="Buscar Soporte"
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
              Usuarios Asignados
              {usuarioAdminFilter ? `: ${usuarioAdminFilter}` : ""}
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
                  value={usuarioAdminSearch}
                  onChange={(e) => setUsuarioAdminSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {usuarioAdminFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setUsuarioAdminFilter("");
                  table.getColumn("nombreAsignado")?.setFilterValue(undefined);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Limpiar filtro
              </DropdownMenuItem>
            )}
            {filteredUsuariosAdmin.map((usuario) => (
              <DropdownMenuItem
                key={usuario.idUsuario}
                onSelect={() => {
                  setUsuarioAdminFilter(usuario.nombreUsuario);
                  table.getColumn("nombreAsignado")?.setFilterValue(usuario.nombreUsuario);
                }}
              >
                {usuario.nombreUsuario}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Estatus Solicitud
              {estatusProcesoFilter ? `: ${estatusProcesoFilter}` : ""}
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
                  value={estatusProcesoSearch}
                  onChange={(e) => setEstatusProcesoSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {estatusProcesoFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setEstatusProcesoFilter("");
                  table.getColumn("idEstatusProceso")?.setFilterValue(undefined);
                }}
              >
                <X className="mr-2 h-4 w-4" /> Limpiar filtro
              </DropdownMenuItem>
            )}
            {filteredEstatusProceso.map((estatus) => (
              <DropdownMenuItem
                key={estatus.idEstatusProceso}
                onSelect={() => {
                  setEstatusProcesoFilter(estatus.idEstatusProceso);
                  table.getColumn("idEstatusProceso")?.setFilterValue(estatus.idEstatusProceso);
                }}
              >
                {estatus.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>


        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!globalFilter && !usuarioAdminFilter && !estatusProcesoFilter}
          size="icon"
          tooltip="Limpiar filtros"
        >
          <FilterX className="h-4 w-4" />
        </Button>

        <div className="flex items-center border rounded-md p-2 shadow-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FFD3A6] mr-2"></div>
              <span className="text-sm font-bold">Recientes</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#FFC7B0] mr-2"></div>
              <span className="text-sm font-bold">En Proceso</span>
            </div>
          </div>
        </div>

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
                  className={
                    row.original.idEstatusProceso === EstatusProcesoEnum.Soporte_Enviada
                      ? "bg-muted border-[1px]"
                      : row.original.idEstatusProceso === EstatusProcesoEnum.Soporte_En_progreso ? "bg-muted/50 border-[1px]" : ""
                  }
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

      {selectedSupportRequest && (
        <SupportDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={() => {
            setIsDialogOpen(false);
            fetchData();
          }}
          support={selectedSupportRequest}
          mode={dialogMode}
        />
      )}
    </div>
  );
}