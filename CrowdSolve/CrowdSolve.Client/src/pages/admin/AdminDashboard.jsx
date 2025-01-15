import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import "@/styles/colorPalette.css";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
} from "@/components/ui/tabs";
import {
  NotebookText,
  Building,
  UserMinus,
  Users,
} from "lucide-react";
import { Overview } from "../../components/dashboard/Overview";
import { RecentSales } from "../../components/dashboard/TopChallengeCompany";
import { PieChartWithNumber } from "../../components/dashboard/PieChartChallenge";
import { PieChartCompany } from "../../components/dashboard/PieChartCompany";
import useAxios from "@/hooks/use-axios";

const Dashboard = () => {

  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [dataSoluciones, setDataSoluciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handlePrintAndDownload = () => {
    window.print();

  };

  const fetchData = async () => {
    try {
      const [dataResponse] = await Promise.all([
        api.get("/api/Usuarios/GetCantidadUsuarios", { requireLoading: false }),
      ]);
      console.log(dataResponse.data);
      setData(dataResponse.data);

      const [dataSolResponse] = await Promise.all([
        api.get("/api/Soluciones/GetCantidadSoluciones", { requireLoading: false }),
      ]);

      setDataSoluciones(dataSolResponse.data);
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

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Dashboard
          </h2>
          <div className="flex items-center space-x-2">
          <Button onClick={handlePrintAndDownload}>Descargar</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            {/* Tarjetas principales */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Usuarios
                  </CardTitle>
                  <Users className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.usuarios}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuarios Participantes
                  </CardTitle>
                  <UserMinus className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.usuariosParticipantes}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuarios Empresas
                  </CardTitle>
                  <Building className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.usuariosEmpresas}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Soluciones Enviadas
                  </CardTitle>
                  <NotebookText className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataSoluciones.soluciones}</div>
                </CardContent>
              </Card>
            </div>

            {/* Gráficos y tablas */}
            <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="sm:col-span-1 md:col-span-2 lg:col-span-4">
                <PieChartWithNumber />
              </Card>

              <Card className="sm:col-span-1 md:col-span-2 lg:col-span-3">
                <PieChartCompany />
              </Card>

              <Card className="sm:col-span-1 md:col-span-2 lg:col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              <Card className="sm:col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Top 10 Empresas con más Desafios</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
