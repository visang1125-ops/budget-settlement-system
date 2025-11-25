import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";

interface MonthlyExecutionData {
  month: string;
  executionRate: number | null;
  targetRate: number;
  isProjected?: boolean;
}

interface ExecutionRateLineChartProps {
  data: MonthlyExecutionData[];
  settlementMonth?: number;
}

export default function ExecutionRateLineChart({ data, settlementMonth = 9 }: ExecutionRateLineChartProps) {
  return (
    <Card className="shadow-lg" data-testid="card-execution-chart">
      <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-card-foreground/5 to-transparent rounded-t-lg" />
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div>
          <CardTitle className="text-lg font-semibold">월별 집행률 추이</CardTitle>
          <CardDescription>시간 경과에 따른 예산 집행률 변화</CardDescription>
        </div>
        <Badge variant="outline" className="text-xs">
          결산 마감: {settlementMonth}월
        </Badge>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="executionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 91%, 50%)" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(0, 0%, 60%)" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(0, 0%, 60%)" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
            <XAxis 
              dataKey="month" 
              stroke="hsl(var(--foreground))"
              fontSize={12}
            />
            <YAxis 
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
              formatter={(value: any, name: string) => {
                if (value === null || value === undefined) return ["미결산", name];
                return [`${Number(value).toFixed(1)}%`, name];
              }}
            />
            <ReferenceLine 
              x={`${settlementMonth}월`}
              stroke="hsl(0, 85%, 55%)"
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: "결산 마감", 
                position: "top",
                fill: "hsl(0, 85%, 55%)",
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="executionRate"
              stroke="hsl(217, 91%, 50%)"
              strokeWidth={3}
              fill="url(#executionGradient)"
              name="실제 집행률"
              dot={{ fill: "hsl(217, 91%, 50%)", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="targetRate"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="목표 집행률"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">실제 집행률</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-muted-foreground" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">목표 집행률</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-0.5 bg-red-500" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">결산 마감선</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
