import React, { Profiler, ProfilerOnRenderCallback } from "react";
import StockRowIndividual from "./StockRow.individual";

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

const StockListIndividual: React.FC<StockListProps> = ({ stocks, handleAction, onRenderTable }) => {
  const handleButtonClick = (symbol: string) => {
    console.time(`Button interaction for ${symbol}`);
    handleAction(symbol);
    console.timeEnd(`Button interaction for ${symbol}`);
  };

  return (
    <div className="overflow-x-auto">
      <Profiler id="StockListIndividualTable" onRender={onRenderTable as ProfilerOnRenderCallback}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Symbol
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stocks.map((stock) => (
              <StockRowIndividual
              key={stock.id}
              stock={stock}
              handleAction={handleAction}
            />
            ))}
          </tbody>
        </table>
      </Profiler>
    </div>
  );
};

export default StockListIndividual;
