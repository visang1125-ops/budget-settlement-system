import DepartmentBarChart from "../DepartmentBarChart";

export default function DepartmentBarChartExample() {
  const mockData = [
    { department: "DX전략 Core", budget: 350000000, actual: 245000000, executionRate: 70 },
    { department: "서비스혁신 Core", budget: 420000000, actual: 294000000, executionRate: 70 },
    { department: "플랫폼혁신 Core", budget: 280000000, actual: 182000000, executionRate: 65 },
    { department: "백오피스혁신 Core", budget: 150000000, actual: 105000000, executionRate: 70 },
  ];

  return (
    <div className="p-6 bg-background">
      <DepartmentBarChart data={mockData} />
    </div>
  );
}
