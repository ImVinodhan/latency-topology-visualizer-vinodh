"use client";
import { useEffect, useState } from "react";
import usePerformanceMetrics from "@/hooks/usePerformanceMetrics";

export default function PerformancePanel() {
  const { fps, frameTime, cpuCores, memoryUsedMB, memoryTotalMB } = usePerformanceMetrics();
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      setCollapsed(false);
    }
  }, []);

  
  if (collapsed) {
    return (
      <div className="absolute top-4 left-4 z-50">
        <button
          aria-label="Show performance"
          onClick={() => setCollapsed(false)}
          className="w-10 h-10 rounded-full bg-[#0f172a]/90 border border-gray-700 text-white flex items-center justify-center shadow-md"
        >
          <span className="text-sm font-semibold">●</span>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-5 left-5 z-50 bg-[#0f172a]/90 text-white px-4 py-3 rounded-lg text-sm backdrop-blur-md border border-gray-700">

      <div className="flex items-center justify-between">
        <div className="font-semibold text-sm">System Performance</div>
        <button aria-label="Hide performance" onClick={() => setCollapsed(true)} className="text-xs text-gray-300 px-2">✕</button>
      </div>

      <div className="mt-2">
        <div className="flex justify-between">
          <span>FPS:</span>
          <span className={fps > 45 ? "text-green-400" : fps > 25 ? "text-yellow-400" : "text-red-400"}>
            {fps}
          </span>
        </div>

        <div className="flex justify-between">
          <span>Frame Time:</span>
          <span>{frameTime}ms</span>
        </div>

        <div className="flex justify-between">
          <span>CPU Cores:</span>
          <span>{cpuCores}</span>
        </div>

        <div className="flex justify-between">
          <span>Memory:</span>
          <span>{memoryUsedMB}/{memoryTotalMB} MB</span>
        </div>
      </div>
    </div>
  );
}
