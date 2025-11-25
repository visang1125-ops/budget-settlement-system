import BudgetDataTable from "../BudgetDataTable";

export default function BudgetDataTableExample() {
  const mockData = Array.from({ length: 25 }, (_, i) => ({
    id: `entry-${i + 1}`,
    department: ["DX전략 Core Group", "서비스혁신 Core", "플랫폼혁신 Core", "백오피스혁신 Core"][i % 4],
    accountCategory: ["광고선전비(이벤트)", "통신비", "지급수수료", "지급수수료(은행수수료)", "지급수수료(외부용역,자문료)"][i % 5],
    month: (i % 9) + 1,
    year: 2025,
    budgetAmount: Math.floor(Math.random() * 50000000) + 10000000,
    actualAmount: Math.floor(Math.random() * 40000000) + 5000000,
    executionRate: Math.random() * 40 + 50,
  }));

  const handleDownload = () => {
    console.log("CSV download triggered");
  };

  return (
    <div className="p-6 bg-background">
      <BudgetDataTable data={mockData} onDownloadCSV={handleDownload} />
    </div>
  );
}
