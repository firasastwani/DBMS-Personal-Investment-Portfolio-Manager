    "use client";

    import React, { useState, useEffect, useRef, Profiler, ProfilerOnRenderCallback } from "react";
    import StockList from "../../../src/components/StockList";
    import StockListIndividual from "../../../src/components/StockList.individual";

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
    const [metrics, setMetrics] = useState<{
        individual: { mount: number | null; updates: number[] };
        delegation: { mount: number | null; updates: number[] };
    }>({
        individual: { mount: null, updates: [] },
        delegation: { mount: null, updates: [] },
    });
    const [testRunning, setTestRunning] = useState(false);

    const metricsRef = useRef<{
        individual: {
        mount: number | null;
        updates: number[];
        };
        delegation: {
        mount: number | null;
        updates: number[];
        };
    }>({
        individual: { mount: null, updates: [] },
        delegation: { mount: null, updates: [] },
    });

    const onRenderCallback = (
        id: string,
        phase: "mount" | "update",
        actualDuration: number
    ) => {
        if (id === "StockListIndividual") {
        if (phase === "mount") {
            metricsRef.current.individual.mount = actualDuration;
        } else {
            metricsRef.current.individual.updates.push(actualDuration);
        }
        } else if (id === "StockList") {
        if (phase === "mount") {
            metricsRef.current.delegation.mount = actualDuration;
        } else {
            metricsRef.current.delegation.updates.push(actualDuration);
        }
        }
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

    const runPerformanceTest = () => {
        setTestRunning(true);
        setMetrics({
        individual: { mount: null, updates: [] },
        delegation: { mount: null, updates: [] },
        });
        
        // Simulate rapid interactions after a brief delay
        setTimeout(() => {
        const buttons = document.querySelectorAll('.stock-item button');
        // Click 50 random buttons to test update performance
        for (let i = 0; i < 50; i++) {
            const randomIndex = Math.floor(Math.random() * buttons.length);
            (buttons[randomIndex] as HTMLElement)?.click();
        }
        setTestRunning(false);
        }, 500);
    };

    const calculateAverage = (numbers: number[]) => {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((a, b) => a + b, 0);
        return (sum / numbers.length).toFixed(2);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading stock data...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Stock List Performance Comparison</h1>
        <p className="mb-6">Testing {stocks.length} stock items</p>
        
        <button 
            onClick={runPerformanceTest}
            disabled={testRunning}
            className={`px-4 py-2 rounded mb-6 ${testRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
        >
            {testRunning ? 'Test in progress...' : 'Run Performance Test'}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Individual Handlers</h2>
            <div className="mb-4">
                <p className="font-semibold">Mount Time: {metrics.individual.mount ? `${metrics.individual.mount.toFixed(2)}ms` : 'N/A'}</p>
                <p className="font-semibold">Average Update: {calculateAverage(metrics.individual.updates)}ms</p>
                <p className="text-sm">Updates: {metrics.individual.updates.length}</p>
            </div>
            <div className="h-96 overflow-auto border rounded">
                <Profiler id="StockListIndividual" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                <StockListIndividual stocks={stocks} handleAction={handleAction} />
                </Profiler>
            </div>
            </div>
            
            <div className="border p-4 rounded-lg shadow">
            <h2 className="text-xl font-bold mb-4">Event Delegation</h2>
            <div className="mb-4">
                <p className="font-semibold">Mount Time: {metrics.delegation.mount ? `${metrics.delegation.mount.toFixed(2)}ms` : 'N/A'}</p>
                <p className="font-semibold">Average Update: {calculateAverage(metrics.delegation.updates)}ms</p>
                <p className="text-sm">Updates: {metrics.delegation.updates.length}</p>
            </div>
            <div className="h-96 overflow-auto border rounded">
                <Profiler id="StockList" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                <StockList stocks={stocks} handleAction={handleAction} />
                </Profiler>
            </div>
            </div>
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h2 className="text-xl font-bold mb-2">Performance Results</h2>
            {metrics.individual.mount && metrics.delegation.mount && (
            <div>
                <p className="font-semibold">
                Mount Difference: {(metrics.individual.mount - metrics.delegation.mount).toFixed(2)}ms (
                {((metrics.individual.mount - metrics.delegation.mount) / metrics.individual.mount * 100).toFixed(0)}% improvement)
                </p>
                {metrics.individual.updates.length > 0 && metrics.delegation.updates.length > 0 && (
                <p className="font-semibold">
                    Update Difference: {(Number(calculateAverage(metrics.individual.updates)) - Number(calculateAverage(metrics.delegation.updates))).toFixed(2)}ms (
                    {((Number(calculateAverage(metrics.individual.updates)) - Number(calculateAverage(metrics.delegation.updates))) / Number(calculateAverage(metrics.individual.updates)) * 100).toFixed(0)}% improvement)
                </p>
                )}
            </div>
            )}
        </div>
        </div>
    );
    };

    export default PerformanceTest;