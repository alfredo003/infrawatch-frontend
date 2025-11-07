'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/app/dashboard/DashboardLayout';
import LogoutModal from '@/components/LogoutModal';
import Loading from '@/components/Loading';

export default function InfraWatchDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { signOut, user, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (user?.status === 'block' || user?.status === 'registered') {
      router.push('/verify');
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isLoading, isAuthenticated, router]);

  const handleOpenLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    setIsLogoutModalOpen(false);
  };

  const handleLogout = () => {
    toast({
      title: 'Sessão Terminada',
      description: 'Você foi desconectado com sucesso.',
      variant: 'default',
    });
    signOut();
    setIsLogoutModalOpen(false);
  };

  if (!mounted || isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <DashboardLayout
        sidebarCollapsed={sidebarCollapsed}
        activeSection={activeSection}
        user={user}
        setSidebarCollapsed={setSidebarCollapsed}
        setActiveSection={setActiveSection}
        handleOpenLogoutModal={handleOpenLogoutModal}
      />
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleCloseLogoutModal}
        onConfirm={handleLogout}
      />
    </>
  );
}
