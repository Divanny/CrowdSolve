"use client"

import { useMemo, useState, useEffect } from "react"
import { Label, Pie, PieChart } from "recharts"
import { useTranslation } from 'react-i18next';

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


  const colorPalette = Array.from({ length: 40 }, (_, i) => `var(--chartColor-${40-i})`)
  //Para armar un arreglo de colores

export function PieChartCompany() {
  const { t } = useTranslation();
  
  const [filter, setFilter] = useState("total");
    const { api } = useAxios();
    const [dataCategorias, setDataCategoria] = useState([]);
  
    const fetchData = async () => {
      try {

        const [categoriasResponse, relationalObjectsResponse] =
          await Promise.all([
            api.get(`/api/Empresas/CantidadEmpresas`, { requireLoading: false }),
          ]);
          
        if(filter=="total")
        {
            const chartData = [
                { nombre: "Total Empresas ", cantidadEmpresas:0 , fill: "var(--color-chrome)" },
              ] 
                chartData[0].cantidadEmpresas=categoriasResponse.data.cantidadEmpresa;

            setDataCategoria(chartData);
        }
        else if(filter=="tamaño")
        {
            setDataCategoria(categoriasResponse.data.tamañosEmpresa)
        }
        else
        {
            setDataCategoria(categoriasResponse.data.sectores)
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
    if(filter=="total")
    {
        return categories.reduce((acc, curr) => acc + curr.cantidadEmpresas, 0);
    }
    else if(filter=="tamaño")
    {
        return categories.reduce((acc, curr) => acc + curr.cantidadTamaño, 0);
    }
    else
    {
        return categories.reduce((acc, curr) => acc + curr.cantidadSector, 0);
    }

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
      cantidadDesafios: filter=="total" ? category.cantidadEmpresas: filter=="tamaño" ? category.cantidadTamaño: category.cantidadSector,
      color: colorPalette[index % colorPalette.length] // Asigna color según la posición
    }));
  }, [dataCategorias]);






  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{t('pieChartCompany.title')}</CardTitle>
        <CardDescription>{t('pieChartCompany.description')}</CardDescription>
      </CardHeader>


      <CardContent className="flex-1 pb-0">

      <div className="flex justify-end mb-4">
          <Select value={filter} onValueChange={(value) =>{ setFilter(value)}}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">{t('pieChartCompany.filterOptions.total')}</SelectItem>
              <SelectItem value="tamaño">{t('pieChartCompany.filterOptions.size')}</SelectItem>
              <SelectItem value="sector">{t('pieChartCompany.filterOptions.sector')}</SelectItem>
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
              dataKey={filter=="total"? "cantidadEmpresas":filter=="tamaño"?"cantidadTamaño":"cantidadSector"}
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
                          {t('pieChartCompany.tooltip.companies')}
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
        {t('pieChartCompany.showingData')}
        </div>
      </CardFooter>
    </Card>
  )
}

