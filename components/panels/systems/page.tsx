"use client"
import { useState } from "react"
import useSWR from "swr"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog } from "@/components/ui/dialog"

import {
  Search,
  ChevronLeft,
  ChevronRight,
  ClockArrowUp,
  ClockArrowDown,
  CircleMinus,
  MonitorCog,
  Plus,
} from "lucide-react" 

import { listAllSystems, listAllTypeSystems, SystemData } from "@/services/systemService"
import ListSystems from "./list"
import RegisterSystem from "./register" 

export default function SystemsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isSystemCreateDialogOpen, setIsSystemCreateDialogOpen] = useState(false)

  // ✅ SWR substitui useEffect + estados manuais
  const { data: systems, error: systemsError, isLoading: systemsLoading, mutate: reloadSystems } =
    useSWR<SystemData[]>("systems", listAllSystems, {
      dedupingInterval: 60000, // 1 min de cache
      revalidateOnFocus: false,
    })

  const { data: typeSystems, error: typesError, isLoading: typesLoading } =
    useSWR<{ name: string }[]>("typeSystems", listAllTypeSystems, {
      dedupingInterval: 300000, // 5 min
      revalidateOnFocus: false,
    })

  if (systemsError || typesError) return <div>Erro ao carregar dados</div>
  if (systemsLoading || typesLoading) return <div>Carregando...</div>

  const itemsPerPage = 10
  const allSystem: SystemData[] = systems || []
  const filteredSystems = allSystem.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.connection_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.criticality_level.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || system.id_type === roleFilter
    const matchesStatus = statusFilter === "all" || system.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredSystems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSystems = filteredSystems.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="p-6 space-y-6">
      <>
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">ATIVOS</p>
                <p className="text-2xl font-bold text-green-500">{allSystem.filter(s => s.status === "up").length}</p>
              </div>
              <ClockArrowUp className="w-8 h-8 text-green-500" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">DOWN</p>
                <p className="text-2xl font-bold text-red-500">{allSystem.filter(s => s.status === "down").length}</p>
              </div>
              <ClockArrowDown className="w-8 h-8 text-red-500" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Manutenção</p>
                <p className="text-2xl font-bold text-yellow-500">{allSystem.filter(s => s.status === "MAINTENANCE").length}</p>
              </div>
              <CircleMinus className="w-8 h-8 text-yellow-500" />
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase">Hardware</p>
                <p className="text-2xl font-bold text-blue-500">
                  {allSystem.filter(s => s.connection_type === "ping" || s.connection_type === "snmp").length}
                </p>
              </div>
              <MonitorCog className="w-8 h-8 text-blue-500" />
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Buscar Sistema..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Sistemas</SelectItem>
                  {typeSystems?.map((item, index) => (
                    <SelectItem key={index} value={item.name}>{item.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="up">Up</SelectItem>
                  <SelectItem value="down">Down</SelectItem>
                  <SelectItem value="MAINTENANCE">Manutenção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={() => setIsSystemCreateDialogOpen(true)} className="bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Sistema
            </Button>
          </CardContent>
        </Card>

        {/* Systems Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg font-bold">SISTEMAS CADASTRADOS ({filteredSystems.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <ListSystems paginatedSystems={paginatedSystems} loading={systemsLoading} onSystemReload={reloadSystems} />
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredSystems.length)} de{" "}
                {filteredSystems.length} Sistemas
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-mono">
                  {currentPage} / {totalPages}
                </span>
                <Button size="sm" variant="outline" onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </>

      {/* Criar Novo Sistema */}
      <Dialog open={isSystemCreateDialogOpen} onOpenChange={setIsSystemCreateDialogOpen}>
        <RegisterSystem 
          setIsSystemCreateDialogOpen={setIsSystemCreateDialogOpen} 
          typeSystems={typeSystems || []}
          onSystemCreated={reloadSystems} // ✅ usa mutate para recarregar sem refazer useEffect
        />
      </Dialog>
    </div>
  )
}
