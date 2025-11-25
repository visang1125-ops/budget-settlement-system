import FilterPanel from "../FilterPanel";

export default function FilterPanelExample() {
  const handleApplyFilters = (filters: any) => {
    console.log("Filters applied:", filters);
  };

  const handleResetFilters = () => {
    console.log("Filters reset");
  };

  return (
    <div className="p-6 bg-background max-w-sm">
      <FilterPanel 
        onApplyFilters={handleApplyFilters}
        onResetFilters={handleResetFilters}
      />
    </div>
  );
}
