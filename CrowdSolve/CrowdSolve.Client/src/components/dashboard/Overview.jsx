"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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

const chartData = [
  { month: "January", desktop: 186, mobile: 120, tablet: 60 },
  { month: "February", desktop: 1305, mobile: 200, tablet: 90 },
  { month: "March", desktop: 237, mobile: 160, tablet: 70 },
  { month: "April", desktop: 73, mobile: 50, tablet: 30 },
  { month: "May", desktop: 209, mobile: 150, tablet: 80 },
  { month: "June", desktop: 214, mobile: 180, tablet: 100 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} 

export function Overview() {

  const [filter, setFilter] = useState("total");

  // Función para filtrar los datos basados en la categoría seleccionada
  const getFilteredData = () => {
    if (filter === "total") {
      console.log(filter);
      return chartData.map((item) => ({
        ...item,
        total: item.desktop + item.mobile + item.tablet,
        
      }));
    }
    console.log(filter);
    return chartData;
  };

  const filteredData = getFilteredData();


  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
      <div className="flex justify-end mb-4">
          <Select value={filter} onValueChange={(value) => setFilter(value)}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="total">Total</SelectItem>
              <SelectItem value="desktop">Desktop</SelectItem>
              <SelectItem value="mobile">Mobile</SelectItem>
              <SelectItem value="tablet">Tablet</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
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
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* <Bar dataKey={filter} fill="var(--color-desktop)" radius={8}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar> */}


             {filter === "total" ? (
            <Bar dataKey="total" fill="var(--color-desktop)" radius={8} />
          ) : (
            <Bar dataKey={filter} fill="var(--color-desktop)" radius={8} />
           
          )}
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
