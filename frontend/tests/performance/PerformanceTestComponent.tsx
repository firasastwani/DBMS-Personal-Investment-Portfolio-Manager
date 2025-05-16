import React, { useState, useEffect, Profiler, ProfilerOnRenderCallback } from "react";
import StockList from "../../src/components/StockList";
import StockListIndividual from "../../src/components/StockList.individual";

interface Stock {
    id: number;
    symbol: string;
    name: string;
    staticPrice: number;
}

type SchedulerInteraction = {
    id: number;
    name: string;
    timestamp: number;
};

const PerformanceTest: React.FC = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  const onRenderCallback = (
    id: string,
    phase: 'mount' | 'update',
    actualDuration: number,
    baseDuration: number,
    startTime: number,
    commitTime: number,
    interactions: Set<SchedulerInteraction>
  ) => {
    console.log(`${id} ${phase} took ${actualDuration}ms`);
    interactions.forEach(interaction => {
      console.log(`Interaction: ${interaction.name}`);
    });
  };

  useEffect(() => {
    const stocks = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      symbol: `STK${i}`,
      name: `Company ${i}`,
      staticPrice: Math.random() * 10000
    }));

    setStocks(stocks);
    setLoading(false);
  }, []);
  
  const handleAction = (symbol: string) => {
    console.log(`Action for ${symbol}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Individual Handlers</h2>
        <Profiler id="StockListIndividual" onRender={onRenderCallback as ProfilerOnRenderCallback}>
          <StockListIndividual stocks={stocks} handleAction={handleAction} />
        </Profiler>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-2">Event Delegation</h2>
        <Profiler id="StockList" onRender={onRenderCallback as ProfilerOnRenderCallback}>
          <StockList stocks={stocks} handleAction={handleAction} />
        </Profiler>
      </div>
    </div>
  );
};

export default PerformanceTest;