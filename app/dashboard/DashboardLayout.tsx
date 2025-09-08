"use client";

import { ChevronRight, Bell, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import TopBarLocation from "@/components/ui/top-bar-location";
import Panel from "@/components/panels";
import { menuItems } from "./menu";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { listAllSystems, SystemData } from "@/services/systemService";
import useSWR from "swr";
import { AlertData, listAllAlerts } from "@/services/alertService";
 
interface DashboardLayoutProps {
  sidebarCollapsed: boolean;
  activeSection: number;
  user: { email: string } | null;
  setSidebarCollapsed: (value: boolean) => void;
  setActiveSection: (id: number) => void;
  handleOpenLogoutModal: () => void;
}
 
export default function DashboardLayout({
  sidebarCollapsed,
  activeSection,
  user,
  setSidebarCollapsed,
  setActiveSection,
  handleOpenLogoutModal,
}: DashboardLayoutProps) {

    const { data: systems, error: systemsError, isLoading: systemsLoading, mutate: reloadSystems } =
    useSWR<SystemData[]>("systems", listAllSystems, {
      dedupingInterval: 10000,
      revalidateOnFocus: false,
    });

    const { data: alerts, error: alertsError, isLoading: alertsLoading, mutate: reloadAlerts } =
      useSWR<AlertData[]>("alerts", listAllAlerts, {
        dedupingInterval: 10000,
        revalidateOnFocus: false,
      });

    const onlineCount = systems?.length; 
    const alertsCount:any = alerts?.length; 
    const offlineCount = systems?.filter((s) => s.status === "down").length;
  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      {/* Sidebar */}
      <div
        className={` ${sidebarCollapsed ? "w-16" : "w-64"} bg-neutral-50 dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-700 transition-all duration-300 fixed md:relative z-50 md:z-auto h-full md:h-auto ${
          !sidebarCollapsed ? "md:block" : ""
        }`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className={`${sidebarCollapsed ? "hidden" : "block"}`}>
                <img src="/letter-logo.png" alt="" />
                <p className="text-neutral-500 text-xs uppercase">
                  <small>servidor v1.0</small> 
                </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-neutral-400 hover:text-blue-600"
            >
              <ChevronRight
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform ${
                  sidebarCollapsed ? "" : "rotate-180"
                }`}
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
                
                <item.icon className="w-6 h-6" />
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
                <div>EMPRESA: RCS Angola</div>
                <div>SLA: 99.8%</div>
                <div>SERVIÇOS: {onlineCount} MONITORADOS</div>
                <div>ALERTAS: {offlineCount} ATIVOS</div>
              </div>
            </div>
          )}

          {/* Logout Button */}
          {!sidebarCollapsed && (
            <div className="mt-4">
              <Button
                onClick={handleOpenLogoutModal}
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
            {user && (
              <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>{user.email}</span>
              </div>
            )}
            <div className="text-xs text-neutral-500">
                {new Date().toLocaleString("pt-BR")}
            </div>
            <ThemeToggle />
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="text-neutral-400 hover:text-blue-600 relative"
    >
      <Bell className="w-5 h-5" />
      {alertsCount  > 0 && (
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-semibold text-white flex items-center justify-center shadow-md">
          {alertsCount}
        </span>
      )}
    </Button>
  </DropdownMenuTrigger>

  {/* Só mostra o conteúdo do dropdown se houver pelo menos 1 alerta */}
  {alertsCount > 0 && (
    <DropdownMenuContent className="w-72 p-2 shadow-lg bg-white">
      <DropdownMenuLabel className="text-base font-semibold text-gray-700 px-2">
        Notificações
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Exemplo de notificação */}
      <DropdownMenuItem className="flex items-start gap-3 px-2 py-3 hover:bg-blue-50 cursor-pointer">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-100 text-blue-600 font-bold">
          📩
        </span>
        <div className="flex flex-col">
          <p className="text-sm font-medium text-gray-800">
            Nova mensagem recebida
          </p>
          <span className="text-xs text-gray-500">há 2 minutos</span>
        </div>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Só mostra "Ver todas as notificações" se alertsCount > 2 */}
      {alertsCount > 2 && (
        <DropdownMenuItem
          onClick={() => setActiveSection(9)}
          className="text-center text-blue-600 font-medium py-2 cursor-pointer hover:bg-blue-50"
        >
          Ver todas as notificações
        </DropdownMenuItem>
      )}
    </DropdownMenuContent>
  )}
</DropdownMenu>

            
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenLogoutModal}
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