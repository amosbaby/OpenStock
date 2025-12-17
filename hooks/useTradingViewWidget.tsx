'use client';
import { useEffect, useRef }     from "react";

const useTradingViewWidget = (scriptUrl: string, config: Record<string, unknown>, height = 600) => {
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        
        // Clear previous content
        containerRef.current.innerHTML = `<div class="tradingview-widget-container__widget" style="width: 100%; height: ${height}px;"></div>`;
        delete containerRef.current.dataset.loaded;

        const script = document.createElement("script");
        script.src = scriptUrl;
        script.async = true;
        script.innerHTML = JSON.stringify(config);

        containerRef.current.appendChild(script);

        return () => {
             if (containerRef.current) {
                containerRef.current.innerHTML = '';
             }
        }
    }, [scriptUrl, config, height])

    return containerRef;
}
export default useTradingViewWidget