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
import { ParticipantFormDialog } from "@/components/admin/participants/ParticipantFormDialog";
import { ParticipantSolutionsDialog } from "@/components/admin/participants/ParticipantSolutionsDialog";
import { useTranslation } from 'react-i18next';
import { Badge } from "@/components/ui/badge";

export default function Participants() {
  const { t } = useTranslation();
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [nivelesEducativos, setNivelesEducativos] = useState([]);
  const [estatusUsuarios, setEstatusUsuarios] = useState([]);
  const [perfilesUsuarios, setPerfilesUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [nivelEducativoFilter, setNivelEducativoFilter] = useState("");
  const [estatusUsuarioFilter, setEstatusUsuarioFilter] = useState("");
  const [nivelEducativoSearch, setNivelEducativoSearch] = useState("");
  const [estatusUsuarioSearch, setEstatusUsuarioSearch] = useState("");
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  const [isSolutionsDialogOpen, setIsSolutionsDialogOpen] = useState(false);

  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('Participants.select_all')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('Participants.select_row')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "nombreUsuario",
      header: () => t('Participants.nombre_usuario'),
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
      header: () => t('Participants.correo_electronico')
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
      accessorKey: "fechaNacimiento",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('Participants.fecha_nacimiento')}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("fechaNacimiento")).toLocaleDateString(),
    },
    {
      accessorKey: "nivelEducativo",
      header: t('Participants.nivel_educativo'),
    },
    {
      accessorKey: "fechaRegistro",
      header: t('Participants.fecha_registro'),
      cell: ({ row }) =>
        new Date(row.getValue("fechaRegistro")).toLocaleDateString(),
    },
    {
      accessorKey: "estatusUsuario",
      header: t('Participants.estatus_usuario'),
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
              <span className="sr-only">{t('Participants.openMenu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('Participants.acciones')}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original)
                setDialogMode("edit")
                setIsDialogOpen(true)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('Participants.editar')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original)
                setDialogMode("view")
                setIsDialogOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              {t('Participants.ver_detalles')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedParticipant(row.original);
                setIsSolutionsDialogOpen(true);
              }}
            >
              <FileText className="mr-2 h-4 w-4" />
              {t('Participants.ver_soluciones')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const [participantesResponse, relationalObjectsResponse] =
        await Promise.all([
          api.get("/api/Participantes", { requireLoading: false }),
          api.get("/api/Participantes/GetRelationalObjects", {
            requireLoading: false,
          }),

        ]);
      setData(participantesResponse.data);
      setNivelesEducativos(relationalObjectsResponse.data.nivelesEducativos);
      setEstatusUsuarios(relationalObjectsResponse.data.estatusUsuarios);
      setPerfilesUsuarios(relationalObjectsResponse.data.perfilesUsuarios);

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
    setNivelEducativoFilter("");
    setEstatusUsuarioFilter("");
    table.setGlobalFilter("");
  };

  const filteredNivelesEducativos = nivelesEducativos.filter((nivel) =>
    nivel.nombre.toLowerCase().includes(nivelEducativoSearch.toLowerCase())
  );

  const filteredEstatusUsuarios = estatusUsuarios.filter((estatus) =>
    estatus.nombre.toLowerCase().includes(estatusUsuarioSearch.toLowerCase())
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
            placeholder={t('Participants.buscar')}
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
              {t('Participants.nivel_educativo')}
              {nivelEducativoFilter ? `: ${nivelEducativoFilter}` : ""}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex items-center px-2 py-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('Participants.buscarPH')}
                  value={nivelEducativoSearch}
                  onChange={(e) => setNivelEducativoSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {nivelEducativoFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setNivelEducativoFilter("");
                  table.getColumn("nivelEducativo")?.setFilterValue(undefined);
                }}
              >
                <X className="mr-2 h-4 w-4" /> {t('Participants.limpiar_filtro')}
              </DropdownMenuItem>
            )}
            {filteredNivelesEducativos.map((nivel) => (
              <DropdownMenuItem
                key={nivel.idNivelEducativo}
                onSelect={() => {
                  setNivelEducativoFilter(nivel.nombre);
                  table.getColumn("nivelEducativo")?.setFilterValue(nivel.nombre);
                }}
              >
                {nivel.nombre}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {t('Participants.filtro_estatus_usuario')}
              {estatusUsuarioFilter ? `: ${estatusUsuarioFilter}` : ""}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <div className="flex items-center px-2 py-1.5">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={t('Participants.searchStatus')}
                  value={estatusUsuarioSearch}
                  onChange={(e) => setEstatusUsuarioSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            {estatusUsuarioFilter && (
              <DropdownMenuItem
                onSelect={() => {
                  setEstatusUsuarioFilter("");
                  table.getColumn("estatusUsuario")?.setFilterValue(undefined);
                }}
              >
                <X className="mr-2 h-4 w-4" /> {t('Participants.limpiar_filtro')}
              </DropdownMenuItem>
            )}
            {filteredEstatusUsuarios.map((estatus) => (
              <DropdownMenuItem
                key={estatus.idEstatusUsuario}
                onSelect={() => {
                  setEstatusUsuarioFilter(estatus.nombre);
                  table.getColumn("estatusUsuario")?.setFilterValue(estatus.nombre);
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
          disabled={!globalFilter && !nivelEducativoFilter && !estatusUsuarioFilter}
          size="icon"
          tooltip="Limpiar filtros"
        >
          <FilterX className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t('Participants.columna')} <ChevronDown className="ml-2 h-4 w-4" />
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
                  {t('Participants.no_resultados')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('Participants.of')}{" "}
          {table.getFilteredRowModel().rows.length} {t('Participants.row')}(s) {t('Participants.selected')}(s).
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('Participants.PrevButton')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('Participants.NextButton')}
          </Button>
        </div>
      </div>

      {selectedParticipant && (
        <ParticipantFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={() => {
            setIsDialogOpen(false);
            fetchData();
          }}
          participant={selectedParticipant}
          mode={dialogMode}
          relationalObjects={{ nivelesEducativos, estatusUsuarios, perfilesUsuarios }}
        />
      )}
      {selectedParticipant && (
        <ParticipantSolutionsDialog
          isOpen={isSolutionsDialogOpen}
          onClose={() => setIsSolutionsDialogOpen(false)}
          participant={selectedParticipant}
        />
      )}
    </div>
  );
}