import axios from 'axios';
import { Coin, CoinDetailType } from '../types/types';

// Interface for API configuration
interface ApiConfig {
  baseURL: string;
  timeout: number;
}

// Interface for API response
interface ApiResponse<T> {
  data: T;
  status: number;
}

// Base API service class
class ApiService {
  private client;

  constructor(config: ApiConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout,
    });
  }

  protected async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await this.client.get<T>(endpoint);
      return {
        data: response.data,
        status: response.status,
      };
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }
}

// CoinGecko specific service
class CoinGeckoService extends ApiService {
  constructor() {
    super({
      baseURL: 'https://api.coingecko.com/api/v3',
      timeout: 5000,
    });
  }

  async getCoins(): Promise<Coin[]> {
    const response = await this.get<Coin[]>(
      '/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    );
    return response.data;
  }

  async getCoinDetail(id: string): Promise<CoinDetailType | null> {
    try {
      const response = await this.get<CoinDetailType>(
        `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
      );
      return response.data;
    } catch (error) {
      return null;
    }
  }
}

// Export a singleton instance
export const coinGeckoService = new CoinGeckoService();