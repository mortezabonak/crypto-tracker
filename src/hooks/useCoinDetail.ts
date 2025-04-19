import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { coinGeckoService } from '../services/api';
import { CoinDetailType } from '../types/types';

export const useCoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoinDetail = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const data = await coinGeckoService.getCoinDetail(id);
        if (data) {
          setCoin(data);
          setError(null);
        } else {
          setError('Coin not found');
        }
      } catch (err) {
        setError('Failed to fetch coin details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCoinDetail();
  }, [id]);

  return { coin, loading, error };
}; 