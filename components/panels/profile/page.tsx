"use client"
import { useState } from "react"
import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
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
  userCount: number
  permissions: string[]
  isSystem: boolean
  createdAt: string
}

export default function ProfilesPage() {
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newProfile, setNewProfile] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })

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
      userCount: 3,
      permissions: permissions.map((p) => p.id),
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "operator",
      name: "Operador",
      description: "Monitora alertas e pode reagir a incidentes",
      userCount: 28,
      permissions: ["dashboards.view", "alerts.manage", "reports.view"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "viewer",
      name: "Visualizador",
      description: "Acesso somente leitura aos dashboards e relatórios",
      userCount: 16,
      permissions: ["dashboards.view", "reports.view"],
      isSystem: true,
      createdAt: "2024-01-01",
    },
    {
      id: "manager",
      name: "Gestor",
      description: "Perfil personalizado para gestores de equipe",
      userCount: 5,
      permissions: ["dashboards.view", "dashboards.edit", "reports.view", "reports.export", "users.edit"],
      isSystem: false,
      createdAt: "2024-12-15",
    },
  ]

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
    setIsCreateDialogOpen(false)
    setNewProfile({ name: "", description: "", permissions: [] })
  }

  const handlePermissionToggle = (permissionId: string) => {
    setNewProfile((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter((id) => id !== permissionId)
        : [...prev.permissions, permissionId],
    }))
  }

  const stats = {
    totalProfiles: profiles.length,
    systemProfiles: profiles.filter((p) => p.isSystem).length,
    customProfiles: profiles.filter((p) => !p.isSystem).length,
    totalUsers: profiles.reduce((sum, p) => sum + p.userCount, 0),
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-wider">PERFIS & PERMISSÕES</h1>
          <p className="text-sm text-muted-foreground">Gestão de perfis de usuário e controle de permissões</p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border hover-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">TOTAL PERFIS</p>
                <p className="text-2xl font-bold text-foreground font-mono">{stats.totalProfiles}</p>
              </div>
              <Shield className="w-8 h-8 text-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">SISTEMA</p>
                <p className="text-2xl font-bold text-primary font-mono">{stats.systemProfiles}</p>
              </div>
              <Lock className="w-8 h-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border hover-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground tracking-wider">PERSONALIZADOS</p>
                <p className="text-2xl font-bold text-green-500 font-mono">{stats.customProfiles}</p>
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
                <p className="text-2xl font-bold text-foreground font-mono">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profiles List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="bg-card border-border hover-blue">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold text-foreground tracking-wider">{profile.name}</CardTitle>
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
                      onClick={() => setSelectedProfile(profile)}
                      className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {!profile.isSystem && (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/20 hover-blue">
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
    </div>
  )
}
