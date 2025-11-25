import KPICard from "../KPICard";
import { DollarSign, Percent, TrendingUp, Target } from "lucide-react";

export default function KPICardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-background">
      <KPICard
        title="총 예산"
        value="₩1.2B"
        subtitle="2025년 전체"
        icon={DollarSign}
        trend="up"
        trendValue="+12%"
        colorScheme="blue"
      />
      <KPICard
        title="집행률"
        value="68.5%"
        subtitle="9개월 기준"
        icon={Percent}
        trend="up"
        trendValue="+5.2%"
        colorScheme="green"
      />
      <KPICard
        title="연간 예상"
        value="₩982M"
        subtitle="현재 집행률 기준"
        icon={TrendingUp}
        trend="down"
        trendValue="-8%"
        colorScheme="orange"
      />
      <KPICard
        title="예산 대비"
        value="₩218M"
        subtitle="잔여 예산"
        icon={Target}
        trend="neutral"
        colorScheme="purple"
      />
    </div>
  );
}
