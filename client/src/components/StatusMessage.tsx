import { CheckCircle2, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusMessageProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  className?: string;
}

export default function StatusMessage({ type, title, message, className }: StatusMessageProps) {
  const config = {
    success: {
      icon: CheckCircle2,
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      iconColor: "text-green-600 dark:text-green-400",
      titleColor: "text-green-800 dark:text-green-300",
    },
    error: {
      icon: XCircle,
      bg: "bg-red-50 dark:bg-red-950/30",
      border: "border-red-200 dark:border-red-800",
      iconColor: "text-red-600 dark:text-red-400",
      titleColor: "text-red-800 dark:text-red-300",
    },
    warning: {
      icon: AlertCircle,
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      iconColor: "text-amber-600 dark:text-amber-400",
      titleColor: "text-amber-800 dark:text-amber-300",
    },
    info: {
      icon: Info,
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      iconColor: "text-blue-600 dark:text-blue-400",
      titleColor: "text-blue-800 dark:text-blue-300",
    },
  };

  const { icon: Icon, bg, border, iconColor, titleColor } = config[type];

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border",
        bg, border, className
      )}
      role="alert"
    >
      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", iconColor)} />
      <div>
        <p className={cn("font-medium", titleColor)}>{title}</p>
        {message && <p className="text-sm text-muted-foreground mt-1">{message}</p>}
      </div>
    </div>
  );
}
