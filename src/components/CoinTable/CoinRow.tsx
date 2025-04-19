import React from 'react';
import {
  Tr,
  Td,
  Text,
  Badge,
  HStack,
  Image,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { Coin } from '../../types/types';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

interface CoinRowProps {
  coin: Coin;
  index: number;
}

export const CoinRow: React.FC<CoinRowProps> = ({ coin, index }) => {
  const navigate = useNavigate();

  return (
    <Tr
      key={coin.id}
      onClick={() => navigate(`/coin/${coin.id}`)}
      cursor="pointer"
      _hover={{ bg: 'gray.50' }}
      animation={`fadeIn 0.3s ease-out forwards`}
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
  );
}; 