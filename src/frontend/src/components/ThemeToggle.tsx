import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '../hooks/useTheme';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="border-neon-green/30 transition-all duration-300 hover:bg-neon-green/10"
      title={theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'}
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-neon-green transition-transform duration-300 hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-neon-green transition-transform duration-300 hover:-rotate-12" />
      )}
    </Button>
  );
}
