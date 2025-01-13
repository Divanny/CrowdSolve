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
import { CategoryFormDialog } from "../../../components/admin/categories/CategoryFormDialog";
import { useTranslation } from 'react-i18next';

export default function Categories() {
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState("view")
  const { t } = useTranslation();


  const columns = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t('Categories.table.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t('Categories.table.selectRow')}
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
              {t('Categories.table.columns.nombre')}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
      },
    {
      accessorKey: "descripcion",
      header: t('Categories.table.columns.descripcion'),
      /* cell: ({ row }) => `${row.original.nombres} ${row.original.apellidos}`, */
    },
    {
        accessorKey: "icono",
        header: t('Categories.table.columns.icono'),
        cell: ({ row }) => (
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage
                  src={`/placeholder.svg?height=40&width=40`}
                  alt={row.getValue("icono")}
                />
                <AvatarFallback>{row.getValue("icono")}</AvatarFallback>
              </Avatar>
              <span>{row.getValue("icono")}</span>
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
              {t('Categories.table.columns.cantidadDesafios')}
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
      id: "actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">{t('Categories.abrirMenu')}</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{t('Categories.table.columns.actions')}</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCategory(row.original)
                setDialogMode("edit")
                setIsDialogOpen(true)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('Categories.table.actionsMenu.edit')}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCategory(row.original)
                setDialogMode("view")
                setIsDialogOpen(true)
              }}
            >
              <Eye className="mr-2 h-4 w-4" />
              {t('Categories.table.actionsMenu.viewDetails')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    try {
      const [categoriasResponse, relationalObjectsResponse] =
        await Promise.all([
          api.get("/api/Categorias", { requireLoading: false }),
          /* api.get("/api/Participantes/GetRelationalObjects", {
            requireLoading: false,
          }), */
        ]);
        console.log(categoriasResponse.data);
      setData(categoriasResponse.data);
      /* setNivelesEducativos(relationalObjectsResponse.data.nivelesEducativos);
      setEstatusUsuarios(relationalObjectsResponse.data.estatusUsuarios); */
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
    setNivelEducativoFilter("");
    setEstatusUsuarioFilter("");
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
            placeholder={t('Categories.table.searchPlaceholder')}
            value={globalFilter ?? ""}
            onChange={(event) => {
                const value = event.target.value;
                setGlobalFilter(value);
                table.setGlobalFilter(value);
                console.log("Filtro global:", globalFilter);
                console.log("Filas visibles:", table.getRowModel().rows);
            }}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={!globalFilter}
          size="icon"
          tooltip="Limpiar filtros"
        >
          <FilterX className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
            {t('Categories.table.buttons.columns')} <ChevronDown className="ml-2 h-4 w-4" />
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
                  {t('Categories.table.noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t('Categories.table.de')}{" "}
          {table.getFilteredRowModel().rows.length} {t('Categories.table.rowsSelected')}.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t('Categories.table.buttons.previous')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t('Categories.table.buttons.next')}
          </Button>
        </div>
      </div>

      {selectedCategory && (
        <CategoryFormDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={() => {
            setIsDialogOpen(false);
            fetchData();
          }}
          category={selectedCategory}
          mode={dialogMode}
          /* relationalObjects={{ nivelesEducativos, estatusUsuarios }} */
        />
      )}
    </div>
  );
}