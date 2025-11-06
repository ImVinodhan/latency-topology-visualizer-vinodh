"use client";
import { useEffect, useState } from "react";

export default function useFPS(): number {
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let lastFrameTime = performance.now();
    let frameCount = 0;

    const loop = (now: number) => {
      frameCount++;
      const delta = now - lastFrameTime;

      if (delta >= 1000) {
        setFps(Math.round((frameCount * 1000) / delta));
        frameCount = 0;
        lastFrameTime = now;
      }

      requestAnimationFrame(loop);
    };

    const id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);

  return fps;
}
