import React, { useState, useEffect } from "react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

export function RecentSales() {
  
  const { api } = useAxios();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await api.get("/api/Empresas/GetEmpresasOrdenDesafios", {
        requireLoading: false,
      });
      console.log(response.data);
      setData(response.data); // Asegúrate de que los datos son un array

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
    <div className="space-y-8">
      {isLoading ? (
        <p>Loading...</p>
        
      ) : (
        data.map((item, index) => (
          <div key={index} className="flex items-center">
            <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
              {item ? (
                <img src={`/api/Account/GetAvatar/${item.idUsuario}`} className="w-12 h-12 rounded-full object-cover" />
              ) : (
                <AvatarFallback>{item.nombre?.[0] || "N/A"}</AvatarFallback>
                
              )}
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{item.nombre}</p>
              <p className="text-sm text-muted-foreground">{item.paginaWeb}</p>
            </div>
            <div className="ml-auto font-medium">{item.cantidadDesafios}</div>
          </div>
        ))
      )}
    </div>
  );
}
