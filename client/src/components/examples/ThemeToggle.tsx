import { ThemeToggle } from '../ThemeToggle';
import { ThemeProvider } from '@/lib/theme-provider';

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <ThemeToggle />
      </div>
    </ThemeProvider>
  );
}
