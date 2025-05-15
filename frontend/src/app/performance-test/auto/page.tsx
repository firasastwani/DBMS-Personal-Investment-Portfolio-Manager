"use client";

import React, { useState, useEffect, useRef, Profiler, ProfilerOnRenderCallback } from "react";
import StockList from "../../../components/StockList";
import StockListIndividual from "../../../components/StockList.individual";

interface Stock {
    id: number;
    symbol: string;
    name: string;
    staticPrice: number;
}

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

    const metricsRef = useRef<{
        individual: number[];
        delegation: number[];
    }>({
        individual: [],
        delegation: [],
    });

    const [testRunning, setTestRunning] = useState(false);

    const onRenderCallback = (
        id: string,
        phase: "mount" | "update",
        actualDuration: number
    ) => {
        if (id === "StockListIndividual" && phase === "mount") {
            metricsRef.current.individual.push(actualDuration);
        } else if (id === "StockList" && phase === "mount") {
            metricsRef.current.delegation.push(actualDuration);
        }
    };

    const loadStocks = () => {
        const stocks = Array.from({ length: 10000 }, (_, i) => ({
            id: i,
            symbol: `STK${i}`,
            name: `Company ${i}`,
            staticPrice: Math.random() * 10000
        }));
        setStocks(stocks);
        setLoading(false);
    };

    useEffect(() => loadStocks(), []);

    const runAutomatedTest = async () => {
        setTestRunning(true);
        metricsRef.current = { individual: [], delegation: [] };

        for (let i = 0; i < 10; i++) {
            setLoading(true);
            await new Promise((resolve) => setTimeout(resolve, 100));
            loadStocks();
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        const avgIndividual = calculateAverage(metricsRef.current.individual);
        const avgDelegation = calculateAverage(metricsRef.current.delegation);

        setMetrics({
            individual: { mount: avgIndividual, updates: [] },
            delegation: { mount: avgDelegation, updates: [] },
        });

        setTestRunning(false);
    };

    const calculateAverage = (numbers: number[]) => {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((a, b) => a + b, 0);
        return parseFloat((sum / numbers.length).toFixed(2));
    };

    if (loading) return <div className="p-8 text-center">Loading stock data...</div>;

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Automated Performance Test</h1>
            <button 
                onClick={runAutomatedTest}
                disabled={testRunning}
                className={`px-4 py-2 rounded mb-6 ${testRunning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
            >
                {testRunning ? 'Test in progress...' : 'Run Automated Performance Test'}
            </button>

            <div className="grid grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Individual Handlers</h2>
                    <Profiler id="StockListIndividual" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                        <StockListIndividual stocks={stocks} handleAction={() => {}} />
                    </Profiler>
                </div>
                <div>
                    <h2 className="text-xl font-bold mb-4">Event Delegation</h2>
                    <Profiler id="StockList" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                        <StockList stocks={stocks} handleAction={() => {}} />
                    </Profiler>
                </div>
            </div>

            <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                <h2 className="text-xl font-bold mb-2">Performance Results</h2>
                {metrics.individual.mount && metrics.delegation.mount && (
                    <div>
                        <p>Average Individual Mount: {metrics.individual.mount}ms</p>
                        <p>Average Delegation Mount: {metrics.delegation.mount}ms</p>
                        <p>Improvement: {((metrics.individual.mount - metrics.delegation.mount) / metrics.individual.mount * 100).toFixed(2)}%</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PerformanceTest;
