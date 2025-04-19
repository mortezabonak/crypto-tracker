import React, { useState, useEffect } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  useColorModeValue,
  Skeleton,
  Box,
  Badge,
  HStack,
  VStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { keyframes } from '@emotion/react';
import { SearchIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

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
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');

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

  // Filter coins based on search query
  const filteredCoins = coins.filter(coin => 
    coin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    coin.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
    <Box width="100%">
      {/* Search input with animation */}
      <Box 
        mb={4} 
        as={motion.div}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 } as any}
      >
        <InputGroup
          as={motion.div}
          whileHover={{ scale: 1.02 }}
          whileFocus={{ scale: 1.02, boxShadow: "0 0 0 3px rgba(66, 153, 225, 0.6)" }}
        >
          <InputLeftElement 
            pointerEvents="none"
            as={motion.div}
            animate={{ rotate: searchQuery ? [0, 15, 0] : 0 }}
            transition={{ duration: 0.3 } as any}
          >
            <SearchIcon color={searchQuery ? "blue.500" : "gray.400"} />
          </InputLeftElement>
          <Input
            placeholder="Search coins..."
            value={searchQuery}
            onChange={handleSearchChange}
            borderColor={borderColor}
            _focus={{ 
              borderColor: "blue.400",
              boxShadow: "0 0 0 1px rgba(66, 153, 225, 0.6)"
            }}
            as={motion.input}
            variants={{
              focus: { scale: 1.02 }
            }}
          />
        </InputGroup>
      </Box>
      
      {/* Enhanced Mobile View with ALL parameters */}
      <Box display={["block", "none"]} width="100%">
        {filteredCoins.map((coin, index) => (
          <Box
            key={coin.id}
            onClick={() => navigate(`/coin/${coin.id}`)}
            cursor="pointer"
            p={4}
            mb={3}
            borderRadius="lg"
            boxShadow="sm"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            transition="all 0.2s ease-in-out"
            _hover={{ 
              transform: 'translateY(-2px)',
              boxShadow: 'md'
            }}
            animation={`${fadeIn} 0.3s ease-out forwards`}
            style={{
              animationDelay: `${index * 0.05}s`
            }}
          >
            {/* Main Info Row */}
            <HStack justify="space-between" width="100%" mb={3}>
              <HStack spacing={3}>
                <Image src={coin.image} alt={coin.name} boxSize="40px" />
                <Box>
                  <Text fontWeight="bold" fontSize="md">{coin.name}</Text>
                  <Text fontSize="sm" color="gray.500">{coin.symbol.toUpperCase()}</Text>
                </Box>
              </HStack>
              <Box textAlign="right">
                <Text fontWeight="bold">{formatCurrency(coin.current_price)}</Text>
                <Text
                  color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}
                  fontWeight="medium"
                  fontSize="sm"
                >
                  {formatPercentage(coin.price_change_percentage_24h)}
                </Text>
              </Box>
            </HStack>
            
            {/* Additional Parameters - 3x2 Grid */}
            <Box 
              display="grid" 
              gridTemplateColumns="1fr 1fr" 
              gap={3}
              fontSize="sm"
            >
              {/* First Row */}
              <Box>
                <Text color="gray.500" fontSize="xs">MARKET CAP</Text>
                <Text fontWeight="medium">
                  ${(coin.market_cap / 1000000).toFixed(2)}M
                </Text>
              </Box>
              
              <Box>
                <Text color="gray.500" fontSize="xs">VOLUME</Text>
                <Text fontWeight="medium">
                  ${(coin.total_volume / 1000000).toFixed(2)}M
                </Text>
              </Box>
              
              {/* Second Row */}
              <Box>
                <Text color="gray.500" fontSize="xs">CMR</Text>
                <Text fontWeight="medium">{coin.cmr.toFixed(2)}</Text>
              </Box>
              
              <Box>
                <Text color="gray.500" fontSize="xs">POT.MULT.</Text>
                <Text fontWeight="medium" color={coin.potMult > 2 ? "purple.500" : undefined}>
                  {coin.potMult.toFixed(1)}x
                </Text>
              </Box>
              
              {/* Third Row */}
              <Box>
                <Text color="gray.500" fontSize="xs">RTL</Text>
                <Text fontWeight="medium">{coin.rtl.toFixed(2)}%</Text>
              </Box>
              
              <Box>
                <Text color="gray.500" fontSize="xs">RISK LEVEL</Text>
                <Badge
                  colorScheme={coin.riskLevel === 'Low' ? 'green' : 'red'}
                  variant="subtle"
                  size="sm"
                >
                  {coin.riskLevel}
                </Badge>
              </Box>
              
              {/* Fourth Row - Signal - ENHANCED */}
              <Box 
                gridColumn="span 2" 
                mt={3}
                mb={1}
                py={2}
                borderTop="1px solid"
                borderColor={borderColor}
              >
                <Text color="gray.500" fontSize="xs" mb={1}>SIGNAL</Text>
                <Badge
                  colorScheme={
                    coin.eeSignal === 'Strong Buy' ? 'green' : 
                    coin.eeSignal === 'Buy' ? 'teal' : 
                    coin.eeSignal === 'Sell' ? 'red' : 'yellow'
                  }
                  variant="solid"
                  px={3}
                  py={1}
                  borderRadius="md"
                  fontSize="sm"
                  fontWeight="bold"
                  textTransform="uppercase"
                  boxShadow="sm"
                >
                  {coin.eeSignal}
                </Badge>
              </Box>
            </Box>
          </Box>
        ))}
      </Box>

      {/* Desktop View - Complete reset */}
      <Box display={["none", "block"]} width="100%" overflow="auto">
        <Table variant="simple" size="sm" sx={{ tableLayout: "fixed" }}>
          <Thead>
            <Tr>
              <Th>COIN</Th>
              <Th isNumeric>PRICE</Th>
              <Th isNumeric>24H</Th>
              <Th isNumeric>MKT CAP</Th>
              <Th isNumeric>VOL</Th>
              <Th isNumeric>CMR</Th>
              <Th>SIGNAL</Th>
              <Th isNumeric>POT</Th>
              <Th isNumeric>RTL</Th>
              <Th>RISK</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredCoins.map((coin, index) => (
              <Tr
                key={coin.id}
                onClick={() => navigate(`/coin/${coin.id}`)}
                cursor="pointer"
                _hover={{ bg: hoverBg }}
                animation={`${fadeIn} 0.3s ease-out forwards`}
                style={{
                  animationDelay: `${index * 0.05}s`
                }}
              >
                <Td>
                  <HStack spacing={2}>
                    <Image src={coin.image} alt={coin.name} boxSize="24px" />
                    <Text fontWeight="bold" noOfLines={1}>{coin.name}</Text>
                  </HStack>
                </Td>
                <Td isNumeric>
                  {formatCurrency(coin.current_price)}
                </Td>
                <Td isNumeric>
                  <Text
                    color={coin.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}
                    fontWeight="medium"
                  >
                    {formatPercentage(coin.price_change_percentage_24h)}
                  </Text>
                </Td>
                <Td isNumeric>
                  {coin.market_cap >= 1000000000 
                    ? `$${(coin.market_cap / 1000000000).toFixed(1)}B` 
                    : `$${(coin.market_cap / 1000000).toFixed(0)}M`}
                </Td>
                <Td isNumeric>
                  {coin.total_volume >= 1000000000
                    ? `$${(coin.total_volume / 1000000000).toFixed(1)}B`
                    : `$${(coin.total_volume / 1000000).toFixed(0)}M`}
                </Td>
                <Td isNumeric>
                  {coin.cmr.toFixed(1)}
                </Td>
                <Td>
                  <Badge 
                    colorScheme={
                      coin.eeSignal === 'Strong Buy' ? 'green' : 
                      coin.eeSignal === 'Buy' ? 'teal' : 
                      coin.eeSignal === 'Sell' ? 'red' : 'yellow'
                    }
                    fontSize="xs"
                  >
                    {coin.eeSignal}
                  </Badge>
                </Td>
                <Td isNumeric>
                  {coin.potMult.toFixed(1)}x
                </Td>
                <Td isNumeric>
                  {coin.rtl.toFixed(1)}%
                </Td>
                <Td>
                  <Badge 
                    colorScheme={coin.riskLevel === 'Low' ? 'green' : 'red'}
                    fontSize="xs"
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