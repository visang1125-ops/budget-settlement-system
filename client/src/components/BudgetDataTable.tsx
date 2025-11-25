import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Download, ChevronLeft, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, Loader2 } from "lucide-react";

export interface BudgetTableEntry {
  id: string;
  department: string;
  accountCategory: string;
  month: number;
  year: number;
  budgetAmount: number;
  actualAmount: number;
  executionRate: number;
}

interface BudgetDataTableProps {
  data: BudgetTableEntry[];
  onDownloadCSV?: () => void;
}

type SortField = "department" | "accountCategory" | "month" | "budgetAmount" | "actualAmount" | "executionRate";
type SortDirection = "asc" | "desc" | null;

export default function BudgetDataTable({ data, onDownloadCSV }: BudgetDataTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") setSortDirection("desc");
      else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    const aValue = a[sortField];
    const bValue = b[sortField];
    const modifier = sortDirection === "asc" ? 1 : -1;
    if (aValue < bValue) return -1 * modifier;
    if (aValue > bValue) return 1 * modifier;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(value);
  };

  const getExecutionRateBadge = (rate: number) => {
    if (rate >= 80) return <Badge className="bg-red-500 hover:bg-red-600 text-white text-xs">{rate.toFixed(1)}%</Badge>;
    if (rate >= 60) return <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-xs">{rate.toFixed(1)}%</Badge>;
    return <Badge className="bg-green-500 hover:bg-green-600 text-white text-xs">{rate.toFixed(1)}%</Badge>;
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    return <ArrowDown className="h-4 w-4" />;
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    onDownloadCSV?.();
    setIsDownloading(false);
  };

  return (
    <Card className="shadow-lg" data-testid="card-budget-table">
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card-foreground/5 to-transparent rounded-t-lg" />
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 space-y-0">
        <div>
          <CardTitle className="text-lg font-semibold">지출 내역</CardTitle>
          <CardDescription>부서별 계정과목 지출 상세</CardDescription>
        </div>
        <Button 
          variant="outline" 
          onClick={handleDownload}
          disabled={isDownloading}
          className="gap-2 min-h-[44px] self-start sm:self-auto"
          data-testid="button-download-csv"
        >
          {isDownloading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {isDownloading ? "다운로드 중..." : "CSV 다운로드"}
        </Button>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("department")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-department"
                  >
                    부서
                    <SortIcon field="department" />
                  </Button>
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("accountCategory")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-account"
                  >
                    계정과목
                    <SortIcon field="accountCategory" />
                  </Button>
                </TableHead>
                <TableHead>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("month")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-month"
                  >
                    월
                    <SortIcon field="month" />
                  </Button>
                </TableHead>
                <TableHead className="text-right hidden sm:table-cell">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("budgetAmount")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-budget"
                  >
                    예산
                    <SortIcon field="budgetAmount" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("actualAmount")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-actual"
                  >
                    실제
                    <SortIcon field="actualAmount" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleSort("executionRate")}
                    className="gap-1 min-h-[44px] font-medium"
                    data-testid="button-sort-execution"
                  >
                    집행률
                    <SortIcon field="executionRate" />
                  </Button>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((entry) => (
                <TableRow key={entry.id} className="min-h-[56px]" data-testid={`row-budget-${entry.id}`}>
                  <TableCell className="font-medium py-3">{entry.department.replace(' Core', '').replace(' Group', '')}</TableCell>
                  <TableCell className="text-sm hidden md:table-cell py-3">{entry.accountCategory}</TableCell>
                  <TableCell className="py-3">{entry.month}월</TableCell>
                  <TableCell className="text-right font-mono hidden sm:table-cell py-3">{formatCurrency(entry.budgetAmount)}</TableCell>
                  <TableCell className="text-right font-mono py-3">{formatCurrency(entry.actualAmount)}</TableCell>
                  <TableCell className="text-right py-3">{getExecutionRateBadge(entry.executionRate)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-sm text-muted-foreground order-2 sm:order-1">
            {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedData.length)} / {sortedData.length}개 항목
          </div>
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="min-h-[44px] min-w-[44px]"
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-[80px] text-center">
              {currentPage} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="min-h-[44px] min-w-[44px]"
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
