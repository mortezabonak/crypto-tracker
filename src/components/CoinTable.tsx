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
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { keyframes } from '@emotion/react';

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

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'gray.200');

  // Add back the animation keyframes
  const clickAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(0.98); }
    100% { transform: scale(1); }
  `;

  const fadeIn = keyframes`
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  `;

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
    <Box width="100%">
      {/* Mobile View */}
      <Box display={["block", "none"]} width="100%">
        {coins.map((coin, index) => (
          <Box 
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            cursor="pointer"
            p={4}
            borderBottom="1px"
            borderColor={borderColor}
            transition="all 0.2s ease-in-out"
            _hover={{ 
              bg: hoverBg,
              transform: 'translateX(5px)',
              boxShadow: 'sm'
            }}
            _active={{
              animation: `${clickAnimation} 0.2s ease-in-out`
            }}
            animation={`${fadeIn} 0.3s ease-out forwards`}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            <HStack justify="space-between" width="100%">
              <HStack spacing={3}>
                <Image src={coin.image} alt={coin.name} boxSize="32px" />
                <Box>
                  <Text fontWeight="bold">{coin.name}</Text>
                  <Text fontSize="sm" color="gray.500">{coin.symbol.toUpperCase()}</Text>
                </Box>
              </HStack>
              <Box textAlign="right">
                <Text fontWeight="medium">{formatCurrency(coin.current_price)}</Text>
                <Text
                  color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {formatPercentage(coin.price_change_percentage_24h)}
                </Text>
              </Box>
            </HStack>
          </Box>
        ))}
      </Box>

      {/* Desktop View */}
      <Box display={["none", "block"]} maxW="100%" overflow="hidden">
        <Table variant="simple" size="md">
          <Thead>
            <Tr>
              <Th width="20%">COIN</Th>
              <Th isNumeric width="10%">PRICE</Th>
              <Th isNumeric width="8%">24H</Th>
              <Th isNumeric display={["none", "table-cell"]} width="15%">MARKET CAP</Th>
              <Th isNumeric display={["none", "table-cell"]} width="12%">VOLUME</Th>
              <Th isNumeric display={["none", "none", "table-cell"]} width="7%">CMR</Th>
              <Th display={["none", "none", "table-cell"]} width="10%">SIGNAL</Th>
              <Th isNumeric display={["none", "none", "table-cell"]} width="6%">POT</Th>
              <Th isNumeric display={["none", "none", "table-cell"]} width="6%">RTL</Th>
              <Th display={["none", "none", "table-cell"]} width="6%">RISK</Th>
            </Tr>
          </Thead>
          <Tbody>
            {coins.map((coin, index) => (
              <Tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                cursor="pointer"
                transition="all 0.2s ease-in-out"
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateY(-2px)',
                  boxShadow: 'sm'
                }}
                _active={{
                  animation: `${clickAnimation} 0.2s ease-in-out`
                }}
                animation={`${fadeIn} 0.3s ease-out forwards`}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <Td width="20%">
                  <HStack spacing={3}>
                    <Image src={coin.image} alt={coin.name} boxSize="32px" />
                    <Box>
                      <Text fontWeight="bold" noOfLines={1}>{coin.name}</Text>
                      <Text fontSize="sm" color="gray.500">{coin.symbol.toUpperCase()}</Text>
                    </Box>
                  </HStack>
                </Td>
                <Td isNumeric width="10%">
                  {formatCurrency(coin.current_price)}
                </Td>
                <Td isNumeric width="8%">
                  <Text
                    color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}
                    fontWeight="medium"
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </Text>
                </Td>
                <Td isNumeric display={["none", "table-cell"]} width="15%">
                  {formatCurrency(coin.market_cap)}
                </Td>
                <Td isNumeric display={["none", "table-cell"]} width="12%">
                  {formatCurrency(coin.total_volume)}
                </Td>
                <Td isNumeric display={["none", "none", "table-cell"]} width="7%">
                  {coin.cmr.toFixed(2)}
                </Td>
                <Td display={["none", "none", "table-cell"]} width="10%">
                  <Badge 
                    colorScheme={
                      coin.eeSignal === 'Strong Buy' ? 'green' : 
                      coin.eeSignal === 'Buy' ? 'teal' : 
                      coin.eeSignal === 'Sell' ? 'red' : 'yellow'
                    }
                  >
                    {coin.eeSignal}
                  </Badge>
                </Td>
                <Td isNumeric display={["none", "none", "table-cell"]} width="6%">
                  {coin.potMult.toFixed(1)}x
                </Td>
                <Td isNumeric display={["none", "none", "table-cell"]} width="6%">
                  {coin.rtl.toFixed(2)}%
                </Td>
                <Td display={["none", "none", "table-cell"]} width="6%">
                  <Badge 
                    colorScheme={coin.riskLevel === 'Low' ? 'green' : 'red'}
                  >
                    {coin.riskLevel}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default CoinTable;