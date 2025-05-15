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

const PerformanceTest: React.FC = () => {
    const [stocks, setStocks] = useState<Stock[]>([]);
    const [loading, setLoading] = useState(true);
    const [metrics, setMetrics] = useState({
        individual: { mount: null, updates: [] },
        delegation: { mount: null, updates: [] }
    });
    const [testRunning, setTestRunning] = useState(false);

    const metricsRef = useRef({
        individual: { mount: null, updates: [] },
        delegation: { mount: null, updates: [] }
    });

    const onRenderCallback = (id: string, phase: "mount" | "update", actualDuration: number) => {
        if (id.includes("Table")) {
            console.log(`Table render (${id}) took ${actualDuration.toFixed(2)}ms`);
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
        console.time(`Button interaction for ${symbol}`);
        console.log(`Action for ${symbol}`);
        console.timeEnd(`Button interaction for ${symbol}`);
    };

    if (loading) {
        return <div className="p-8 text-center">Loading stock data...</div>;
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Stock List Performance Comparison</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Individual Handlers</h2>
                    <Profiler id="StockListIndividualTable" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                        <StockListIndividual stocks={stocks} handleAction={handleAction} />
                    </Profiler>
                </div>

                <div className="border p-4 rounded-lg shadow">
                    <h2 className="text-xl font-bold mb-4">Event Delegation</h2>
                    <Profiler id="StockListTable" onRender={onRenderCallback as ProfilerOnRenderCallback}>
                        <StockList stocks={stocks} handleAction={handleAction} />
                    </Profiler>
                </div>
            </div>
        </div>
    );
};

export default PerformanceTest;