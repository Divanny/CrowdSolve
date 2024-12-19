import React from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

import {
  NotebookText,
  Building,
  UserMinus,
  Users,

} from "lucide-react";

import { Overview } from "../../components/dashboard/Overview"
import { RecentSales } from "../../components/dashboard/TopChallengeCompany"
import {PieChartWithNumber} from "../../components/dashboard/PieChartChallenge"
import {PieChartCompany} from "../../components/dashboard/PieChartCompany"
import { Title } from '@radix-ui/react-dialog';


const Dashboard = () => {
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [dataSoluciones, setDataSoluciones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [dataResponse] =
        await Promise.all([
          api.get("/api/Usuarios/GetCantidadUsuarios", { requireLoading: false }),
        ]);

        console.log(dataResponse.data);
      setData(dataResponse.data);
   
      const [dataSolResponse] =
        await Promise.all([
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
    <div className="hidden flex-col md:flex">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <Button>Download</Button>
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    Total Usuario Pendientes Validar
                  </CardTitle>
                  <UserMinus className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.usuariosPendientesValidar}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">UsuariosEmpresas</CardTitle>
                  <Building className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{data.usuariosEmpresas}</div>

                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Soluciones
                  </CardTitle>
                  <NotebookText className="ml-2 h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dataSoluciones.soluciones}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

            
            <Card className="col-span-4">
               
                  <PieChartWithNumber  />
                
              </Card>

              <Card className="col-span-3">
                
               
                  <PieChartCompany  />
                
              </Card>
              
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
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

