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
  eeSignal: 'Buy' | 'Sell' | 'Neutral' | 'Strong Buy';
  potMult: number;
  rtl: number;
  riskLevel: 'Low' | 'High';
}

const CoinTable: React.FC = () => {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  const generateRandomValues = (coin: Coin) => {
    return {
      ...coin,
      cmr: Math.random() * 100,
      eeSignal: ['Buy', 'Sell', 'Neutral', 'Strong Buy'][Math.floor(Math.random() * 4)] as 'Buy' | 'Sell' | 'Neutral' | 'Strong Buy',
      potMult: Math.random() * 5,
      rtl: Math.random() * 100,
      riskLevel: ['Low', 'High'][Math.floor(Math.random() * 2)] as 'Low' | 'High'
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

  // const getRiskColor = (risk: string) => {
  //   switch (risk) {
  //     case 'Low': return 'green.400';
  //     // case 'Medium': return 'yellow.400';
  //     case 'High': return 'red.400';
  //     default: return 'gray.400';
  //   }
  // };

  // const getSignalColor = (signal: string) => {
  //   switch (signal) {
  //     case 'buy': return 'green.400';
  //     case 'sell': return 'red.400';
  //     case 'neutral': return 'yellow.400';
  //     default: return 'gray.400';
  //   }
  // };

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
              <Th fontSize="md" fontWeight="bold" color={textColor}>Coin</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>Price</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>24h Change</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>Market Cap</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>Volume</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>CMR</Th>
              <Th fontSize="md" fontWeight="bold" color={textColor}>E/E Signal</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor} width="100px">POT.MULT.</Th>
              <Th isNumeric fontSize="md" fontWeight="bold" color={textColor}>RTL</Th>
              <Th fontSize="md" fontWeight="bold" color={textColor}>Risk Level</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.map((coin) => (
              <Tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                cursor="pointer"
                _hover={{ 
                  bg: hoverBg,
                  transform: 'scale(1.01)',
                  transition: 'all 0.2s ease-in-out'
                }}
                transition="all 0.2s ease-in-out"
              >
                <Td>
                  <HStack spacing={3}>
                    <Box
                      w="40px"
                      h="40px"
                      borderRadius="full"
                      overflow="hidden"
                      border={`2px solid ${borderColor}`}
                      boxShadow="md"
                      transition="transform 0.2s ease-in-out"
                      _hover={{ transform: 'scale(1.1)' }}
                    >
                      <img src={coin.image} alt={coin.name} width="100%" height="100%" />
                    </Box>
                    <VStack align="start" spacing={0}>
                      <Text fontWeight="bold" fontSize="md">{coin.name}</Text>
                      <Badge colorScheme="gray" fontSize="xs">{coin.symbol.toUpperCase()}</Badge>
                    </VStack>
                  </HStack>
                </Td>
                <Td isNumeric fontWeight="bold" fontSize="md">
                  {formatCurrency(coin.current_price)}
                </Td>
                <Td isNumeric>
                  <HStack justify="flex-end" spacing={1}>
                    {coin.price_change_percentage_24h >= 0 ? (
                      <FaArrowUp color="green" />
                    ) : (
                      <FaArrowDown color="red" />
                    )}
                    <Text
                      fontWeight="bold"
                      color={
                        coin.price_change_percentage_24h >= 0
                          ? 'green.500'
                          : 'red.500'
                      }
                    >
                      {formatPercentage(coin.price_change_percentage_24h)}
                    </Text>
                  </HStack>
                </Td>
                <Td isNumeric fontSize="md">{formatCurrency(coin.market_cap)}</Td>
                <Td isNumeric fontSize="md">{formatCurrency(coin.total_volume)}</Td>
                <Td isNumeric fontSize="md" fontWeight="bold">{coin.cmr.toFixed(2)}</Td>
                <Td>
                  <Badge 
                    colorScheme={
                      coin.eeSignal === 'Strong Buy' ? 'green' : 
                      coin.eeSignal === 'Buy' ? 'green' : 
                      coin.eeSignal === 'Sell' ? 'red' : 'yellow'
                    }
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="md"
                    boxShadow="sm"
                    variant={coin.eeSignal === 'Strong Buy' ? 'solid' : 'subtle'}
                  >
                    {coin.eeSignal || 'Neutral'}
                  </Badge>
                </Td>
                <Td fontSize="md" fontWeight="bold" textAlign={'center'}>
                  {coin.potMult.toFixed(2)}x
                </Td>
                <Td isNumeric fontSize="md" fontWeight="bold">{coin.rtl.toFixed(2)}%</Td>
                <Td>
                  <Badge 
                    colorScheme={coin.riskLevel === 'Low' ? 'green' : 'red'}
                    fontSize="sm"
                    px={2}
                    py={1}
                    borderRadius="md"
                    boxShadow="sm"
                  >
                    {coin.riskLevel || 'High'}
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