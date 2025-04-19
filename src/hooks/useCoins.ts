import { useState, useEffect } from 'react';
import { coinGeckoService } from '../services/api';
import { Coin } from '../types/types';

export const useCoins = (searchQuery: string = '') => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await coinGeckoService.getCoins();
        setCoins(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch coins');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return { coins: filteredCoins, loading, error };
}; 