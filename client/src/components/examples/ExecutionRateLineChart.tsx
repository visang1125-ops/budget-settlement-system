import ExecutionRateLineChart from "../ExecutionRateLineChart";

export default function ExecutionRateLineChartExample() {
  const mockData = [
    { month: "1월", executionRate: 8.2, targetRate: 8.3 },
    { month: "2월", executionRate: 16.5, targetRate: 16.7 },
    { month: "3월", executionRate: 25.1, targetRate: 25.0 },
    { month: "4월", executionRate: 33.8, targetRate: 33.3 },
    { month: "5월", executionRate: 42.3, targetRate: 41.7 },
    { month: "6월", executionRate: 50.6, targetRate: 50.0 },
    { month: "7월", executionRate: 58.4, targetRate: 58.3 },
    { month: "8월", executionRate: 65.7, targetRate: 66.7 },
    { month: "9월", executionRate: 68.5, targetRate: 75.0 },
  ];

  return (
    <div className="p-6 bg-background">
      <ExecutionRateLineChart data={mockData} />
    </div>
  );
}
