import React, { useState } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  VStack,
  Skeleton,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useCoins } from '../../hooks/useCoins';
import { CoinRow } from './CoinRow';

export const CoinTable: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { coins, loading, error } = useCoins(searchQuery);

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

  if (error) {
    return <Box color="red.500">{error}</Box>;
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
          />
        </InputGroup>
      </Box>

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
          {coins.map((coin, index) => (
            <CoinRow key={coin.id} coin={coin} index={index} />
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}; 