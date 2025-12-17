import { IStockProvider } from "@/lib/types/stock-provider";
import { fetchJSON } from "@/lib/fetcher";

const AKTOOLS_BASE_URL = "http://127.0.0.1:8088/api/public";

// Simple in-memory cache for stock list to avoid 3MB+ fetch on every request
let stocksCache: { data: any[]; timestamp: number } | null = null;
// Cache for 1 hour as stock list rarely changes intraday
const CACHE_DURATION = 60 * 60 * 1000;

export class AkshareProvider implements IStockProvider {
  async searchStocks(query: string): Promise<StockWithWatchlistStatus[]> {
    const url = `${AKTOOLS_BASE_URL}/stock_zh_a_spot_em`;
    let data: any[] = [];

    try {
      if (stocksCache && Date.now() - stocksCache.timestamp < CACHE_DURATION) {
        data = stocksCache.data;
      } else {
        // Disable Next.js data cache (pass false) because response > 2MB throws error
        data = await fetchJSON<any[]>(url, false);
        if (Array.isArray(data)) {
          stocksCache = { data, timestamp: Date.now() };
        }
      }

      if (!Array.isArray(data)) return [];

      const q = query.trim().toLowerCase();
      // If query is empty, return top 10 by volume or just first 10
      let filtered = data;

      if (q) {
        filtered = data.filter((item) => {
          const code = String(item["代码"] || "");
          const name = String(item["名称"] || "");
          return code.includes(q) || name.includes(q);
        });
      }

      return filtered.slice(0, 15).map((item) => ({
        symbol: String(item["代码"]),
        name: String(item["名称"]),
        exchange: "CN",
        type: "Stock",
        isInWatchlist: false,
      }));
    } catch (error) {
      console.error("Akshare search error:", error);
      return [];
    }
  }

  async getMarketNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
    const url = `${AKTOOLS_BASE_URL}/stock_telegraph_cls`;

    try {
      // 财联社电报
      const newsData = await fetchJSON<any[]>(url, 300);

      if (!Array.isArray(newsData)) return [];

      return newsData.slice(0, 10).map((item, index) => {
        const timeStr = item["发布时间"];
        // Assuming format is 'YYYY-MM-DD HH:mm:ss' or 'HH:mm:ss' (today)
        // Just use current time if parsing fails or stick to string if types allow?
        // Type is number (timestamp).
        const date = timeStr ? new Date(timeStr) : new Date();
        const timestamp = isNaN(date.getTime()) ? Date.now() : date.getTime();

        return {
          id: index + Date.now(),
          headline: item["标题"] || "Market News",
          summary: String(item["内容"] || "").substring(0, 200),
          source: "CLS",
          url: "",
          datetime: timestamp,
          category: "general",
          related: "",
          image: "",
        };
      });
    } catch (e) {
      console.error("Akshare news error:", e);
      return [];
    }
  }
}
