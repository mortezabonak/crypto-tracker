import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  useColorModeValue,
  Skeleton,
  Box,
  Badge,
  HStack,
  VStack,
  useColorMode,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  price_change_percentage_24h: number;
  total_volume: number;
  cmr: number;
  eeSignal: 'buy' | 'sell' | 'neutral';
  potMult: number;
  rtl: number;
  riskLevel: 'low' | 'medium' | 'high';
}

const CoinTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const generateRandomValues = (coin: Coin) => {
    return {
      ...coin,
      cmr: Math.random() * 100,
      eeSignal: ['buy', 'sell', 'neutral'][Math.floor(Math.random() * 3)] as 'buy' | 'sell' | 'neutral',
      potMult: Math.random() * 5,
      rtl: Math.random() * 100,
      riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high'
    };
  };

  useEffect(() => {
    const fetchCoins = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
        );
        const data = await response.json();
        const coinsWithRandomValues = data.map(generateRandomValues);
        setCoins(coinsWithRandomValues);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching coins:', error);
        setLoading(false);
      }
    };

    fetchCoins();
    const interval = setInterval(fetchCoins, 60000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'green.400';
      case 'medium': return 'yellow.400';
      case 'high': return 'red.400';
      default: return 'gray.400';
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal) {
      case 'buy': return 'green.400';
      case 'sell': return 'red.400';
      case 'neutral': return 'yellow.400';
      default: return 'gray.400';
    }
  };

  if (loading) {
    return (
      <VStack spacing={4} align="stretch">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} height="60px" />
        ))}
      </VStack>
    );
  }

  return (
    <Box flex="1" display="flex" flexDirection="column">
      <TableContainer flex="1">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th>Coin</Th>
              <Th isNumeric>Price</Th>
              <Th isNumeric>24h Change</Th>
              <Th isNumeric>Market Cap</Th>
              <Th isNumeric>Volume</Th>
              <Th isNumeric>CMR</Th>
              <Th>E/E Signal</Th>
              <Th isNumeric>POT.MULT.</Th>
              <Th isNumeric>RTL</Th>
              <Th>Risk Level</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.map((coin) => (
              <Tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                transition="background-color 0.2s"
              >
                <Td>
                  <HStack>
                    <Box
                      w="32px"
                      h="32px"
                      borderRadius="full"
                      overflow="hidden"
                      border={`2px solid ${borderColor}`}
                    >
                      <img src={coin.image} alt={coin.name} width="100%" height="100%" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold">{coin.name}</Text>
                      <Badge colorScheme="gray">{coin.symbol.toUpperCase()}</Badge>
                    </VStack>
                  </HStack>
                </Td>
                <Td isNumeric fontWeight="bold">
                  {formatCurrency(coin.current_price)}
                </Td>
                <Td isNumeric>
                  <HStack justify="flex-end">
                    {coin.price_change_percentage_24h >= 0 ? (
                      <FaArrowUp color="green" />
                    ) : (
                      <FaArrowDown color="red" />
                    )}
                    <Text
                      color={
                        coin.price_change_percentage_24h >= 0
                          ? colorMode === 'light'
                            ? 'green.500'
                            : 'green.300'
                          : colorMode === 'light'
                          ? 'red.500'
                          : 'red.300'
                      }
                    >
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </Text>
                  </HStack>
                </Td>
                <Td isNumeric>{formatCurrency(coin.market_cap)}</Td>
                <Td isNumeric>{formatCurrency(coin.total_volume)}</Td>
                <Td isNumeric>{coin.cmr.toFixed(2)}</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      coin.eeSignal === 'buy' ? 'green' : 
                      coin.eeSignal === 'sell' ? 'red' : 'yellow'
                    }
                    fontSize="sm"
                  >
                    {coin.eeSignal.toUpperCase()}
                  </Badge>
                </Td>
                <Td isNumeric>{coin.potMult.toFixed(2)}x</Td>
                <Td isNumeric>{coin.rtl.toFixed(2)}%</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      coin.riskLevel === 'low' ? 'green' : 
                      coin.riskLevel === 'medium' ? 'yellow' : 'red'
                    }
                    fontSize="sm"
                  >
                    {coin.riskLevel.toUpperCase()}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CoinTable;