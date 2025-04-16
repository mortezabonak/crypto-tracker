import axios from 'axios';
import { Coin, CoinDetailType } from '../types/types';

const BASE_URL = 'https://api.coingecko.com/api/v3';

export const getCoinData = async (): Promise<Coin[]> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return [];
  }
};

export const getCoinDetail = async (id: string): Promise<CoinDetailType | null> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching coin detail:', error);
    return null;
  }
};