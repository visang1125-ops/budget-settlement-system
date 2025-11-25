import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface BudgetComparisonData {
  name: string;
  value: number;
  color: string;
}

interface BudgetDonutChartProps {
  data: BudgetComparisonData[];
}

export default function BudgetDonutChart({ data }: BudgetDonutChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const formatCurrency = (value: number) => {
    if (value >= 1000000000) return `₩${(value / 1000000000).toFixed(2)}B`;
    if (value >= 1000000) return `₩${(value / 1000000).toFixed(0)}M`;
    return `₩${(value / 1000).toFixed(0)}K`;
  };

  return (
    <Card className="shadow-lg" data-testid="card-donut-chart">
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card-foreground/5 to-transparent rounded-t-lg" />
      <CardHeader>
        <CardTitle className="text-lg font-semibold">예산 vs 실제 비교</CardTitle>
        <CardDescription>전체 예산 대비 실제 집행 현황</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <defs>
              {data.map((entry, index) => (
                <linearGradient key={`gradient-${index}`} id={`donutGradient${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                  <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                </linearGradient>
              ))}
            </defs>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={`url(#donutGradient${index})`} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry: any) => (
                <span className="text-sm">
                  {value}: {formatCurrency(entry.payload.value)}
                </span>
              )}
            />
            <text
              x="50%"
              y="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-foreground font-bold text-xl"
            >
              {formatCurrency(total)}
            </text>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground text-xs"
            >
              총 합계
            </text>
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
