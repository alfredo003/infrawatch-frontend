"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import {
  Shield,
  Users,
  Settings,
  Eye,
  Edit,
  Trash2,
  Plus, 
  User,
  Mail,
  Search,
  Power,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  MapPin,
  Smartphone,
  CheckCircle,
  Crown,
  ClockArrowUp,
  ClockArrowDown,
  CircleMinus,
  MonitorCog,
} from "lucide-react" 
import { handleCreateSystem, listAllSystems, listAllTypeSystems, SystemData } from "@/services/systemService"
import ListSystems from "./list"
import RegisterSystem from "./register"
 

export default function SystemsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)  
 
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false)
  const [isUserViewDialogOpen, setIsUserViewDialogOpen] = useState(false)
  const [isSystemCreateDialogOpen, setIsSystemCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<SystemData | null>(null)
  const [viewingUser, setViewingUser] = useState<SystemData | null>(null)
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "" as "admin" | "operator" | "viewer",
  })
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<any | null>(null);
  const [systems, setSystems] = useState([]);
  const [typeSystems, setTypeSystems] = useState([]);


  useEffect(() => {
    const loadSistemas = async () => {
      try {
        const data = await listAllSystems();
        setSystems(data);
      } catch (err) {
        setError('Falha ao carregar sistemas');
      }finally {
        setLoading(false);
      }
    };

    const loadTypeSistemas = async () => {
      try {
        const data = await listAllTypeSystems();
        setTypeSystems(data);
      } catch (err) {
        setError('Falha ao carregar tipo de sistemas');
      }finally {
        setLoading(false);
      }
    };

    
    loadSistemas();
    loadTypeSistemas();
  }, []);
  
  const itemsPerPage = 10
  const allSystem: SystemData[] = systems;
  const filteredSystems = allSystem.filter((system) => {
    const matchesSearch =
      system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.connection_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.criticality_level.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" 
    const matchesStatus = statusFilter === "all" || system.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredSystems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSystems = filteredSystems.slice(startIndex, startIndex + itemsPerPage)


 
  const handleStatCardClick = (filterType: string) => {
 
      switch (filterType) {
        case "total":
          setRoleFilter("all")
          setStatusFilter("all")
          break
        case "active":
          setStatusFilter("active")
          setRoleFilter("all")
          break
        case "admins":
          setRoleFilter("admin")
          setStatusFilter("all")
          break
        case "operators":
          setRoleFilter("operator")
          setStatusFilter("all")
          break
        case "viewers":
          setRoleFilter("viewer")
          setStatusFilter("all")
          break
      }
      setCurrentPage(1)
      toast.success(`Filtro aplicado: ${filterType}`)
  }



  const handleUpdateUser = () => {
    console.log("Updating user:", editingUser?.id, editUserForm)
    toast.success(`Usuário ${editUserForm.fullName} atualizado com sucesso`)
    setIsUserEditDialogOpen(false)
    setEditingUser(null)
  }


  if (error) {
    return <div>{error}</div>;
  }

  
  return (
    <div className="p-6 space-y-6">
        <>
          {/* Statistics Cards for Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
             >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ATIVOS</p>
                    <p className="text-2xl font-bold text-green-500">12</p>
                  </div>
                  <ClockArrowUp  className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
             >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">DOWN</p>
                    <p className="text-2xl font-bold text-red-500">12</p>
                  </div>
                  <ClockArrowDown className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-card border-border hover-yellow cursor-pointer transition-all duration-200 hover:border-primary/50"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Manutenção</p>
                    <p className="text-2xl font-bold text-yellow-500">12</p>
                  </div>
                  <CircleMinus className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>

            <Card
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hardware</p>
                    <p className="text-2xl font-bold text-blue-500">12</p>
                  </div>
                  <MonitorCog  className="w-8 h-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="flex flex-col md:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar Sistema..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-background border-border text-foreground focus:border-primary focus:ring-primary/20 hover-blue"
                    />
                  </div>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground focus:border-primary focus:ring-primary/20 hover-blue">
                      <SelectValue placeholder="Filtrar por perfil" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Todos os Sistemas</SelectItem>
                        { typeSystems.map((item:{name:string},index) => (
                          <SelectItem key={index} value={item.name}>{item.name}</SelectItem>
                        )) }
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48 bg-background border-border text-foreground focus:border-primary focus:ring-primary/20 hover-blue">
                      <SelectValue placeholder="Filtrar por status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="all">Todos os Status</SelectItem>
                      <SelectItem value="up">Up</SelectItem>
                      <SelectItem value="down">Down</SelectItem>
                       <SelectItem value="mantainece">Manutenção</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setIsSystemCreateDialogOpen(true)}
                  className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground hover-blue"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Sistema 
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground tracking-wider">
                SISTEMAS CADASTRADOS ({filteredSystems.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
              <ListSystems paginatedSystems={paginatedSystems} loading={loading}/>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredSystems.length)} de{" "}
                  {filteredSystems.length} Sistemas
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="border-border text-foreground hover:bg-accent hover-blue"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-foreground font-mono">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="border-border text-foreground hover:bg-accent hover-blue"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
 
      {/* Edit User Dialog */}
      <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Usuário</DialogTitle>
          </DialogHeader>
          {editingUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">USUÁRIO</Label>
                <Input
                  value={editUserForm.username}
                  onChange={(e) => setEditUserForm({ ...editUserForm, username: e.target.value })}
                  placeholder="Nome de usuário"
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">EMAIL</Label>
                <Input
                  type="email"
                  value={editUserForm.email}
                  onChange={(e) => setEditUserForm({ ...editUserForm, email: e.target.value })}
                  placeholder="Email"
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">NOME COMPLETO</Label>
                <Input
                  value={editUserForm.fullName}
                  onChange={(e) => setEditUserForm({ ...editUserForm, fullName: e.target.value })}
                  placeholder="Nome Completo"
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">PERFIL</Label>
                <Select
                  value={editUserForm.role}
                  onValueChange={(value) =>
                    setEditUserForm({ ...editUserForm, role: value as "admin" | "operator" | "viewer" })
                  }
                >
                  <SelectTrigger className="bg-background border-border text-foreground focus:border-primary focus:ring-primary/20 hover-blue">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="operator">Operator</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUserEditDialogOpen(false)}
                  className="border-border text-foreground hover:bg-accent hover-blue"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleUpdateUser}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg"
                >
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* View User Dialog 
      <Dialog open={isUserViewDialogOpen} onOpenChange={setIsUserViewDialogOpen}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              {viewingUser?.fullName}
              <Badge className={getRoleColor(viewingUser?.role || "")}>{viewingUser?.role?.toUpperCase()}</Badge>
            </DialogTitle>
          </DialogHeader>
          {viewingUser && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                      INFORMAÇÕES GERAIS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">USUÁRIO</Label>
                      <p className="text-sm font-medium text-foreground">{viewingUser.username}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">EMAIL</Label>
                      <p className="text-sm font-medium text-foreground">{viewingUser.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">NOME COMPLETO</Label>
                      <p className="text-sm font-medium text-foreground">{viewingUser.fullName}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">PERFIL</Label>
                      <p className="text-sm font-medium text-foreground">{viewingUser.role}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">STATUS</Label>
                      <p className="text-sm font-medium text-foreground">{viewingUser.status}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">CRIADO EM</Label>
                      <p className="text-sm text-foreground">
                        {new Date(viewingUser.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                      DETALHES
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">ÚLTIMO LOGIN</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">{viewingUser.lastLogin}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">IP</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">{viewingUser.lastLoginIP}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">DEPARTAMENTO</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">{viewingUser.department}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">TELEFONE</span>
                      </div>
                      <Badge className="bg-primary/20 text-primary text-xs">{viewingUser.phone}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Power className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground uppercase tracking-wide">PERMISSÕES</span>
                      </div>
                   
                    </div>
                  </CardContent>
                </Card>
              </div>
 
              <div className="flex justify-end">
                <Button
                  onClick={() => setIsUserViewDialogOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>*/}

      {/* Criar Novo System */}
 
  <Dialog open={isSystemCreateDialogOpen} onOpenChange={setIsSystemCreateDialogOpen}>
      <RegisterSystem setIsSystemCreateDialogOpen={setIsSystemCreateDialogOpen} typeSystems={typeSystems} />
  </Dialog>
    </div>
  )
}