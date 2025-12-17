"use server";

import { cookies } from "next/headers";
import { AkshareProvider } from "@/lib/providers/akshare.provider";
import { FinnhubProvider } from "@/lib/providers/finnhub.provider";
import { IStockProvider } from "@/lib/types/stock-provider";

const akshare = new AkshareProvider();
const finnhub = new FinnhubProvider();

async function getProvider(): Promise<IStockProvider> {
  const cookieStore = await cookies();
  const market = cookieStore.get("openstock-market")?.value;
  // Default to CN (Akshare) if not explicitly set to US
  return market === "US" ? finnhub : akshare;
}

export async function searchStocks(
  query: string = ""
): Promise<StockWithWatchlistStatus[]> {
  const provider = await getProvider();
  return provider.searchStocks(query);
}

export async function getNews(
  symbols?: string[]
): Promise<MarketNewsArticle[]> {
  const provider = await getProvider();
  return provider.getMarketNews(symbols);
}
