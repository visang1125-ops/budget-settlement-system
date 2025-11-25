import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, Percent, TrendingUp, Target, RefreshCw, FileDown, FileJson } from "lucide-react";
import { Button } from "@/components/ui/button";
import KPICard from "@/components/KPICard";
import DepartmentBarChart from "@/components/DepartmentBarChart";
import ExecutionRateLineChart from "@/components/ExecutionRateLineChart";
import BudgetDonutChart from "@/components/BudgetDonutChart";
import BudgetDataTable, { type BudgetTableEntry } from "@/components/BudgetDataTable";
import LoadingSpinner from "@/components/LoadingSpinner";
import StatusMessage from "@/components/StatusMessage";
import type { FilterState } from "@/components/AppSidebar";

const SETTLEMENT_MONTH = 9;

interface DashboardProps {
  filters?: FilterState;
}

export default function Dashboard({ filters }: DashboardProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadType, setDownloadType] = useState<string>("");

  // Build query string from filters
  const buildQueryString = () => {
    if (!filters) return "";
    const params = new URLSearchParams();
    if (filters.startMonth) params.append("startMonth", filters.startMonth.toString());
    if (filters.endMonth) params.append("endMonth", filters.endMonth.toString());
    if (filters.year) params.append("year", filters.year.toString());
    filters.departments?.forEach(d => params.append("departments", d));
    filters.accountCategories?.forEach(c => params.append("accountCategories", c));
    return params.toString();
  };

  const queryString = buildQueryString();
  const queryKey = ["/api/budget", queryString];

  const { data: budgetData = [], isLoading, isRefetching, refetch } = useQuery<BudgetTableEntry[]>({
    queryKey,
    queryFn: async () => {
      const url = queryString ? `/api/budget?${queryString}` : "/api/budget";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch budget data");
      return response.json();
    },
  });

  const handleRefresh = () => {
    refetch();
  };

  // Calculate statistics
  const settledData = budgetData.filter(item => item.month <= SETTLEMENT_MONTH);
  const totalBudget = budgetData.reduce((sum, item) => sum + item.budgetAmount, 0);
  const settledBudget = settledData.reduce((sum, item) => sum + item.budgetAmount, 0);
  const totalActual = budgetData.reduce((sum, item) => sum + item.actualAmount, 0);
  const executionRate = settledBudget > 0 ? (totalActual / settledBudget) * 100 : 0;
  const monthsElapsed = SETTLEMENT_MONTH;
  const projectedAnnual = monthsElapsed > 0 ? (totalActual / monthsElapsed) * 12 : 0;
  const remainingBudget = totalBudget - totalActual;

  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `₩${(value / 1000000000).toFixed(1)}B`;
    if (value >= 1000000) return `₩${(value / 1000000).toFixed(0)}M`;
    return `₩${(value / 1000).toFixed(0)}K`;
  };

  // Department chart data
  const departmentData = Array.from(
    budgetData.reduce((acc, entry) => {
      const existing = acc.get(entry.department) || { budget: 0, actual: 0 };
      acc.set(entry.department, {
        budget: existing.budget + entry.budgetAmount,
        actual: existing.actual + entry.actualAmount,
      });
      return acc;
    }, new Map<string, { budget: number; actual: number }>())
  ).map(([department, values]) => ({
    department,
    budget: values.budget,
    actual: values.actual,
    executionRate: values.budget > 0 ? (values.actual / values.budget) * 100 : 0,
  }));

  // Monthly execution rate data
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const monthData = budgetData.filter(entry => entry.month <= month && entry.month <= SETTLEMENT_MONTH);
    const monthBudgetData = budgetData.filter(entry => entry.month <= Math.min(month, SETTLEMENT_MONTH));
    const monthBudget = monthBudgetData.reduce((sum, item) => sum + item.budgetAmount, 0);
    const monthActual = monthData.reduce((sum, item) => sum + item.actualAmount, 0);
    return {
      month: `${month}월`,
      executionRate: month <= SETTLEMENT_MONTH ? (monthBudget > 0 ? (monthActual / monthBudget) * 100 : 0) : null,
      targetRate: (month / 12) * 100,
      isProjected: month > SETTLEMENT_MONTH,
    };
  });

  // Donut chart data
  const donutData = [
    { name: "실제 집행", value: totalActual, color: "hsl(142, 71%, 45%)" },
    { name: "잔여 예산", value: remainingBudget, color: "hsl(217, 91%, 50%)" },
  ];

  const showSuccessMessage = (type: string) => {
    setDownloadType(type);
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  const handleDownloadCSV = async () => {
    try {
      const response = await fetch("/api/budget/export/csv");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budget_data_${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
      showSuccessMessage("CSV");
    } catch (error) {
      console.error("Failed to download CSV:", error);
    }
  };

  const handleDownloadJSON = async () => {
    try {
      const response = await fetch("/api/budget/export/json");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `budget_data_${new Date().toISOString().split("T")[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      showSuccessMessage("JSON");
    } catch (error) {
      console.error("Failed to download JSON:", error);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await fetch("/api/budget/template/csv");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "budget_template.csv";
      link.click();
      URL.revokeObjectURL(url);
      showSuccessMessage("템플릿");
    } catch (error) {
      console.error("Failed to download template:", error);
    }
  };

  const handleTableDownloadCSV = () => {
    // Download filtered data as CSV
    const headers = ["부서", "계정과목", "월", "연도", "예산", "실제", "집행률"];
    const csvData = budgetData.map(entry => [
      entry.department,
      entry.accountCategory,
      entry.month,
      entry.year,
      entry.budgetAmount,
      entry.actualAmount,
      entry.executionRate.toFixed(2),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `budget_filtered_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    showSuccessMessage("필터링된 CSV");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" text="데이터를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            예산 및 결산 대시보드
          </h1>
          <p className="text-muted-foreground mt-1">
            {filters ? `${filters.year}년 ${filters.startMonth}월 ~ ${filters.endMonth}월` : "2025년 1월 ~ 12월"} | 결산 마감: {SETTLEMENT_MONTH}월
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleDownloadTemplate}
            className="gap-2 min-h-[44px]"
            data-testid="button-download-template"
          >
            <FileDown className="h-4 w-4" />
            <span className="hidden sm:inline">템플릿</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleDownloadJSON}
            className="gap-2 min-h-[44px]"
            data-testid="button-download-json"
          >
            <FileJson className="h-4 w-4" />
            <span className="hidden sm:inline">JSON</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={handleRefresh}
            disabled={isRefetching}
            className="gap-2 min-h-[44px]"
            data-testid="button-refresh"
          >
            <RefreshCw className={`h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{isRefetching ? "갱신 중..." : "새로고침"}</span>
          </Button>
        </div>
      </div>

      {downloadSuccess && (
        <StatusMessage 
          type="success" 
          title="다운로드 완료" 
          message={`${downloadType} 파일이 성공적으로 다운로드되었습니다.`}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <KPICard
          title="총 예산"
          value={formatCurrency(totalBudget)}
          subtitle="연간 전체"
          icon={DollarSign}
          trend="neutral"
          colorScheme="blue"
        />
        <KPICard
          title="집행률"
          value={`${executionRate.toFixed(1)}%`}
          subtitle={`${monthsElapsed}개월 기준`}
          icon={Percent}
          trend={executionRate > 75 ? "up" : executionRate > 60 ? "neutral" : "down"}
          trendValue={executionRate > 75 ? "높음" : executionRate > 60 ? "보통" : "낮음"}
          colorScheme="green"
        />
        <KPICard
          title="연간 예상"
          value={formatCurrency(projectedAnnual)}
          subtitle="현재 집행률 기준"
          icon={TrendingUp}
          trend={projectedAnnual < totalBudget ? "down" : "up"}
          trendValue={projectedAnnual < totalBudget ? "예산 내" : "초과 예상"}
          colorScheme="orange"
        />
        <KPICard
          title="잔여 예산"
          value={formatCurrency(remainingBudget)}
          subtitle="미집행 금액"
          icon={Target}
          trend="neutral"
          colorScheme="purple"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <DepartmentBarChart data={departmentData} />
        <ExecutionRateLineChart data={monthlyData} settlementMonth={SETTLEMENT_MONTH} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        <BudgetDonutChart data={donutData} />
      </div>

      <BudgetDataTable 
        data={budgetData}
        onDownloadCSV={handleTableDownloadCSV}
      />
    </div>
  );
}
