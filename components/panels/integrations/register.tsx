import { Button } from "@/components/ui/button"
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { handleCreateIntegration } from "@/services/integrationService" 
import { useState } from "react"
import { z } from "zod"

interface RegisterModelProps {
  setIsSystemCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  onSystemCreated?: () => void
}

export const INTEGRATION_TYPES = [
  { value: "1", label: "INFRA - AGENT" },
  { value: "2", label: "GLPI" },
]

const SystemSchema = z.object({
  id_type: z.string().min(1, 'Tipo de sistema não pode ser vazio'),
  agent_token: z.string().optional(),
  api_token: z.string().optional(),
  api_url: z.string().optional(),
  auth_token: z.string().optional(),
}).refine(
  (data) => {
    if (data.id_type === "1") { // INFRA - AGENT
      return !!data.agent_token
    }
    if (data.id_type === "2") { // GLPI
      return data.api_token && data.api_url && data.auth_token
    }
    return true
  },
  { message: "Token do agente é obrigatório para INFRA - AGENT ou API Token, API URL e Auth Token são obrigatórios para GLPI", path: ["agent_token"] }
)

const initialFormState = {
  id_type: "",
  agent_token: "",
  api_token: "",
  api_url: "",
  auth_token: "",
}

export default function RegisterIntegration({
  setIsSystemCreateDialogOpen,
  onSystemCreated
}: RegisterModelProps) {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [newSystemForm, setNewSystemForm] = useState(initialFormState)

  const generateUniqueToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randomPart = ''
    for (let i = 0; i < 5; i++) {
      randomPart += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    const seconds = new Date().getSeconds().toString().padStart(2, '0')  
    return `INFRA${randomPart}${seconds}`  
  }

  const handleCopyToken = () => {
    navigator.clipboard.writeText(newSystemForm.agent_token).then(() => {
      toast({
        title: "Sucesso!",
        description: "Token copiado para a área de transferência",
      })
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Falha ao copiar o token",
        variant: "destructive",
      })
    })
  }

  const handleSubmit = async () => {
    const validation = SystemSchema.safeParse(newSystemForm)

    if (!validation.success) {
      setError(validation.error.errors[0].message)
      return
    }

    setError(null)
    try {
      await handleCreateIntegration(newSystemForm, setIsLoading, setError)
      toast({
        title: "Sucesso!",
        description: "Integração registrada com sucesso",
      })
      setNewSystemForm(initialFormState)
      setIsSystemCreateDialogOpen(false)
      onSystemCreated?.()
    } catch (err) {
      setError("Falha ao cadastrar integração")
    }
  }

  return (
    <DialogContent className="bg-card border-border max-w-2xl p-6">
      <DialogHeader>
        <DialogTitle className="text-foreground text-2xl font-semibold">Registrar Nova Integração</DialogTitle>
      </DialogHeader>
      <hr />
      <br />
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <div className="grid grid-cols-1 gap-6">
        <div className="space-y-2">
          <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Tipo de Integração</Label>
          <Select
            value={newSystemForm.id_type}
            onValueChange={(value) =>
              setNewSystemForm({
                ...initialFormState,
                id_type: value,
                agent_token: value === "1" ? generateUniqueToken() : "", 
              })
            }
          >
            <SelectTrigger className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors">
              <SelectValue placeholder="Selecione o tipo de integração" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              {INTEGRATION_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {newSystemForm.id_type === "1" && ( 
          <div className="space-y-2">
            <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Token do Agente</Label>
            <div className="flex items-center gap-2">
              <Input
                value={newSystemForm.agent_token}
                readOnly
                className="bg-background border-border text-foreground"
              />
              <Button onClick={handleCopyToken} className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground">
                Copiar
              </Button>
            </div>
          </div>
        )}

        {newSystemForm.id_type === "2" && ( // GLPI
          <>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">API Token</Label>
              <Input
                value={newSystemForm.api_token}
                onChange={(e) => setNewSystemForm({ ...newSystemForm, api_token: e.target.value })}
                placeholder="Digite o API Token"
                className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">API URL</Label>
              <Input
                value={newSystemForm.api_url}
                onChange={(e) => setNewSystemForm({ ...newSystemForm, api_url: e.target.value })}
                placeholder="Digite a API URL"
                className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-foreground text-sm font-medium uppercase tracking-wide">Auth Token</Label>
              <Input
                value={newSystemForm.auth_token}
                onChange={(e) => setNewSystemForm({ ...newSystemForm, auth_token: e.target.value })}
                placeholder="Digite o Auth Token"
                className="bg-background border-border text-foreground focus:ring-primary focus:border-primary transition-colors"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          onClick={() => setIsSystemCreateDialogOpen(false)}
          className="border-border text-foreground hover:bg-muted transition-colors"
        >
          Cancelar
        </Button>
        {newSystemForm.id_type && (
          <Button
            onClick={handleSubmit}
            className="bg-blue-600 hover:bg-blue-600/90 text-primary-foreground transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Registrando..." : "Registrar Integração"}
          </Button>
        )}
      </div>
    </DialogContent>
  )
}