'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    console.log('Tema atual:', theme, 'Tema resolvido:', resolvedTheme);
    if (resolvedTheme === 'dark') {
      setTheme('light');
      console.log('Mudando para claro');
    } else {
      setTheme('dark');
      console.log('Mudando para escuro');
    }
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="text-neutral-400 hover:text-orange-500"
        disabled
      >
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === 'light';

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="text-neutral-400 hover:text-orange-500 transition-colors"
      title={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
    >
      {isDark ? (
        <Sun className="h-4 w-4 transition-all" />
      ) : (
        <Moon className="h-4 w-4 transition-all" />
      )}
      <span className="sr-only">Alternar tema</span>
    </Button>
  );
}
