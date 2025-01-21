'use client'

import { useState, useEffect } from 'react'
import { Search, Globe, Mail, Building, Users, ChevronDown, Bell, Trophy, FilterX } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import useAxios from '@/hooks/use-axios'
import { useTranslation } from 'react-i18next';

export default function CompanyListing() {
    const { t } = useTranslation();
    const { api } = useAxios();
    const [searchTerm, setSearchTerm] = useState("")
    const [sectorFilter, setSectorFilter] = useState("")
    const [tamañoFilter, setTamañoFilter] = useState("")
    const [relationalObjects, setRelationalObjects] = useState({});
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCompanies = async () => {
            try {
                const response = await api.get("api/Empresas/GetEmpresasActivas", { requireLoading: false });
                setCompanies(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const loadRelationalObjects = async () => {
            try {
                const response = await api.get("api/Empresas/GetRelationalObjects", { requireLoading: false });
                setRelationalObjects(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        Promise.all([loadRelationalObjects(), loadCompanies()]).then(() => setLoading(false));

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (sectorFilter === "" || company.idSector == sectorFilter) &&
        (tamañoFilter === "" || company.idTamañoEmpresa == tamañoFilter)
    )

    const clearFilters = () => {
        setSearchTerm("");
        setSectorFilter("");
        setTamañoFilter("");
    };

    return (
        <div className="bg-background text-foreground min-h-screen">
            <section className="-mt-[64px] pt-[64px] py-20 bg-gradient-to-b from-primary/10 to-background">
                <div className="container px-4 md:px-6 mt-12">
                    <Badge variant="outline" className="mb-4 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                        <Bell className="mr-1 h-3 w-3" />
                        {t('CompanyListing.header.badge.message')}
                    </Badge>
                    <h1 className="mb-6 text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                    {t('CompanyListing.header.title')}
                    </h1>
                    <p className="max-w-[42rem] text-muted-foreground sm:text-xl sm:leading-8">
                    {t('CompanyListing.header.description')}
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 md:px-6 py-12">
                <h2 className="text-3xl font-bold mb-8">{t('CompanyListing.companies.title')}</h2>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <div className="flex-grow">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder={t('CompanyListing.general.searchPlaceholder')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                        <Select value={sectorFilter} onValueChange={setSectorFilter}>
                            <SelectTrigger className="sm:w-[180px]">
                                <SelectValue placeholder={t('CompanyListing.general.sectorPlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {loading ? (
                                    <SelectItem value="loading"><Skeleton className="h-4 w-full" /></SelectItem>
                                ) : (
                                    relationalObjects.sectores?.map((sector) => (
                                        <SelectItem key={sector.idSector} value={sector.idSector.toString()}>
                                            {sector.nombre}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Select value={tamañoFilter} onValueChange={setTamañoFilter}>
                            <SelectTrigger className="sm:w-[180px]">
                                <SelectValue placeholder={t('CompanyListing.general.companySizePlaceholder')} />
                            </SelectTrigger>
                            <SelectContent>
                                {loading ? (
                                    <SelectItem value="loading"><Skeleton className="h-4 w-full" /></SelectItem>
                                ) : (
                                    relationalObjects.tamañosEmpresa?.map((tamaño) => (
                                        <SelectItem key={tamaño.idTamañoEmpresa} value={tamaño.idTamañoEmpresa.toString()}>
                                            {tamaño.nombre}
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                    {(searchTerm || sectorFilter || tamañoFilter) && <Button onClick={clearFilters} variant="outline" className="self-start" size="icon">
                        <FilterX className="h-4 w-4" />
                    </Button>}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <Card key={index} className="flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="w-12 h-12 rounded-full" />
                                        <div>
                                            <Skeleton className="h-6 w-32 mb-1" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <Skeleton className="h-4 w-full mb-2" />
                                    <Skeleton className="h-4 w-3/4 mb-2" />
                                    <Skeleton className="h-4 w-1/2 mb-4" />
                                    <Skeleton className="h-6 w-24 mb-4" />
                                    <div className="flex justify-between">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-auto">
                                    <Skeleton className="h-10 w-full sm:w-1/2" />
                                    <Skeleton className="h-10 w-full sm:w-1/2" />
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : filteredCompanies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompanies.map(company => (
                            <Card key={company.idEmpresa} className="flex flex-col h-full">
                                <CardHeader>
                                    <div className="flex items-center space-x-4">
                                        <img src={`/api/Account/GetAvatar/${company.idUsuario}`} alt={`${company.nombre} logo`} className="w-12 h-12 rounded-full object-cover" />
                                        <div>
                                            <CardTitle className="mb-1">{company.nombre}</CardTitle>
                                            <CardDescription>{relationalObjects.tamañosEmpresa?.find(t => t.idTamañoEmpresa == company.idTamañoEmpresa)?.descripcion}</CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{company.descripcion}</p>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        <Badge variant="secondary">
                                            {relationalObjects.sectores?.find(s => s.idSector == company.idSector)?.nombre}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span className="flex items-center">
                                            <Trophy className="mr-1 h-4 w-4" />
                                            {company.challenges ?? 0} {t('CompanyListing.companies.challenges')}
                                        </span>
                                        <span className="flex items-center">
                                            <Users className="mr-1 h-4 w-4" />
                                            {company.activeSolutions ?? 0} {t('CompanyListing.companies.solutions')}
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex flex-col sm:flex-row justify-between gap-2 mt-auto">
                                    <Button variant="outline" className="w-full sm:w-auto" asChild>
                                        <a href={company.paginaWeb} target="_blank" rel="noopener noreferrer">
                                            <Globe className="mr-2 h-4 w-4" /> {t('CompanyListing.general.website')}
                                        </a>
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="outline" className="w-full sm:w-auto">
                                                <ChevronDown className="mr-2 h-4 w-4" /> {t('CompanyListing.general.moreOptions')}
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>{t('CompanyListing.general.actions')}</DropdownMenuLabel>
                                            <DropdownMenuItem onSelect={() => window.location.href = `mailto:${company.correo}`}>
                                                <Mail className="mr-2 h-4 w-4" />
                                                <span>{t('CompanyListing.general.contact')}</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Building className="mr-2 h-4 w-4" />
                                                <span>{t('CompanyListing.general.viewChallenges')}</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <p className='text-center text-muted-foreground'>{t('CompanyListing.general.notFoundMessage')}</p>
                )}
            </div>
        </div>
    )
}