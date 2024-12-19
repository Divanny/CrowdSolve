"use client"

import React, { useMemo } from "react"
import { TrendingUp } from 'lucide-react'
import { Label, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const colorPalette = Array.from({ length: 40 }, (_, i) => `var(--chartColor-${i + 1})`)



export function PieChartWithNumber({linkApi}) {
  
  const [filter, setFilter] = useState("total");
    const { api } = useAxios();
    const [dataCategorias, setDataCategoria] = useState([]);
  
    const fetchData = async () => {
      try {
        console.log(filter)

        if(filter=="total")
        {
          const [categoriasResponse, relationalObjectsResponse] =
          await Promise.all([
            api.get(`/api/Desafios/DesafioDashboardData`, { requireLoading: false }),
          ]);

          const chartData = [
            { nombre: "Total Desafios ", cantidadDesafios:0 , fill: "var(--color-chrome)" },
          ] 
          
          chartData[0].cantidadDesafios=categoriasResponse.data;
          setDataCategoria(chartData);
        
        }
        else
        {
          const [categoriasResponse, relationalObjectsResponse] =
          await Promise.all([
            api.get(`/api/${filter}`, { requireLoading: false }),
          ]);
  
        setDataCategoria(categoriasResponse.data);
        
        }
        
  
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        /* setIsLoading(false); */
      }
    };
  
    useEffect(() => {
      fetchData();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);
  
  const totalCategories = useMemo(() => {
    const categories = dataCategorias;

    console.log(categories); // Aquí puedes verificar la estructura de chartData
    return categories.reduce((acc, curr) => acc + curr.cantidadDesafios, 0);
  }, [dataCategorias]);


  const chartDataWithColors = useMemo(() => {
    const categories = dataCategorias;
    return categories.map((entry, index) => ({
      ...entry, // Mantener los datos existentes
      fill: colorPalette[index % colorPalette.length] // Asignar un color de la paleta
    }));
  }, [dataCategorias]);


  const chartConfig = useMemo(() => {
    const categories = dataCategorias;

    return categories.map((category, index) => ({
      label: category.nombre,
      cantidadDesafios: category.cantidadDesafios,
      color: colorPalette[index % colorPalette.length] // Asigna color según la posición
    }));
  }, [dataCategorias]);






  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Cantidad Desafios</CardTitle>
        <CardDescription>Creados</CardDescription>
      </CardHeader>


      <CardContent className="flex-1 pb-0">

      <div className="flex justify-end mb-4">
          <Select value={filter} onValueChange={(value) =>{ setFilter(value);console.log(value);}}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total</SelectItem>
              <SelectItem value="Categorias">Categoria</SelectItem>
              <SelectItem value="Empresas">Empresas</SelectItem>
            </SelectContent>
          </Select>
        </div>


        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartDataWithColors}
              dataKey="cantidadDesafios"
              nameKey="nombre"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalCategories.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Desafios
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
        Mostrando el total de Desafios en sus diferentes ambitos.
        </div>
      </CardFooter>
    </Card>
  )
}

