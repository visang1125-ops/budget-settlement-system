import { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import AppSidebar, { type FilterState } from "@/components/AppSidebar";
import Dashboard from "@/pages/Dashboard";
import NotFound from "@/pages/not-found";

const DEPARTMENTS = [
  "DX전략 Core Group",
  "서비스혁신 Core",
  "플랫폼혁신 Core",
  "백오피스혁신 Core",
];

const ACCOUNT_CATEGORIES = [
  "광고선전비(이벤트)",
  "통신비",
  "지급수수료",
  "지급수수료(은행수수료)",
  "지급수수료(외부용역,자문료)",
  "지급수수료(유지보수료)",
  "지급수수료(저작료)",
  "지급수수료(제휴)",
];

export default function App() {
  const [filters, setFilters] = useState<FilterState>({
    startMonth: 1,
    endMonth: 12,
    year: 2025,
    departments: DEPARTMENTS,
    accountCategories: ACCOUNT_CATEGORIES,
  });

  const style = {
    "--sidebar-width": "18rem",
    "--sidebar-width-icon": "3.5rem",
  };

  const handleApplyFilters = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      startMonth: 1,
      endMonth: 12,
      year: 2025,
      departments: DEPARTMENTS,
      accountCategories: ACCOUNT_CATEGORIES,
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex h-screen w-full overflow-hidden bg-background">
              <AppSidebar 
                onApplyFilters={handleApplyFilters}
                onResetFilters={handleResetFilters}
              />
              <div className="flex flex-col flex-1 overflow-hidden">
                <header className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-10">
                  <div className="flex items-center gap-3">
                    <SidebarTrigger className="min-h-[44px] min-w-[44px]" data-testid="button-sidebar-toggle" />
                    <h2 className="text-lg font-semibold text-foreground hidden sm:block">예산 관리</h2>
                  </div>
                  <ThemeToggle />
                </header>
                <main className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <Switch>
                    <Route path="/">
                      <Dashboard filters={filters} />
                    </Route>
                    <Route component={NotFound} />
                  </Switch>
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
