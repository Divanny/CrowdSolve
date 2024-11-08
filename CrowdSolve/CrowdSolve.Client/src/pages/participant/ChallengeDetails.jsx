import React, { useState, useEffect } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Building2, MessageSquare, User } from "lucide-react"

// Mock data for challenges
const challengesData = [
  { id: 1, name: 'Diseña un sistema de energía renovable', category: 'Energía', image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80', company: 'Microsoft Corporation', endDate: '2024-12-31', description: 'Este proyecto se enfoca en el diseño y desarrollo de un sistema de energía renovable sostenible y eficiente, destinado a su implementación en comunidades. La iniciativa busca proporcionar una solución sostenible que reduzca la dependencia de combustibles fósiles y disminuya el impacto ambiental. El sistema se basará en fuentes de energía renovable disponibles en la región.' },
  { id: 2, name: 'Optimización de algoritmos de IA', category: 'IA', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', company: 'Google AI', endDate: '2024-11-15', description: 'Este desafío busca mejorar la eficiencia de los algoritmos de inteligencia artificial existentes. Los participantes deberán proponer e implementar optimizaciones que reduzcan el tiempo de procesamiento y el consumo de recursos, manteniendo o mejorando la precisión de los resultados.' },
  { id: 3, name: 'Plataforma de telemedicina accesible', category: 'Salud', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80', company: 'HealthTech Solutions', endDate: '2024-12-05', description: 'El objetivo de este proyecto es desarrollar una plataforma de telemedicina que sea accesible para comunidades rurales y de bajos recursos. La solución debe ser fácil de usar, funcionar con conexiones de internet limitadas y garantizar la privacidad de los datos médicos.' },
];

export default function ChallengeDetail({ id }) {
  const [challenge, setChallenge] = useState(null)

  useEffect(() => {
    const challengeId = parseInt(id)
    const foundChallenge = challengesData.find(c => c.id === challengeId)
    setChallenge(foundChallenge)
  }, [id])

  if (!challenge) {
    return <div className="min-h-screen bg-[#f5f2ef] flex items-center justify-center">Cargando...</div>
  }

  return (
    <div className="min-h-screen bg-[#f5f2ef]">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8">
          {/* Challenge Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {challenge.name}
            </h1>
            <div className="flex items-center text-muted-foreground">
              <Building2 className="h-4 w-4 mr-2" />
              <span>{challenge.company}</span>
            </div>
          </div>

          {/* Challenge Description and Image */}
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {challenge.description}
                </p>

                {/* Expected Results */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Resultados Esperados</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Reducir los costos en las familias de bajos de recursos.</li>
                    <li>Mejora en la capacidad de la aplicación para manejar mayor número de usuarios concurrentes.</li>
                    <li>Mejor servicio en las respuestas de servicio.</li>
                    <li>Incremento en la satisfacción del usuario final y en la retención de usuarios.</li>
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="mt-6">
                  <h2 className="text-xl font-semibold mb-3">Recomendamos</h2>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Buena documentación</li>
                    <li>Participar en la empresa</li>
                  </ul>
                </div>

                <Button className="mt-6 bg-[#B85C38] hover:bg-[#A04B2D] text-white">
                  Participar en el Desafío
                </Button>
              </div>
              <div className="md:w-1/3">
                <img src={challenge.image} alt={challenge.name} className="w-full h-auto rounded-lg shadow-md" />
              </div>
            </div>
          </Card>

          {/* Comments Section */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Foro de Comentarios
            </h2>

            {/* Comment Input */}
            <div className="mb-6">
              <Textarea 
                placeholder="Enviar Comentario" 
                className="min-h-[100px] mb-2"
              />
              <div className="flex justify-end">
                <Button className="bg-[#B85C38] hover:bg-[#A04B2D] text-white">
                  Comentar
                </Button>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {[1, 2].map((comment) => (
                <div key={comment} className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id amet ipsum eu lacus tortor
                      facilisis. Proin volutpat nunc eget what else tempor.
                    </p>
                    <Button 
                      variant="link" 
                      className="text-[#B85C38] hover:text-[#A04B2D] p-0 h-auto mt-1"
                    >
                      Responder
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}