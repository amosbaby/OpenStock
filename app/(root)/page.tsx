import TradingViewWidget from "@/components/TradingViewWidget";
import * as constants from "@/lib/constants";
import {sendDailyNewsSummary} from "@/lib/inngest/functions";

import { cookies } from "next/headers";

const Home = async () => {
    const cookieStore = await cookies();
    const market = cookieStore.get('openstock-market')?.value || 'CN'; // Default to CN
    const isCN = market === 'CN';

    const scriptUrl = `https://s3.tradingview.com/external-embedding/embed-widget-`;

    // Select configs based on market
    const marketOverviewConfig = isCN ? constants.CN_MARKET_OVERVIEW_WIDGET_CONFIG : constants.MARKET_OVERVIEW_WIDGET_CONFIG;
    const heatmapConfig = isCN ? constants.CN_HEATMAP_WIDGET_CONFIG : constants.HEATMAP_WIDGET_CONFIG;
    const marketDataConfig = isCN ? constants.CN_MARKET_DATA_WIDGET_CONFIG : constants.MARKET_DATA_WIDGET_CONFIG;
    const topStoriesConfig = isCN ? constants.CN_TOP_STORIES_WIDGET_CONFIG : constants.TOP_STORIES_WIDGET_CONFIG;

    return (
        <div className="flex min-h-screen home-wrapper">
            <section className="grid w-full gap-8 home-section">
                <div className="md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        title={isCN ? "Market Overview" : "Market Overview"}
                        scriptUrl={`${scriptUrl}market-overview.js`}
                        config={marketOverviewConfig}
                        className="custom-chart"
                        height={600}
                    />
                </div>
                <div className="md-col-span xl:col-span-2">
                    <TradingViewWidget
                        title={isCN ? "A-Share Heatmap (Top 300)" : "Stock Heatmap"}
                        scriptUrl={`${scriptUrl}stock-heatmap.js`}
                        config={heatmapConfig}
                        height={600}
                    />
                </div>
            </section>
            <section className="grid w-full gap-8 home-section">
                <div className="h-full md:col-span-1 xl:col-span-2">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}market-quotes.js`}
                        config={marketDataConfig}
                        height={600}
                    />
                </div>
                <div className="h-full md:col-span-1 xl:col-span-1">
                    <TradingViewWidget
                        scriptUrl={`${scriptUrl}timeline.js`}
                        config={topStoriesConfig}
                        height={600}
                    />
                </div>

            </section>
        </div>
    )
}

export default Home;