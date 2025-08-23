"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  UserCheck,
  BarChart3,
  Bell,
  FileText,
  Database,
  Lock,
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
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

interface Permission {
  id: string
  name: string
  description: string
  category: string
  icon: React.ReactNode
}

interface Profile {
  id: string
  name: string
  description: string
  email: string
  userCount: number
  permissions: string[]
  isSystem: boolean
  createdAt: string
}

interface UserData {
  id: string
  username: string
  email: string
  fullName: string
  role: "admin" | "operator" | "viewer"
  status: "active" | "inactive"
  lastLogin: string
  createdAt: string
  permissions: string[]
  lastLoginIP: string
  department: string
  phone: string
}

export default function ProfilesPage() {
  const { toast: useToastHook } = useToast()

  const [activeTab, setActiveTab] = useState<"permissions" | "users">("permissions")

  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null)
  const [editProfile, setEditProfile] = useState({
    name: "",
    description: "",
    email: "",
    permissions: [] as string[],
  })
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    email: "",
    permissions: [] as string[],
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false)
  const [isUserViewDialogOpen, setIsUserViewDialogOpen] = useState(false)
  const [isUserCreateDialogOpen, setIsUserCreateDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [viewingUser, setViewingUser] = useState<UserData | null>(null)
  const [editUserForm, setEditUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    role: "" as "admin" | "operator" | "viewer",
  })
  const [newUserForm, setNewUserForm] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    role: "" as "admin" | "operator" | "viewer",
  })
  const itemsPerPage = 10

  // Available permissions
  const permissions: Permission[] = [
    {
      id: "users.create",
      name: "Criar Usuários",
      description: "Permite criar novos usuários no sistema",
      category: "Gestão de Usuários",
      icon: <UserCheck className="w-4 h-4" />,
    },
    {
      id: "users.edit",
      name: "Editar Usuários",
      description: "Permite editar informações de usuários existentes",
      category: "Gestão de Usuários",
      icon: <Edit className="w-4 h-4" />,
    },
    {
      id: "users.delete",
      name: "Remover Usuários",
      description: "Permite remover usuários do sistema",
      category: "Gestão de Usuários",
      icon: <Trash2 className="w-4 h-4" />,
    },
    {
      id: "dashboards.view",
      name: "Ver Dashboards",
      description: "Acesso aos painéis de controle e métricas",
      category: "Visualização",
      icon: <BarChart3 className="w-4 h-4" />,
    },
    {
      id: "dashboards.edit",
      name: "Configurar Dashboards",
      description: "Permite personalizar e configurar dashboards",
      category: "Configuração",
      icon: <Settings className="w-4 h-4" />,
    },
    {
      id: "slas.manage",
      name: "Configurar SLAs",
      description: "Gestão de acordos de nível de serviço",
      category: "Configuração",
      icon: <Database className="w-4 h-4" />,
    },
    {
      id: "alerts.manage",
      name: "Gerir Alertas",
      description: "Configurar e gerenciar alertas e notificações",
      category: "Monitoramento",
      icon: <Bell className="w-4 h-4" />,
    },
    {
      id: "reports.view",
      name: "Ver Relatórios",
      description: "Acesso aos relatórios do sistema",
      category: "Relatórios",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "reports.export",
      name: "Exportar Relatórios",
      description: "Permite exportar relatórios em diversos formatos",
      category: "Relatórios",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "system.admin",
      name: "Administração Sistema",
      description: "Acesso completo às configurações do sistema",
      category: "Sistema",
      icon: <Lock className="w-4 h-4" />,
    },
  ]

  // System profiles
  const profiles: Profile[] = [
    {
      id: "admin",
      name: "Administrador",
      description: "Acesso completo ao sistema com todas as permissões",
      email: "admin@infrawatch.com",
      userCount: 3,
      permissions: permissions.map((p) => p.id),
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "operator",
      name: "Operador",
      description: "Monitora alertas e pode reagir a incidentes",
      email: "operator@infrawatch.com",
      userCount: 28,
      permissions: ["dashboards.view", "alerts.manage", "reports.view"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "viewer",
      name: "Visualizador",
      description: "Acesso somente leitura aos dashboards e relatórios",
      email: "viewer@infrawatch.com",
      userCount: 16,
      permissions: ["dashboards.view", "reports.view"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "manager",
      name: "Gestor",
      description: "Perfil personalizado para gestores de equipe",
      email: "manager@infrawatch.com",
      userCount: 5,
      permissions: ["dashboards.view", "dashboards.edit", "reports.view", "reports.export", "users.edit"],
      isSystem: false,
      createdAt: "2024-12-15",
    },
  ]

  const [profileFilter, setProfileFilter] = useState<"all" | "system" | "custom">("all")

  const handleProfileFilterClick = (filter: "all" | "system" | "custom") => {
    setProfileFilter(filter)
    toast.success(
      `Filtro aplicado: ${filter === "all" ? "Todos os perfis" : filter === "system" ? "Perfis do sistema" : "Perfis personalizados"}`,
    )
  }

  const filteredProfiles = profiles.filter((profile) => {
    if (profileFilter === "system") return profile.isSystem
    if (profileFilter === "custom") return !profile.isSystem
    return true
  })

  const allUsers: UserData[] = [
    {
      id: "USR-001",
      username: "admin.silva",
      email: "silva@infrawatch.com",
      fullName: "João Silva",
      role: "admin",
      status: "active",
      lastLogin: "2025-01-14 14:30",
      createdAt: "2024-12-01",
      permissions: [
        "Criar usuários",
        "Editar usuários",
        "Ver dashboards",
        "Configurar SLAs",
        "Gerir alertas",
        "Acesso a relatórios",
        "Configurações do sistema",
      ],
      lastLoginIP: "192.168.1.100",
      department: "TI",
      phone: "+244 923 456 789",
    },
    {
      id: "USR-002",
      username: "op.costa",
      email: "costa@infrawatch.com",
      fullName: "Maria Costa",
      role: "operator",
      status: "active",
      lastLogin: "2025-01-14 13:45",
      createdAt: "2024-12-05",
      permissions: ["Ver dashboards", "Gerir alertas", "Acesso a relatórios"],
      lastLoginIP: "192.168.1.101",
      department: "Operações",
      phone: "+244 923 456 790",
    },
    {
      id: "USR-003",
      username: "view.santos",
      email: "santos@infrawatch.com",
      fullName: "Pedro Santos",
      role: "viewer",
      status: "inactive",
      lastLogin: "2025-01-12 09:15",
      createdAt: "2024-12-10",
      permissions: ["Ver dashboards"],
      lastLoginIP: "192.168.1.102",
      department: "Análise",
      phone: "+244 923 456 791",
    },
    {
      id: "USR-004",
      username: "op.oliveira",
      email: "oliveira@infrawatch.com",
      fullName: "Ana Oliveira",
      role: "operator",
      status: "active",
      lastLogin: "2025-01-14 15:20",
      createdAt: "2024-12-15",
      permissions: ["Ver dashboards", "Gerir alertas", "Acesso a relatórios"],
      lastLoginIP: "192.168.1.103",
      department: "Monitoramento",
      phone: "+244 923 456 792",
    },
    {
      id: "USR-005",
      username: "admin.ferreira",
      email: "ferreira@infrawatch.com",
      fullName: "Carlos Ferreira",
      role: "admin",
      status: "active",
      lastLogin: "2025-01-14 16:10",
      createdAt: "2024-12-20",
      permissions: [
        "Criar usuários",
        "Editar usuários",
        "Ver dashboards",
        "Configurar SLAs",
        "Gerir alertas",
        "Acesso a relatórios",
        "Configurações do sistema",
      ],
      lastLoginIP: "192.168.1.104",
      department: "Administração",
      phone: "+244 923 456 793",
    },
    {
      id: "USR-006",
      username: "op.mendes",
      email: "mendes@infrawatch.com",
      fullName: "Ricardo Mendes",
      role: "operator",
      status: "active",
      lastLogin: "2025-01-14 12:30",
      createdAt: "2024-12-22",
      permissions: ["Ver dashboards", "Gerir alertas", "Acesso a relatórios"],
      lastLoginIP: "192.168.1.105",
      department: "Operações",
      phone: "+244 923 456 794",
    },
    {
      id: "USR-007",
      username: "view.almeida",
      email: "almeida@infrawatch.com",
      fullName: "Sofia Almeida",
      role: "viewer",
      status: "active",
      lastLogin: "2025-01-14 11:45",
      createdAt: "2024-12-25",
      permissions: ["Ver dashboards"],
      lastLoginIP: "192.168.1.106",
      department: "Relatórios",
      phone: "+244 923 456 795",
    },
    {
      id: "USR-008",
      username: "admin.rodrigues",
      email: "rodrigues@infrawatch.com",
      fullName: "Miguel Rodrigues",
      role: "admin",
      status: "inactive",
      lastLogin: "2025-01-13 18:20",
      createdAt: "2024-12-28",
      permissions: [
        "Criar usuários",
        "Editar usuários",
        "Ver dashboards",
        "Configurar SLAs",
        "Gerir alertas",
        "Acesso a relatórios",
        "Configurações do sistema",
      ],
      lastLoginIP: "192.168.1.107",
      department: "TI",
      phone: "+244 923 456 796",
    },
    {
      id: "USR-009",
      username: "op.pereira",
      email: "pereira@infrawatch.com",
      fullName: "Catarina Pereira",
      role: "operator",
      status: "active",
      lastLogin: "2025-01-14 10:15",
      createdAt: "2025-01-02",
      permissions: ["Ver dashboards", "Gerir alertas", "Acesso a relatórios"],
      lastLoginIP: "192.168.1.108",
      department: "Monitoramento",
      phone: "+244 923 456 797",
    },
    {
      id: "USR-010",
      username: "view.gomes",
      email: "gomes@infrawatch.com",
      fullName: "António Gomes",
      role: "viewer",
      status: "active",
      lastLogin: "2025-01-14 09:30",
      createdAt: "2025-01-05",
      permissions: ["Ver dashboards"],
      lastLoginIP: "192.168.1.109",
      department: "Análise",
      phone: "+244 923 456 798",
    },
  ]

  const filteredUsers = allUsers.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

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

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {}
    permissions.forEach((permission) => {
      if (!categories[permission.category]) {
        categories[permission.category] = []
      }
      categories[permission.category].push(permission)
    })
    return categories
  }

  const handleCreateProfile = () => {
    console.log("Creating profile:", newProfile)
    toast.success(`Perfil "${newProfile.name}" criado com sucesso!`, {
      description: `O perfil está disponível para uso.`,
    })
    setIsCreateDialogOpen(false)
    setNewProfile({ name: "", description: "", email: "", permissions: [] })
  }

  const handlePermissionToggle = (permissionId: string) => {
    setNewProfile((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  const handleEditProfile = (profile: Profile) => {
    setEditingProfile(profile)
    setEditProfile({
      name: profile.name,
      description: profile.description,
      email: profile.email,
      permissions: [...profile.permissions],
    })
    setIsEditDialogOpen(true)
  }

  const handleViewProfile = (profile: Profile) => {
    setSelectedProfile(profile)
    setIsViewDialogOpen(true)
  }

  const handleSaveEditedProfile = () => {
    console.log("Saving edited profile:", editProfile)
    toast.success(`Perfil "${editProfile.name}" atualizado com sucesso!`)
    setIsEditDialogOpen(false)
    setEditingProfile(null)
  }

  const handleEditPermissionToggle = (permissionId: string) => {
    setEditProfile((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
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

  const handleCreateUser = () => {
    if (
      !newUserForm.username ||
      !newUserForm.email ||
      !newUserForm.fullName ||
      !newUserForm.password ||
      !newUserForm.role
    ) {
      toast.error("Todos os campos são obrigatórios")
      return
    }

    console.log("Creating new user:", newUserForm)
    toast.success(`Usuário ${newUserForm.fullName} criado com sucesso`)
    setIsUserCreateDialogOpen(false)
    setNewUserForm({
      username: "",
      email: "",
      fullName: "",
      password: "",
      role: "" as "admin" | "operator" | "viewer",
    })
  }

  const handleUserAction = (action: string, userId: string) => {
    console.log(`Action: ${action} for user: ${userId}`)
    const user = allUsers.find((u) => u.id === userId)

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

  const profileStats = {
    totalProfiles: profiles.length,
    systemProfiles: profiles.filter((p) => p.isSystem).length,
    customProfiles: profiles.filter((p) => !p.isSystem).length,
    totalUsers: profiles.reduce((sum, p) => sum + p.userCount, 0),
  }

  const userStats = {
    total: allUsers.length,
    active: allUsers.filter((u) => u.status === "active").length,
    admins: allUsers.filter((u) => u.role === "admin").length,
    operators: allUsers.filter((u) => u.role === "operator").length,
    viewers: allUsers.filter((u) => u.role === "viewer").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">PERFIS & USUÁRIOS</h1>
          <p className="text-sm text-muted-foreground">Gestão completa de perfis, permissões e usuários do sistema</p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          {activeTab === "permissions" ? (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg">
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Perfil
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-foreground">Criar Novo Perfil</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm font-medium uppercase tracking-wide">
                        NOME DO PERFIL
                      </Label>
                      <Input
                        value={newProfile.name}
                        onChange={(e) => setNewProfile((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Ex: Supervisor"
                        className="bg-background border-border text-foreground hover-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm font-medium uppercase tracking-wide">EMAIL</Label>
                      <Input
                        type="email"
                        value={newProfile.email}
                        onChange={(e) => setNewProfile((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="email@infrawatch.com"
                        className="bg-background border-border text-foreground hover-blue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-foreground text-sm font-medium uppercase tracking-wide">DESCRIÇÃO</Label>
                      <Input
                        value={newProfile.description}
                        onChange={(e) => setNewProfile((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="Descrição do perfil..."
                        className="bg-background border-border text-foreground hover-blue"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-foreground text-sm font-medium uppercase tracking-wide">PERMISSÕES</Label>
                    {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                      <Card key={category} className="bg-muted/50 border-border">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {categoryPermissions.map((permission) => (
                            <div key={permission.id} className="flex items-start space-x-3">
                              <Checkbox
                                id={permission.id}
                                checked={newProfile.permissions.includes(permission.id)}
                                onCheckedChange={() => handlePermissionToggle(permission.id)}
                                className="mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  {permission.icon}
                                  <Label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium text-foreground cursor-pointer"
                                  >
                                    {permission.name}
                                  </Label>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="border-border text-foreground hover:bg-accent hover-blue"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleCreateProfile}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg"
                    >
                      Criar Perfil
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          ) : (
            <>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg">
                Importar Usuários
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg">
                <Plus className="w-4 h-4 mr-2" />
                Novo Usuário
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="flex space-x-1 bg-muted p-1 rounded-lg w-fit">
        <Button
          variant={activeTab === "permissions" ? "default" : "ghost"}
          onClick={() => setActiveTab("permissions")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "permissions"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          }`}
        >
          <Shield className="w-4 h-4 mr-2" />
          Permissões
        </Button>
        <Button
          variant={activeTab === "users" ? "default" : "ghost"}
          onClick={() => setActiveTab("users")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === "users"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-background"
          }`}
        >
          <Users className="w-4 h-4 mr-2" />
          Usuários
        </Button>
      </div>

      {activeTab === "permissions" ? (
        <>
          {/* Statistics Cards for Profiles */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card
              className={`bg-card border-border hover-blue cursor-pointer transition-all ${profileFilter === "all" ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleProfileFilterClick("all")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider">TOTAL PERFIS</p>
                    <p className="text-2xl font-bold text-foreground font-mono">{profileStats.totalProfiles}</p>
                  </div>
                  <Shield className="w-8 h-8 text-foreground" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-card border-border hover-blue cursor-pointer transition-all ${profileFilter === "system" ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleProfileFilterClick("system")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider">SISTEMA</p>
                    <p className="text-2xl font-bold text-primary font-mono">{profileStats.systemProfiles}</p>
                  </div>
                  <Lock className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card
              className={`bg-card border-border hover-blue cursor-pointer transition-all ${profileFilter === "custom" ? "ring-2 ring-primary" : ""}`}
              onClick={() => handleProfileFilterClick("custom")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider">PERSONALIZADOS</p>
                    <p className="text-2xl font-bold text-green-500 font-mono">{profileStats.customProfiles}</p>
                  </div>
                  <Settings className="w-8 h-8 text-green-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover-blue">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wider">USUÁRIOS</p>
                    <p className="text-2xl font-bold text-foreground font-mono">{profileStats.totalUsers}</p>
                  </div>
                  <Users className="w-8 h-8 text-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profiles List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProfiles.map((profile) => (
              <Card
                key={profile.id}
                className="bg-card border-border hover-blue cursor-pointer transition-all hover:shadow-lg"
                onClick={() => handleViewProfile(profile)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-foreground tracking-wider">
                          {profile.name}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{profile.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {profile.isSystem && <Badge className="bg-primary/20 text-primary text-xs">SISTEMA</Badge>}
                      <Badge className="bg-muted text-muted-foreground text-xs">{profile.userCount} usuários</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-foreground text-sm font-medium uppercase tracking-wide mb-2 block">
                        PERMISSÕES ({profile.permissions.length})
                      </Label>
                      <div className="flex flex-wrap gap-2">
                        {profile.permissions.slice(0, 6).map((permissionId) => {
                          const permission = permissions.find((p) => p.id === permissionId)
                          return (
                            <Badge
                              key={permissionId}
                              className="bg-muted/50 text-muted-foreground text-xs flex items-center gap-1"
                            >
                              {permission?.icon}
                              {permission?.name}
                            </Badge>
                          )
                        })}
                        {profile.permissions.length > 6 && (
                          <Badge className="bg-muted/50 text-muted-foreground text-xs">
                            +{profile.permissions.length - 6} mais
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-xs text-muted-foreground">
                        Criado em: {new Date(profile.createdAt).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProfile(profile)}
                          className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!profile.isSystem && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditProfile(profile)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 hover:bg-red-500/20 text-red-500 hover-blue"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Statistics Cards for Users */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => handleStatCardClick("total")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">TOTAL</p>
                    <p className="text-2xl font-bold text-foreground">{userStats.total}</p>
                  </div>
                  <Users className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => handleStatCardClick("active")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ATIVOS</p>
                    <p className="text-2xl font-bold text-green-500">{userStats.active}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">ADMINS</p>
                    <p className="text-2xl font-bold text-red-500">{userStats.admins}</p>
                  </div>
                  <Crown className="w-8 h-8 text-red-500" />
                </div>
              </CardContent>
            </Card>

            <Card
              className="bg-card border-border hover-blue cursor-pointer transition-all duration-200 hover:border-primary/50"
              onClick={() => handleStatCardClick("operators")}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">OPERADORES</p>
                    <p className="text-2xl font-bold text-blue-500">{userStats.operators}</p>
                  </div>
                  <Settings className="w-8 h-8 text-blue-500" />
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
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">VISUALIZADORES</p>
                    <p className="text-2xl font-bold text-yellow-500">{userStats.viewers}</p>
                  </div>
                  <Eye className="w-8 h-8 text-yellow-500" />
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
                      placeholder="Buscar usuários..."
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
                      <SelectItem value="all">Todos os Perfis</SelectItem>
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
                      <SelectItem value="active">Ativo</SelectItem>
                      <SelectItem value="inactive">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  onClick={() => setIsUserCreateDialogOpen(true)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Usuário
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-foreground tracking-wider">
                LISTA DE USUÁRIOS ({filteredUsers.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                        USUÁRIO
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
                    {paginatedUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                              <User className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{user.username}</p>
                              <p className="text-xs text-muted-foreground truncate">{user.fullName}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-sm text-foreground truncate">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={getRoleColor(user.role)}>{user.role.toUpperCase()}</Badge>
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={getStatusColor(user.status)}>{user.status.toUpperCase()}</Badge>
                        </td>
                        <td className="py-4 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground font-mono">{user.lastLogin}</span>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("view", user.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("edit", user.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("toggle", user.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <Power className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("reset", user.id)}
                              className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleUserAction("delete", user.id)}
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
                  Mostrando {startIndex + 1} a {Math.min(startIndex + itemsPerPage, filteredUsers.length)} de{" "}
                  {filteredUsers.length} usuários
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
      )}

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground">Editar Perfil: {editingProfile?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">NOME DO PERFIL</Label>
                <Input
                  value={editProfile.name}
                  onChange={(e) => setEditProfile((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Supervisor"
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">EMAIL</Label>
                <Input
                  type="email"
                  value={editProfile.email}
                  onChange={(e) => setEditProfile((prev) => ({ ...prev, email: e.target.value }))}
                  placeholder="email@infrawatch.com"
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-foreground text-sm font-medium uppercase tracking-wide">DESCRIÇÃO</Label>
                <Input
                  value={editProfile.description}
                  onChange={(e) => setEditProfile((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição do perfil..."
                  className="bg-background border-border text-foreground hover-blue"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">PERMISSÕES</Label>
              {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => (
                <Card key={category} className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                      {category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryPermissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-3">
                        <Checkbox
                          id={`edit-${permission.id}`}
                          checked={editProfile.permissions.includes(permission.id)}
                          onCheckedChange={() => handleEditPermissionToggle(permission.id)}
                          className="mt-1"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            {permission.icon}
                            <Label
                              htmlFor={`edit-${permission.id}`}
                              className="text-sm font-medium text-foreground cursor-pointer"
                            >
                              {permission.name}
                            </Label>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{permission.description}</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="border-border text-foreground hover:bg-accent hover-blue"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEditedProfile}
                className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg"
              >
                Salvar Alterações
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Profile Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="bg-card border-border max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-foreground flex items-center gap-3">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary" />
              </div>
              {selectedProfile?.name}
              {selectedProfile?.isSystem && <Badge className="bg-primary/20 text-primary text-xs">SISTEMA</Badge>}
            </DialogTitle>
          </DialogHeader>
          {selectedProfile && (
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
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">NOME</Label>
                      <p className="text-sm font-medium text-foreground">{selectedProfile.name}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">EMAIL</Label>
                      <p className="text-sm font-medium text-foreground">{selectedProfile.email}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">DESCRIÇÃO</Label>
                      <p className="text-sm font-medium text-foreground">{selectedProfile.description}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">USUÁRIOS</Label>
                      <p className="text-sm font-medium text-foreground">{selectedProfile.userCount} usuários ativos</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground uppercase tracking-wide">CRIADO EM</Label>
                      <p className="text-sm text-foreground">
                        {new Date(selectedProfile.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50 border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                      ESTATÍSTICAS
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">PERMISSÕES</span>
                      <Badge className="bg-primary/20 text-primary text-xs">{selectedProfile.permissions.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">TIPO</span>
                      <Badge
                        className={
                          selectedProfile.isSystem ? "bg-primary/20 text-primary" : "bg-green-500/20 text-green-500"
                        }
                      >
                        {selectedProfile.isSystem ? "SISTEMA" : "PERSONALIZADO"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">STATUS</span>
                      <Badge className="bg-green-500/20 text-green-500">ATIVO</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                    PERMISSÕES DETALHADAS ({selectedProfile.permissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(getPermissionsByCategory()).map(([category, categoryPermissions]) => {
                      const categoryPerms = categoryPermissions.filter((p) =>
                        selectedProfile.permissions.includes(p.id),
                      )
                      if (categoryPerms.length === 0) return null

                      return (
                        <div key={category}>
                          <Label className="text-xs text-muted-foreground uppercase tracking-wide mb-2 block">
                            {category}
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                            {categoryPerms.map((permission) => (
                              <div
                                key={permission.id}
                                className="flex items-center gap-2 p-2 bg-background/50 rounded border border-border"
                              >
                                {permission.icon}
                                <div>
                                  <p className="text-sm font-medium text-foreground">{permission.name}</p>
                                  <p className="text-xs text-muted-foreground">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end">
                <Button
                  onClick={() => setIsViewDialogOpen(false)}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue-bg"
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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
                      <Badge className="bg-primary/20 text-primary text-xs">{viewingUser.permissions.length}</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-foreground uppercase tracking-wide">
                    PERMISSÕES DETALHADAS ({viewingUser.permissions.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {viewingUser.permissions.map((permission) => (
                      <div
                        key={permission}
                        className="flex items-center gap-2 p-2 bg-background/50 rounded border border-border"
                      >
                        <div>
                          <p className="text-sm font-medium text-foreground">{permission}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

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

      <Dialog open={isUserCreateDialogOpen} onOpenChange={setIsUserCreateDialogOpen}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">Criar Novo Usuário</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">USUÁRIO</Label>
              <Input
                value={newUserForm.username}
                onChange={(e) => setNewUserForm({ ...newUserForm, username: e.target.value })}
                placeholder="Nome de usuário"
                className="bg-background border-border text-foreground hover-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">EMAIL</Label>
              <Input
                type="email"
                value={newUserForm.email}
                onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                placeholder="Email"
                className="bg-background border-border text-foreground hover-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">NOME COMPLETO</Label>
              <Input
                value={newUserForm.fullName}
                onChange={(e) => setNewUserForm({ ...newUserForm, fullName: e.target.value })}
                placeholder="Nome Completo"
                className="bg-background border-border text-foreground hover-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">SENHA</Label>
              <Input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm({ ...newUserForm, password: e.target.value })}
                placeholder="Senha"
                className="bg-background border-border text-foreground hover-blue"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">PERFIL</Label>
              <Select
                value={newUserForm.role}
                onValueChange={(value) =>
                  setNewUserForm({ ...newUserForm, role: value as "admin" | "operator" | "viewer" })
                }
              >
                <SelectTrigger className="bg-background border-border text-foreground focus:border-primary focus:ring-primary/20 hover-blue">
                  <SelectValue placeholder="Selecione um perfil" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="admin">Admin - Gestão completa do sistema</SelectItem>
                  <SelectItem value="operator">Operator - Visualiza e reage a alertas</SelectItem>
                  <SelectItem value="viewer">Viewer - Apenas leitura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => setIsUserCreateDialogOpen(false)}
              className="border-border text-foreground hover:bg-muted hover-blue"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleCreateUser}
              className="bg-primary hover:bg-primary/90 text-primary-foreground hover-blue"
            >
              Criar Usuário
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}