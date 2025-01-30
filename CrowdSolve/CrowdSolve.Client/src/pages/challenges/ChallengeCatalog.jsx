"use client"

import * as React from "react"
import { useTranslation } from 'react-i18next';
import { Search, Calendar, Users, Filter, Lightbulb, Code, Cpu } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import useAxios from '@/hooks/use-axios'
import { useNavigate, useParams } from "react-router-dom"

function getTimeAgo(date, t) {
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return t('ChallengeCatalog.timeAgo.1dayAgo')
  if (diffDays < 7) return ` ${diffDays} ${t('ChallengeCatalog.timeAgo.?daysAgo')}`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks === 1 ? t('ChallengeCatalog.timeAgo.week') : t('ChallengeCatalog.timeAgo.weeks')}`
  }
  const months = Math.floor(diffDays / 30)
  return `${months === 1 ? t('ChallengeCatalog.timeAgo.month') : t('ChallengeCatalog.timeAgo.months')}`
}

function getTimeRemaining(deadline, t) {
  const now = new Date()
  const timeRemaining = deadline.getTime() - now.getTime()
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24))

  if (daysRemaining < 0) return t('ChallengeCatalog.timeAgo.close')
  if (daysRemaining === 0) return t('ChallengeCatalog.timeAgo.closeToday')
  if (daysRemaining === 1) return t('ChallengeCatalog.timeAgo.dayRemaining')
  return `${daysRemaining} ${t('ChallengeCatalog.timeAgo.daysRemaining')}`
}

export default function ChallengeCatalog() {
  const { t } = useTranslation();
  const { api } = useAxios();
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategories, setSelectedCategories] = React.useState([])
  const [selectedStatus, setSelectedStatus] = React.useState([])
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [relationalObjects, setRelationalObjects] = React.useState({
    categorias: [],
    estatusDesafios: []
  })
  const [challenges, setChallenges] = React.useState([])
  const [loading, setLoading] = React.useState(true);
  const { search } = useParams();

  React.useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await api.get("api/Desafios/GetDesafiosValidados", { requireLoading: false });
        const challengesResponse = await Promise.all(response.data.map(async (challenge) => {
          return { ...challenge, fechaInicio: new Date(challenge.fechaInicio), fechaLimite: new Date(challenge.fechaLimite) };
        }));

        setChallenges(challengesResponse);
      } catch (error) {
        console.error(error);
      }
    };

    const loadRelationalObjects = async () => {
      try {
        const response = await api.get("api/Desafios/GetRelationalObjects", { requireLoading: false });
        setRelationalObjects(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([loadRelationalObjects(), loadChallenges()]).then(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (search) {
      setSearchQuery(search);
    }
  }, [search]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(c => c !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleStatusChange = (statusId) => {
    setSelectedStatus(prev =>
      prev.includes(statusId)
        ? prev.filter(s => s !== statusId)
        : [...prev, statusId]
    )
  }

  const filteredDesafios = challenges.filter(desafio => {
    const matchesSearch = desafio.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desafio.empresa.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategories.length === 0 ||
      desafio.categorias.some(cat => selectedCategories.includes(cat.idCategoria))
    const matchesStatus = selectedStatus.length === 0 ||
      selectedStatus.includes(desafio.idEstatusDesafio)
    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="relative overflow-hidden bg-background pt-24 pb-4 -mt-[64px]">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl mb-6">
              {t('ChallengeCatalog.pageTitle')}
                <span className="block text-primary">{t('ChallengeCatalog.pageTitle2')}</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-[42rem] mb-8">
              {t('ChallengeCatalog.pagedescription')}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="relative h-[400px] hidden lg:block"
            >
              <motion.div
                className="absolute top-1/4 left-1/4"
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 10, 0]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <Lightbulb className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              <motion.div
                className="absolute top-1/2 right-1/4"
                animate={{
                  y: [0, 20, 0],
                  rotate: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5
                }}
              >
                <div className="bg-secondary/10 p-4 rounded-2xl">
                  <Code className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              <motion.div
                className="absolute bottom-1/4 left-1/3"
                animate={{
                  y: [0, 15, 0],
                  rotate: [0, 5, 0]
                }}
                transition={{
                  duration: 3.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
              >
                <div className="bg-primary/10 p-4 rounded-2xl">
                  <Cpu className="w-8 h-8 text-primary" />
                </div>
              </motion.div>

              <svg className="absolute inset-0 w-full h-full">
                <motion.path
                  d="M100,100 C150,150 200,150 250,100"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/20"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse"
                  }}
                />
                <motion.path
                  d="M150,200 C200,250 250,250 300,200"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="text-muted-foreground/20"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                    delay: 0.5
                  }}
                />
              </svg>

              <motion.div
                className="absolute top-10 right-10 w-40 h-40 bg-primary/10 rounded-3xl"
                animate={{
                  rotate: [0, 90],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute bottom-10 right-20 w-32 h-32 bg-secondary/10 rounded-3xl"
                animate={{
                  rotate: [0, -90],
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              <motion.div
                className="absolute top-1/2 left-1/4 w-24 h-24 bg-accent/10 rounded-full"
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-12 -mt-16 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros para pantallas grandes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden lg:block w-64 space-y-6"
          >
            <Card className="space-y-6 p-4">
              <FilterContent
                selectedCategories={selectedCategories}
                selectedStatus={selectedStatus}
                handleCategoryChange={handleCategoryChange}
                handleStatusChange={handleStatusChange}
                categorias={relationalObjects.categorias}
                estatus={relationalObjects.estatusDesafios}
                loading={loading}
              />
            </Card>
          </motion.div>

          {/* Filtros para pantallas pequeñas */}
          <div className="lg:hidden mb-4">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  {t(`ChallengeCatalog.filter`)}
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>{t('ChallengeCatalog.filter')}</SheetTitle>
                  <SheetDescription>
                  {t('ChallengeCatalog.searchPreferences')}
                  </SheetDescription>
                </SheetHeader>
                <ScrollArea className="h-[calc(100vh-10rem)] pr-4">
                  <FilterContent
                    selectedCategories={selectedCategories}
                    selectedStatus={selectedStatus}
                    handleCategoryChange={handleCategoryChange}
                    handleStatusChange={handleStatusChange}
                    categorias={relationalObjects.categorias}
                    estatus={relationalObjects.estatusDesafios}
                    loading={loading}
                  />
                </ScrollArea>
              </SheetContent>
            </Sheet>
          </div>

          {/* Lista de desafíos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex-1"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex-1 w-full">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder={t('ChallengeCatalog.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-card"
                  />
                </div>
              </div>
              <Select defaultValue="recent">
                <SelectTrigger className="w-[180px] bg-card">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t('ChallengeCatalog.itemSelect.recent')}</SelectItem>
                  <SelectItem value="popular">{t('ChallengeCatalog.itemSelect.popular')}</SelectItem>
                  <SelectItem value="closing">{t('ChallengeCatalog.itemSelect.closeSoon')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {loading ? (
                Array(5).fill(0).map((_, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SkeletonCard />
                  </motion.div>
                ))
              ) : (
                filteredDesafios.map((desafio) => (
                  <motion.div
                    key={desafio.idDesafio}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChallengeCard 
                      desafio={desafio} 
                      categorias={relationalObjects.categorias}
                      estatus={relationalObjects.estatusDesafios}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function FilterContent({ selectedCategories, selectedStatus, handleCategoryChange, handleStatusChange, categorias, estatus, loading }) {
  const { t } = useTranslation();
  if (loading) {
    return (
      <>
        <div>
          <Label className="text-sm font-medium mb-3 block">{t('ChallengeCatalog.categories.label')}</Label>
          <div className="space-y-2">
            {Array(5).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm font-medium mb-3 block">{t('ChallengeCatalog.categories.status')}</Label>
          <div className="space-y-2">
            {Array(3).fill(0).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <div>
        <Label className="text-sm font-medium mb-3 block">{t('ChallengeCatalog.categories.label')}</Label>
        <div className="space-y-2">
          {categorias.map(categoria => (
            <div key={categoria.idCategoria} className="flex items-center">
              <Checkbox
                id={`category-${categoria.idCategoria}`}
                checked={selectedCategories.includes(categoria.idCategoria)}
                onCheckedChange={() => handleCategoryChange(categoria.idCategoria)}
              />
              <label
                htmlFor={`category-${categoria.idCategoria}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {categoria.nombre}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-sm font-medium mb-3 block">{t('ChallengeCatalog.categories.status')}</Label>
        <div className="space-y-2">
          {estatus.map(status => (
            <div key={status.idEstatusProceso} className="flex items-center">
              <Checkbox
                id={`status-${status.idEstatusProceso}`}
                checked={selectedStatus.includes(status.idEstatusProceso)}
                onCheckedChange={() => handleStatusChange(status.idEstatusProceso)}
              />
              <label
                htmlFor={`status-${status.idEstatusProceso}`}
                className="ml-2 text-sm cursor-pointer"
              >
                {status.nombre}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function ChallengeCard({ desafio, categorias, estatus }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getCategoryName = (idCategoria) => {
    const category = categorias.find(cat => cat.idCategoria === idCategoria);
    return category ? category.nombre : 'Desconocida';
  };

  const getStatusName = (idEstatusDesafio) => {
    const status = estatus.find(stat => stat.idEstatusProceso === idEstatusDesafio);
    return status ? status.nombre : 'Desconocido';
  };

  return (
    <Card className="group overflow-hidden mb-4 hover:shadow-lg transition-shadow duration-300 hover:cursor-pointer" onClick={() => navigate(`/challenge/${desafio.idDesafio}`)}>
      <CardContent className="p-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center align-items-center gap-2">
              <img
                src={`/api/Account/GetAvatar/${desafio.idUsuarioEmpresa}`}
                alt={`Logo de ${desafio.empresa}`}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                  {desafio.titulo}
                </h3>
                <p className="text-sm text-muted-foreground">{desafio.empresa}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {getTimeAgo(desafio.fechaInicio, t)}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {getStatusName(desafio.idEstatusDesafio)}
            </Badge>
            {desafio.categorias.map((categoria) => (
              <Badge
                key={categoria.idCategoria}
                variant="outline"
                className="bg-secondary/10"
              >
                {getCategoryName(categoria.idCategoria)}
              </Badge>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {getTimeRemaining(desafio.fechaLimite, t)}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {desafio.soluciones ? desafio.soluciones.length : 'Sin'} {t('ChallengeCatalog.solutions')}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SkeletonCard() {
  return (
    <Card className="mb-4">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
        </div>
      </CardContent>
    </Card>
  )
}