"use client";

import { useEffect, useState } from "react";
import {
  Plus, 
  Workflow,
  PackageCheck,
  BrainCircuit,
  AlertTriangle,
} from "lucide-react";

import { Dialog } from "@/components/ui/dialog"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent  } from "@/components/ui/card"; 
import { useToast } from "@/hooks/use-toast"; 
import ListIntegrations from "./list";
import { Integration, listAllIntegration } from "@/services/integrationService";
import { createEventSource } from "@/lib/sse";
import { Skeleton } from "@/components/ui/skeleton"; // 👈 Import do skeleton
import RegisterIntegration from "./register";
 
export default function IntegrationPage() {
  const [isSystemCreateDialogOpen, setIsSystemCreateDialogOpen] = useState(false);
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    listAllIntegration()
      .then((data) => {
        setIntegrations(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);
 
  useEffect(() => {
    const URL = process.env.NEXT_PUBLIC_API_URL!;
    const es = createEventSource<Integration[]>(
      `${URL}/stream/integrations`,
      (data) => setIntegrations(data),
      (err) => {
        console.error("Erro SSE:", err);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível atualizar em tempo real.",
          variant: "destructive",
        });
      }
    );

    return () => es.close();
  }, [toast]);
  
  if (error) return <div>Erro ao carregar dados</div>;

  // --- SKELETON LOADING ---
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Skeleton */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>

          {/* Estatísticas Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lista Skeleton */}
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

 
  const total = integrations?.length ?? 0;
  const totalActive = integrations?.filter((s:any) => s.status === "active").length ?? 0;
  const totalInactive = integrations?.filter((s:any) => s.status !== "active").length ?? 0;

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              INTEGRAÇÕES
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
              Gerencie as integrações disponíveis
            </p>
          </div>

          {integrations?.length !== 0 && (
            <Button onClick={() => setIsSystemCreateDialogOpen(true)} className="bg-blue-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Fazer Integração
            </Button>
          )}
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 ">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Integrações realizadas
                  </p>
                  <p className="text-2xl font-bold text-blue-600">
                    {total}
                  </p>
                </div>
                <Workflow className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card> 

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Operacionais
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {totalActive}
                  </p>
                </div>
                <PackageCheck className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Com Problemas
                  </p>
                  <p className="text-2xl font-bold text-red-600">
                    { totalInactive }
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <ListIntegrations integrations={integrations} loading={loading} />

        {integrations?.length === 0 && (
          <div className="text-center py-12">
            <BrainCircuit className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-600 dark:text-neutral-400 mb-2">
              Nenhuma integração feita
            </h3>
            <p className="text-neutral-500 mb-4">
              Comece por cadastrar sua primeira integração
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsSystemCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Integração
            </Button>
          </div>
        )}
      </div>

      {/* Criar Novo RegisterIntegration */}
      <Dialog open={isSystemCreateDialogOpen} onOpenChange={setIsSystemCreateDialogOpen}>
        <RegisterIntegration setIsSystemCreateDialogOpen={setIsSystemCreateDialogOpen} />
      </Dialog>
    </div>
  );
}
