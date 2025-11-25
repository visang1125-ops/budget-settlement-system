import ThemeToggle from "../ThemeToggle";
import { ThemeProvider } from "../ThemeProvider";

export default function ThemeToggleExample() {
  return (
    <ThemeProvider>
      <div className="p-6 bg-background">
        <div className="flex items-center gap-4">
          <p className="text-foreground">Toggle dark mode:</p>
          <ThemeToggle />
        </div>
      </div>
    </ThemeProvider>
  );
}
