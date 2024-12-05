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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAxios from "@/hooks/use-axios";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import ChallengeRequestDetail from "@/components/admin/challenges-requests/ChallengeRequestDetail";
import createEditorToConvertToHtml from "@/hooks/createEditorToConvertToHtml";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { setLoading } from "@/redux/slices/loadingSlice";
import { ValidateChallengeDialog } from "@/components/admin/challenges-requests/ValidateChallengeDialog";

const editor = createEditorToConvertToHtml();

export default function CompanyRequests() {
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedChallengeRequest, setSelectedChallengeRequest] =
    useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState("view");
  const [htmlContent, setHtmlContent] = useState("");
  const [relationalObjects, setRelationalObjects] = useState({});

  const convertToHtml = () => {
    const html = editor.api.htmlReact.serialize({
      nodes: editor.children,
      convertNewLinesToHtmlBr: true,
      dndWrapper: (props) => <DndProvider backend={HTML5Backend} {...props} />,
    });
    setHtmlContent(html);
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
      accessorKey: "titulo",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Título
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "empresa",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Empresa
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "fechaInicio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Inicio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("fechaInicio")).toLocaleDateString(),
    },
    {
      accessorKey: "fechaLimite",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-normal"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Fecha Límite
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) =>
        new Date(row.getValue("fechaLimite")).toLocaleDateString(),
    },
    {
      id: "detail",
      cell: ({ row }) => (
        <Dialog>
         {console.log(row.original)}
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <Eye className="mr-2 h-4 w-4" />
              Ver detalle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[90vw] sm:max-w-3xl max-h-[80vh] overflow-y-auto">
            <div className="mt-4">
              <ChallengeRequestDetail
                desafio={row.original}
                htmlContent={htmlContent}
                getCategoryName={getCategoryName}
              />
            </div>
          </DialogContent>
        </Dialog>
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
                setSelectedChallengeRequest(row.original.idDesafio);
                setDialogMode("validate");
                setIsDialogOpen(true);
              }}
            >
              <CircleCheckBig className="mr-2 h-4 w-4" />
              Validar Desafío
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedChallengeRequest(row.original.idDesafio);
                setDialogMode("decline");
                setIsDialogOpen(true);
              }}
            >
              <CircleSlash2 className="mr-2 h-4 w-4" />
              Rechazar Desafío
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchData = async () => {
    setLoading(true);

    try {
      const [challengeSinValidarResponse, relationalObjectsResponse] =
        await Promise.all([
          api.get("/api/Desafios/GetDesafiosSinValidar", {
            requireLoading: false,
          }),
          api.get("/api/Desafios/GetRelationalObjects", {
            requireLoading: false,
          }),
        ]);

        console.log(challengeSinValidarResponse.data);

      // challengeSinValidarResponse.data.shift();

      for (const desafio of challengeSinValidarResponse.data) {
        const slateContent = JSON.parse(
          desafio.contenido
        );

        editor.tf.setValue(slateContent);
        convertToHtml();
      }
      

      setData(challengeSinValidarResponse.data);
      console.log(challengeSinValidarResponse.data);

      setRelationalObjects(relationalObjectsResponse.data);
      console.log(relationalObjectsResponse.data)
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

  const getCategoryName = (idCategoria) => {
    const category = relationalObjects.categorias.find(cat => cat.idCategoria === idCategoria);
    return category ? category.nombre : 'Desconocida';
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
            placeholder="Buscar por titulo de Desafío o Empresa"
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

      {selectedChallengeRequest && (
        <ValidateChallengeDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSaved={() => {
            setIsDialogOpen(false);
            fetchData();
          }}
          estatusId={selectedChallengeRequest}
          mode={dialogMode}
          /* relationalObjects={{ nivelesEducativos, estatusUsuarios }} */
        />
      )}
    </div>
  );
}
