"use client";

import { useState, useEffect } from "react";
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
  enero: { label: "Enero", color: "hsl(0, 20.70%, 33.10%)" },
  febrero: { label: "Febrero", color: "hsl(15, 30%, 40%)" },
  marzo: { label: "Marzo", color: "hsl(30, 60%, 50%)" },
  abril: { label: "Abril", color: "hsl(120, 50%, 40%)" },
  mayo: { label: "Mayo", color: "hsl(210, 80%, 40%)" },
  junio: { label: "Junio", color: "hsl(20, 80%, 60%)" },
  julio: { label: "Julio", color: "hsl(340, 80%, 40%)" },
  agosto: { label: "Agosto", color: "hsl(230, 30%, 30%)" },
  septiembre: { label: "Septiembre", color: "hsl(120, 40%, 60%)" },
  octubre: { label: "Octubre", color: "hsl(340, 80%, 80%)" },
  noviembre: { label: "Noviembre", color: "hsl(200, 70%, 60%)" },
  diciembre: { label: "Diciembre", color: "hsl(120, 60%, 50%)" },
};

export function Overview() {
  const { api } = useAxios();
  const [chartData, setChartData] = useState([]);
  const [years, setYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");

  const fetchData = async () => {
    try {
      const response = await Promise.all([
        api.get("/api/Desafios/GetCountForDate", { requireLoading: false }),
      ]);

      const data = response[0].data;

      const enrichedData = data.map((item) => {
        const fill = chartConfig[item.month]?.color || "hsl(0, 0%, 70%)";
        return { ...item, fill };
      });

      const years = Array.from(new Set(enrichedData.map((item) => item.year)));
      setYears(years);
      setSelectedYear(years[0]);
      setChartData(enrichedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = chartData.filter((item) => item.year === selectedYear);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg md:text-xl">Overview</CardTitle>
        <CardDescription className="text-sm md:text-base">
          Filtrar datos por año
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end mb-4">
          <Select
            value={selectedYear}
            onValueChange={(value) => setSelectedYear(value)}
          >
            <SelectTrigger className="w-full md:w-[200px]">
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

        <div className="w-full h-[200px] md:h-[400px]">
          <ChartContainer config={chartConfig}>
            <BarChart
              width={undefined} // Responsive
              height={undefined} // Responsive
              data={filteredData}
              margin={{
                top: 20,
                left: 0,
                right: 0,
              }}
              className="w-full"
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
              <Bar dataKey="count" nameKey="month" radius={8}>
                <LabelList
                  dataKey="count"
                  nameKey="month"
                  position="top"
                  offset={12}
                  className="fill-foreground text-xs md:text-sm"
                />
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando datos del año seleccionado
        </div>
      </CardFooter>
    </Card>
  );
}
