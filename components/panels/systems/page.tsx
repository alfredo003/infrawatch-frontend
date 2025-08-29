"use client"
import { useEffect, useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge" 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { toast } from "sonner"
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
import { handleCreateSystem, ListTypeSystems, SystemData, SystemSchema } from "@/services/systemService"
 


export default function SystemsPage() {
  const { toast: useToastHook } = useToast()
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
   const [typeSystem, setTypeSystem] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [newSystemForm, setNewSystemForm] = useState({
      name: "",
      id_type: "",
      target: "",
      connection_type: "ping",
      status: "up",
      criticality_level: "low",
      sla_target: 100,
      check_interval: 60
    })
  
  const itemsPerPage = 10
  const allSystem: SystemData[] = [];
  const filteredSystems = allSystem.filter((system) => {
    const matchesSearch =
      system.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      system.fullName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || system.role === roleFilter
    const matchesStatus = statusFilter === "all" || system.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredSystems.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedSystems = filteredSystems.slice(startIndex, startIndex + itemsPerPage)

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-500"
      case "operator":
        return "bg-primary/20 text-primary"
      case "viewer":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-500"
      case "inactive":
        return "bg-red-500/20 text-red-500"
      default:
        return "bg-muted text-muted-foreground"
    }
  }
 
  const handleStatCardClick = (filterType: string) => {
    if (activeTab === "users") {
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
  }

  const handleUserAction = (action: string, systemId: string) => {
    console.log(`Action: ${action} for System: ${systemId}`)
    const user = allSystem.find((u) => u.id === systemId)

    if (action === "edit" && user) {
      setEditingUser(user)
      setEditUserForm({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      })
      setIsUserEditDialogOpen(true)
    } else if (action === "view" && user) {
      setViewingUser(user)
      setIsUserViewDialogOpen(true)
    } else if (action === "delete" && user) {
      if (confirm(`Tem certeza que deseja remover o usuário ${user.fullName}?`)) {
        toast.success(`Usuário ${user.fullName} removido com sucesso`)
      }
    } else if (action === "toggle" && user) {
      const newStatus = user.status === "active" ? "inactive" : "active"
      toast.success(`Usuário ${user.fullName} ${newStatus === "active" ? "ativado" : "desativado"} com sucesso`)
    } else if (action === "reset" && user) {
      toast.success(`Senha do usuário ${user.fullName} resetada com sucesso`)
    }
  }

  const handleUpdateUser = () => {
    console.log("Updating user:", editingUser?.id, editUserForm)
    toast.success(`Usuário ${editUserForm.fullName} atualizado com sucesso`)
    setIsUserEditDialogOpen(false)
    setEditingUser(null)
  }

  const handleSubmit = () => {
    const newErrors =  SystemSchema.safeParse(newSystemForm);;
      console.log(newErrors);
      setIsSystemCreateDialogOpen(false);
    if (Object.keys(newErrors).length === 0) {
     // handleCreateSystem(formData, setIsLoading, setAuthError, router);
     console.log(newSystemForm);
    }
  };

   useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const token = localStorage.getItem("authToken");
      ListTypeSystems(token,setTypeSystem);
    }
  }, []);

  
  return (
    <div className="p-6 space-y-6">
        <>
          {/* Statistics Cards for Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => handleStatCardClick("active")}
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
              onClick={() => handleStatCardClick("admins")}
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
              onClick={() => handleStatCardClick("operators")}
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
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => handleStatCardClick("viewers")}
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
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="operator">Operator</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
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
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                        NOME
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                        EMAIL
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                        PERFIL
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                        STATUS
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px] hidden sm:table-cell">
                        ÚLTIMO LOGIN
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                        AÇÕES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedSystems.map((system) => (
                      <tr key={system.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{system.username}</p>
                              <p className="text-xs text-muted-foreground truncate">{system.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground truncate">{system.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={getRoleColor(system.role)}>{system.role.toUpperCase()}</Badge>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={getStatusColor(system.status)}>{system.status.toUpperCase()}</Badge>
                        </td>
                        <td className="py-4 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground font-mono">{system.lastLogin}</span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("view", system.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("edit", system.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Edit className="w-4 h-4" />
                            </Button> 
                            
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("delete", system.id)}
                              className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-500 hover-blue"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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

      {/* View User Dialog */}
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
      </Dialog>

      {/* Criar Novo System */}
 
  <Dialog open={isSystemCreateDialogOpen} onOpenChange={setIsSystemCreateDialogOpen}>
      <DialogContent className="bg-card border-border max-w-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-foreground text-2xl font-semibold">Registrar Novo Sistema</DialogTitle>
        </DialogHeader>
        <hr />
        <br />
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Nome</Label>
            <Input
              value={newSystemForm.name}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, name: e.target.value })}
              placeholder="Nome do recurso"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Tipo de Sistema</Label>
            <Select
              value={newSystemForm.id_type}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, id_type: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o tipo de conexão" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                {typeSystem &&
                typeSystem.map((system) => (
                    <SelectItem key={system.id} value={system.id}>
                    {system.name}
                    </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Alvo</Label>
            <Input
              value={newSystemForm.target}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, target: e.target.value })}
              placeholder="Endereço do alvo (ex: 127.0.0.1)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Tipo de Conexão</Label>
            <Select
              value={newSystemForm.connection_type}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, connection_type: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o tipo de conexão" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="api">API</SelectItem>
                <SelectItem value="snmp">SNMP</SelectItem>
                <SelectItem value="ping">Ping</SelectItem>
                <SelectItem value="webhook">Webhook</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Status</Label>
            <Select
              value={newSystemForm.status}
              onValueChange={(value) => setNewSystemForm({ ...newSystemForm, status: value })}
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="up">Up</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="down">Down</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Nível de Criticidade</Label>
            <Select
              value={newSystemForm.criticality_level}
              onValueChange={(value) =>
                setNewSystemForm({ ...newSystemForm, criticality_level: value })
              }
            >
              <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
                <SelectValue placeholder="Selecione o nível de criticidade" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border">
                <SelectItem value="critical">Crítico</SelectItem>
                <SelectItem value="high">Alto</SelectItem>
                <SelectItem value="medium">Médio</SelectItem>
                <SelectItem value="low">Baixo</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">SLA Target (%)</Label>
            <Input
              type="number"
              value={newSystemForm.sla_target}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, sla_target: Number(e.target.value) })}
              placeholder="SLA Target (ex: 99.9)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Intervalo de Verificação (min)</Label>
            <Input
              type="number"
              value={newSystemForm.check_interval}
              onChange={(e) => setNewSystemForm({ ...newSystemForm, check_interval: Number(e.target.value) })}
              placeholder="Intervalo de verificação (ex: 1)"
              className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setIsSystemCreateDialogOpen(false)}
            className="border-border text-foreground hover:bg-muted transition-colors"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
          >
            Registrar Sistema
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </div>
  )
}