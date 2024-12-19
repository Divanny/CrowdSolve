"use client";

import { useState, useEffect } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const chartConfig = {
  enero: { label: "Enero", color: "hsl(200, 70%, 50%)" },      // Azul
  febrero: { label: "Febrero", color: "hsl(360, 70%, 50%)" },  // Rojo
  marzo: { label: "Marzo", color: "hsl(120, 70%, 50%)" },      // Verde
  abril: { label: "Abril", color: "hsl(60, 70%, 50%)" },       // Amarillo
  mayo: { label: "Mayo", color: "hsl(30, 70%, 50%)" },         // Naranja
  junio: { label: "Junio", color: "hsl(150, 70%, 50%)" },      // Verde claro
  julio: { label: "Julio", color: "hsl(180, 70%, 50%)" },      // Cian
  agosto: { label: "Agosto", color: "hsl(240, 70%, 50%)" },    // Púrpura
  septiembre: { label: "Septiembre", color: "hsl(90, 70%, 50%)" }, // Azul claro
  octubre: { label: "Octubre", color: "hsl(270, 70%, 50%)" },  // Rosa
  noviembre: { label: "Noviembre", color: "hsl(0, 70%, 50%)" }, // Rojo oscuro
  diciembre: { label: "Diciembre", color: "hsl(60, 70%, 50%)" }, // Ámbar
};


export function Overview() {
  const [chartData, setChartData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch("/api/Desafios/GetCountForDate");
      const data = await response.json();

      // Mapear colores al chartData según chartConfig
      const enrichedData = data.map((item) => {
        const fill = chartConfig[item.month]?.color || "hsl(0, 0%, 70%)";
        console.log("Procesando item:", item.month, "Asignado color:", chartConfig[item.month].color); // Registro de cada item
        return {
          ...item,
          fill,
        };
      });

      // Obtener años únicos
      const years = Array.from(new Set(enrichedData.map((item) => item.year)));
      setYears(years);
      setSelectedYear(years[0]); // Seleccionar el primer año por defecto
      setChartData(enrichedData);
      console.log(chartData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtrar datos por año seleccionado
  const filteredData = chartData.filter((item) => item.year === selectedYear);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Overview</CardTitle>
        <CardDescription>Filtrar datos por año</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Select
            value={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ChartContainer config={chartConfig}>
          <BarChart
            data={filteredData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="count"
              nameKey="month"
              radius={8}
            >
              <LabelList
                dataKey="count"
                nameKey="month"
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando datos del año seleccionado
        </div>
      </CardFooter>
    </Card>
  );
}
