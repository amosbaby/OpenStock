export interface IStockProvider {
  searchStocks(query: string): Promise<StockWithWatchlistStatus[]>;
  getMarketNews(symbols?: string[]): Promise<MarketNewsArticle[]>;
  //   getStockProfile(symbol: string): Promise<any>;
  //   getStockQuote(symbol: string): Promise<any>;
}
