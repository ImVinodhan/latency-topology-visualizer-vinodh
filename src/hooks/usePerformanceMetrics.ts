"use client";
import { useEffect, useState } from "react";
import useFPS from "./useFPS";

interface Metrics {
    fps: number;
    frameTime: number;
    cpuCores: number;
    memoryUsedMB: number;
    memoryTotalMB: number;
}

export default function usePerformanceMetrics(): Metrics {
    const fps = useFPS();
    const [memoryUsedMB, setMemoryUsedMB] = useState(0);
    const [memoryTotalMB, setMemoryTotalMB] = useState(0);

    const frameTime = fps > 0 ? Math.round(1000 / fps) : 0;
    const cpuCores = navigator.hardwareConcurrency || 0;

    useEffect(() => {
        if (performance.memory) {
            const used = performance.memory.usedJSHeapSize / 1024 / 1024;
            const total = performance.memory.totalJSHeapSize / 1024 / 1024;
            setMemoryUsedMB(Math.round(used));
            setMemoryTotalMB(Math.round(total));
        }
    }, [fps]);

    return { fps, frameTime, cpuCores, memoryUsedMB, memoryTotalMB };
}
