import { Button } from "@/components/ui/button";
import { SystemData } from "@/services/systemService";
import { Badge, Edit, Eye, FolderCog, Mail, Trash2, Unlink, User } from "lucide-react";

interface ListProps{
    paginatedSystems:SystemData[],
    loading?: boolean;
}

export default function ListSystems({
    paginatedSystems,
    loading = false
}:ListProps)
{

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
  

const getRoleColor = (role: string) => {
    switch (role) {
    case "api":
    return "bg-red-500/20 text-red-500"
    case "snmp":
    return "bg-primary/20 text-primary"
    case "ping":
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
    return(
          <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                        NOME
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[200px]">
                        TIPO de SIstema
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[100px]">
                        Conexão
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[80px]">
                        Nivel
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px] hidden sm:table-cell">
                       Estado
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[120px] hidden sm:table-cell">
                        check por segundo (s)
                      </th>
                      <th className="text-left py-3 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider min-w-[150px]">
                        AÇÕES
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                    // Loading state: render placeholder rows
                    Array(3).fill(0).map((_, index) => (
                    <tr key={index} className="border-b border-border">
                    <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                    <div className="min-w-0">
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-muted rounded w-1/2 mt-1 animate-pulse" />
                    </div>
                    </div>
                    </td>
                    <td className="py-4 px-2">
                    <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                    <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                    </td>
                    <td className="py-4 px-2 hidden sm:table-cell">
                    <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
                    </td>
                    <td className="py-4 px-2 hidden sm:table-cell">
                    <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                    </td>
                    <td className="py-4 px-2">
                    <div className="flex items-center gap-1">
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    <div className="h-8 w-8 bg-muted rounded animate-pulse" />
                    </div>
                    </td>
                    </tr>
                    ))
                    ) : ( paginatedSystems.map((system) => (
                      <tr key={system.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/20  flex items-center justify-center flex-shrink-0">
                              <FolderCog className="w-4 h-4 text-primary" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{system.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{system.status}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-sm text-foreground truncate">{system.id_type.toUpperCase()}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          {system.connection_type.toUpperCase()} 
                        </td>
                        <td className="py-4 px-2">
                            {system.status} 
                        </td>
                        <td className="py-4 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground font-mono">{system.status}</span>
                        </td>
                          <td className="py-4 px-2 hidden sm:table-cell">
                          <span className="text-sm text-muted-foreground font-mono">{system.check_interval}</span>
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
                    )))
                   }
                  </tbody>
                </table>
    )
}