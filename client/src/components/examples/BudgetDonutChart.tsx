import BudgetDonutChart from "../BudgetDonutChart";

export default function BudgetDonutChartExample() {
  const mockData = [
    { name: "실제 집행", value: 826000000, color: "hsl(142, 71%, 45%)" },
    { name: "잔여 예산", value: 374000000, color: "hsl(217, 91%, 48%)" },
  ];

  return (
    <div className="p-6 bg-background">
      <BudgetDonutChart data={mockData} />
    </div>
  );
}
