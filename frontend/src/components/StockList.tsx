import React, { useCallback, Profiler, ProfilerOnRenderCallback } from "react";
import StockRow from "./StockRow";

interface Stock {
  id: number;
  symbol: string;
  name: string;
  staticPrice: number;
}

interface StockListProps {
  stocks: Stock[];
  handleAction: (symbol: string) => void;
  onRenderTable?: ProfilerOnRenderCallback; // Profiler callback for table
}

const StockList: React.FC<StockListProps> = ({ stocks, handleAction, onRenderTable }) => {
  const handleTableClick = useCallback((event: React.MouseEvent<HTMLTableElement>) => {
    const target = event.target as HTMLElement;
    const button = target.closest("button[data-action='add-to-watchlist']");
    if (button) {
      const row = button.closest("tr");
      const symbol = row?.getAttribute("data-symbol");

      if (symbol) {
        console.time(`Button interaction for ${symbol}`);
        handleAction(symbol);
        console.timeEnd(`Button interaction for ${symbol}`);
      }
    }
  }, [handleAction]);

  return (
    <div className="overflow-x-auto">
      <Profiler id="StockListTable" onRender={onRenderTable as ProfilerOnRenderCallback}>
        <table className="min-w-full divide-y divide-gray-200" onClick={handleTableClick}>
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <StockRow key={stock.id} stock={stock} />
            ))}
          </tbody>
        </table>
      </Profiler>
    </div>
  );
};

export default StockList;
