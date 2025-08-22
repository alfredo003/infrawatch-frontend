"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Monitor,
  Shield,
  Target,
  Bell,
  RefreshCw,
  LogOut,
  Activity,
  Server,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Panel from "@/components/panels";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import TopBarLocation from "@/components/ui/top-bar-location";

export default function InfraWatchDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { signOut, user, isAuthenticated, isLoading } = useAuth();

  const menuItems = [
    { id: 0, icon: Monitor, label: "DASHBOARD" },
    { id: 1, icon: Server, label: "SERVIDORES" },
    { id: 2, icon: Activity, label: "REDE" },
    { id: 3, icon: Target, label: "APLICAÇÕES" },
    { id: 4, icon: Settings, label: "SISTEMAS" },
    { id: 5, icon: Settings, label: "INTEGRAÇÕES" },
    { id: 6, icon: AlertTriangle, label: "ALERTAS" },
    { id: 7, icon: Shield, label: "RELATÓRIOS" },
    { id: 8, icon: Shield, label: "REGISTRO" },
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // useEffect(() => {
  //   if (mounted && !isLoading && !isAuthenticated) {
  //     router.push('/login')
  //   }
  // }, [mounted, isLoading, isAuthenticated, router])

  const handleLogout = () => {
    // Confirmar logout
    if (confirm("Tem certeza que deseja sair do sistema?")) {
      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
        variant: "default",
      });
      signOut();
    }
  };

  // change it later to use SSR and extract the clients components
  if (!mounted || isLoading) {
    return (
      <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-blue-600 font-bold text-lg tracking-wider animate-pulse">
            CARREGANDO INFRAWATCH...
          </div>
        </div>
      </div>
    );
  }

  // Se não está autenticado, não renderizar nada (será redirecionado)
  // if (!isAuthenticated) {
  //   return null
  // }

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={`w-70 bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${!sidebarCollapsed ? "md:block" : ""}`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
              <h1 className="text-blue-600 font-bold text-lg tracking-wider">
                INFRAWATCH
              </h1>
              <p className="text-neutral-500 text-xs">
                Monitoramento de Infraestrutura v1.0
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-blue-600"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${sidebarCollapsed ? "" : "rotate-180"}`}
              />
            </Button>
          </div>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 p-3 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-blue-600 text-white"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
                }`}
              >
                <item.icon className="w-5 h-5 md:w-5 md:h-5 sm:w-6 sm:h-6" />
                {!sidebarCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="mt-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                  SISTEMA OPERACIONAL
                </span>
              </div>
              <div className="text-xs text-neutral-600 dark:text-neutral-400">
                <div>UPTIME: 99.8%</div>
                <div>SERVIÇOS: 247 MONITORADOS</div>
                <div>ALERTAS: 3 ATIVOS</div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {!sidebarCollapsed && (
            <div className="mt-4">
              <Button
                onClick={handleLogout}
                variant="ghost"
                className="w-full flex items-center gap-3 p-3 text-neutral-600 dark:text-neutral-400 hover:text-red-600 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">SAIR</span>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col ${!sidebarCollapsed ? "md:ml-0" : ""}`}
      >
        {/* Top Toolbar */}
        <div className="h-16 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              <TopBarLocation
                location={
                  menuItems.find((item) => item.id === activeSection)?.label ??
                  "N/A"
                }
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {/* User Info */}
            {user && (
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{user.email}</span>
              </div>
            )}
            <div className="text-xs text-neutral-500">
              ÚLTIMA ATUALIZAÇÃO: {new Date().toLocaleString("pt-BR")}
            </div>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-blue-600 relative"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-neutral-400 hover:text-blue-600"
            >
              <RefreshCw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-neutral-400 hover:text-red-500"
              title="Sair do sistema"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto bg-neutral-50 dark:bg-black">
          <Panel active={activeSection} />
        </div>
      </div>
    </div>
  );
}
