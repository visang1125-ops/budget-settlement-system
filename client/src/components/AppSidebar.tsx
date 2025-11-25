import { useState } from "react";
import { 
  LayoutDashboard, 
  BarChart3, 
  PieChart, 
  Table2,
  Settings,
  FileText,
  Filter,
  Calendar,
  Building2,
  FolderOpen,
  RotateCcw,
  Check,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export interface FilterState {
  startMonth: number;
  endMonth: number;
  year: number;
  departments: string[];
  accountCategories: string[];
}

interface AppSidebarProps {
  onApplyFilters?: (filters: FilterState) => void;
  onResetFilters?: () => void;
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

const menuItems = [
  { title: "대시보드", icon: LayoutDashboard, url: "#dashboard" },
  { title: "부서별 분석", icon: BarChart3, url: "#department" },
  { title: "계정과목별 분석", icon: PieChart, url: "#account" },
  { title: "상세 내역", icon: Table2, url: "#details" },
  { title: "보고서", icon: FileText, url: "#reports" },
  { title: "설정", icon: Settings, url: "#settings" },
];

export default function AppSidebar({ onApplyFilters, onResetFilters }: AppSidebarProps) {
  const [filters, setFilters] = useState<FilterState>({
    startMonth: 1,
    endMonth: 12,
    year: 2025,
    departments: DEPARTMENTS,
    accountCategories: ACCOUNT_CATEGORIES,
  });
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleApply = async () => {
    setIsApplying(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    onApplyFilters?.(filters);
    setIsApplying(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleReset = () => {
    const resetFilters = {
      startMonth: 1,
      endMonth: 12,
      year: 2025,
      departments: DEPARTMENTS,
      accountCategories: ACCOUNT_CATEGORIES,
    };
    setFilters(resetFilters);
    onResetFilters?.();
  };

  return (
    <Sidebar data-testid="sidebar-main">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-base font-bold px-4 py-4 text-primary">
            예산 관리 시스템
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="min-h-[44px]">
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase()}`}>
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2 px-4 py-2">
            <Filter className="h-4 w-4 text-primary" />
            <span className="font-semibold">필터</span>
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-4">
            <ScrollArea className="h-[calc(100vh-400px)] pr-2">
              <div className="space-y-4">
                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors min-h-[44px]">
                    <Calendar className="h-4 w-4" />
                    기간 설정
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 pl-6 pt-2">
                    <div>
                      <Label className="text-xs text-muted-foreground mb-1.5 block">연도</Label>
                      <Select 
                        value={filters.year.toString()} 
                        onValueChange={(v) => setFilters(prev => ({ ...prev, year: parseInt(v) }))}
                      >
                        <SelectTrigger className="min-h-[44px]" data-testid="select-year">
                          <SelectValue placeholder="연도" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2024">2024년</SelectItem>
                          <SelectItem value="2025">2025년</SelectItem>
                          <SelectItem value="2026">2026년</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">시작</Label>
                        <Select 
                          value={filters.startMonth.toString()} 
                          onValueChange={(v) => setFilters(prev => ({ ...prev, startMonth: parseInt(v) }))}
                        >
                          <SelectTrigger className="min-h-[44px]" data-testid="select-start-month">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs text-muted-foreground mb-1.5 block">종료</Label>
                        <Select 
                          value={filters.endMonth.toString()} 
                          onValueChange={(v) => setFilters(prev => ({ ...prev, endMonth: parseInt(v) }))}
                        >
                          <SelectTrigger className="min-h-[44px]" data-testid="select-end-month">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <SelectItem key={month} value={month.toString()}>{month}월</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors min-h-[44px]">
                    <Building2 className="h-4 w-4" />
                    부서
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pl-6 pt-2">
                    {DEPARTMENTS.map(dept => (
                      <div key={dept} className="flex items-center gap-3 min-h-[36px]">
                        <Checkbox 
                          id={dept}
                          checked={filters.departments.includes(dept)}
                          onCheckedChange={() => handleDepartmentToggle(dept)}
                          className="h-5 w-5"
                          data-testid={`checkbox-dept-${dept}`}
                        />
                        <label htmlFor={dept} className="text-sm cursor-pointer flex-1 leading-tight">
                          {dept.replace(' Core', '').replace(' Group', '')}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>

                <Collapsible defaultOpen>
                  <CollapsibleTrigger className="flex items-center gap-2 w-full py-2 text-sm font-medium hover:text-primary transition-colors min-h-[44px]">
                    <FolderOpen className="h-4 w-4" />
                    계정과목
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-2 pl-6 pt-2">
                    {ACCOUNT_CATEGORIES.map(category => (
                      <div key={category} className="flex items-center gap-3 min-h-[36px]">
                        <Checkbox 
                          id={category}
                          checked={filters.accountCategories.includes(category)}
                          onCheckedChange={() => handleAccountCategoryToggle(category)}
                          className="h-5 w-5"
                          data-testid={`checkbox-category-${category}`}
                        />
                        <label htmlFor={category} className="text-sm cursor-pointer flex-1 leading-tight">
                          {category}
                        </label>
                      </div>
                    ))}
                  </CollapsibleContent>
                </Collapsible>
              </div>
            </ScrollArea>

            <div className="flex gap-2 pt-4 pb-2">
              <Button 
                onClick={handleApply} 
                className="flex-1 gap-2 min-h-[44px] font-medium"
                disabled={isApplying}
                data-testid="button-apply-filters"
              >
                {isApplying ? (
                  <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                ) : showSuccess ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Filter className="h-4 w-4" />
                )}
                {isApplying ? "적용 중..." : showSuccess ? "완료" : "적용"}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleReset}
                className="min-h-[44px] min-w-[44px]"
                data-testid="button-reset-filters"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
