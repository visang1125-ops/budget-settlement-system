import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, RotateCcw } from "lucide-react";

export interface FilterState {
  startMonth: number;
  endMonth: number;
  year: number;
  departments: string[];
  accountCategories: string[];
}

interface FilterPanelProps {
  onApplyFilters: (filters: FilterState) => void;
  onResetFilters: () => void;
}

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

export default function FilterPanel({ onApplyFilters, onResetFilters }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterState>({
    startMonth: 1,
    endMonth: 9,
    year: 2025,
    departments: DEPARTMENTS,
    accountCategories: ACCOUNT_CATEGORIES,
  });

  const handleDepartmentToggle = (dept: string) => {
    setFilters(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept],
    }));
  };

  const handleAccountCategoryToggle = (category: string) => {
    setFilters(prev => ({
      ...prev,
      accountCategories: prev.accountCategories.includes(category)
        ? prev.accountCategories.filter(c => c !== category)
        : [...prev.accountCategories, category],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    console.log("Filters applied:", filters);
  };

  const handleReset = () => {
    const resetFilters = {
      startMonth: 1,
      endMonth: 9,
      year: 2025,
      departments: DEPARTMENTS,
      accountCategories: ACCOUNT_CATEGORIES,
    };
    setFilters(resetFilters);
    onResetFilters();
    console.log("Filters reset");
  };

  return (
    <Card className="shadow-lg" data-testid="card-filters">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          필터
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>기간 설정</Label>
          <div className="space-y-2">
            <Select 
              value={filters.year.toString()} 
              onValueChange={(v) => setFilters(prev => ({ ...prev, year: parseInt(v) }))}
            >
              <SelectTrigger data-testid="select-year">
                <SelectValue placeholder="연도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024년</SelectItem>
                <SelectItem value="2025">2025년</SelectItem>
                <SelectItem value="2026">2026년</SelectItem>
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 gap-2">
              <Select 
                value={filters.startMonth.toString()} 
                onValueChange={(v) => setFilters(prev => ({ ...prev, startMonth: parseInt(v) }))}
              >
                <SelectTrigger data-testid="select-start-month">
                  <SelectValue placeholder="시작월" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select 
                value={filters.endMonth.toString()} 
                onValueChange={(v) => setFilters(prev => ({ ...prev, endMonth: parseInt(v) }))}
              >
                <SelectTrigger data-testid="select-end-month">
                  <SelectValue placeholder="종료월" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                    <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Label>부서</Label>
          <div className="space-y-2">
            {DEPARTMENTS.map(dept => (
              <div key={dept} className="flex items-center gap-2">
                <Checkbox 
                  id={dept}
                  checked={filters.departments.includes(dept)}
                  onCheckedChange={() => handleDepartmentToggle(dept)}
                  data-testid={`checkbox-dept-${dept}`}
                />
                <label htmlFor={dept} className="text-sm cursor-pointer">
                  {dept.replace(' Core', '').replace(' Group', '')}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>계정과목</Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {ACCOUNT_CATEGORIES.map(category => (
              <div key={category} className="flex items-center gap-2">
                <Checkbox 
                  id={category}
                  checked={filters.accountCategories.includes(category)}
                  onCheckedChange={() => handleAccountCategoryToggle(category)}
                  data-testid={`checkbox-category-${category}`}
                />
                <label htmlFor={category} className="text-sm cursor-pointer">
                  {category}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleApply} 
            className="flex-1 gap-2"
            data-testid="button-apply-filters"
          >
            <Filter className="h-4 w-4" />
            적용
          </Button>
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="gap-2"
            data-testid="button-reset-filters"
          >
            <RotateCcw className="h-4 w-4" />
            초기화
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
