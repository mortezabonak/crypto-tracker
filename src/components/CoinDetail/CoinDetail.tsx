import { useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
  Spinner,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCoinDetail } from '../../hooks/useCoinDetail';
import { formatCurrency, formatPercentage, formatLargeNumber } from '../../utils/formatters';

type Section = 'description' | 'links' | 'developer';

export const CoinDetail: React.FC = () => {
  const { coin, loading, error } = useCoinDetail();
  const [activeSection, setActiveSection] = useState<Section>('description');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={20}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  if (error || !coin) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>{error || 'Coin not found'}</Text>
        <Link to="/">Back to Home</Link>
      </Container>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case 'description':
        return <Text whiteSpace="pre-wrap">{coin.description.en}</Text>;
      case 'links':
        return (
          <VStack align="start" spacing={4}>
            <Box>
              <Text fontWeight="bold" mb={2}>Official Website</Text>
              <VStack align="start" spacing={2}>
                {coin.links.homepage.map((link, index) => (
                  <ChakraLink key={index} href={link} isExternal color="blue.500">
                    {link}
                  </ChakraLink>
                ))}
              </VStack>
            </Box>
            <Box>
              <Text fontWeight="bold" mb={2}>Blockchain Explorer</Text>
              <VStack align="start" spacing={2}>
                {coin.links.blockchain_site.map((link, index) => (
                  <ChakraLink key={index} href={link} isExternal color="blue.500">
                    {link}
                  </ChakraLink>
                ))}
              </VStack>
            </Box>
          </VStack>
        );
      case 'developer':
        return (
          <TableContainer>
            <Table variant="simple" size="md">
              <Thead>
                <Tr>
                  <Th borderColor={borderColor}>Metric</Th>
                  <Th isNumeric borderColor={borderColor}>Value</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td borderColor={borderColor}>Stars</Td>
                  <Td isNumeric borderColor={borderColor}>
                    {coin.developer_data.stars.toLocaleString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>Forks</Td>
                  <Td isNumeric borderColor={borderColor}>
                    {coin.developer_data.forks.toLocaleString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>Subscribers</Td>
                  <Td isNumeric borderColor={borderColor}>
                    {coin.developer_data.subscribers.toLocaleString()}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        );
    }
  };

  return (
    <Box p={4}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <HStack spacing={4}>
          <Image src={coin.image.large} alt={coin.name} boxSize="48px" />
          <Box>
            <Heading size="lg">{coin.name}</Heading>
            <Text color="gray.500">{coin.symbol.toUpperCase()}</Text>
          </Box>
        </HStack>

        {/* Market Data */}
        <Box>
          <Heading size="md" mb={4}>Market Data</Heading>
          <SimpleGrid columns={[1, 2]} spacing={4}>
            <Stat>
              <StatLabel>Price</StatLabel>
              <StatNumber>{formatCurrency(coin.market_data.current_price.usd)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>24h Change</StatLabel>
              <StatNumber color={coin.market_data.price_change_percentage_24h >= 0 ? 'green.500' : 'red.500'}>
                {formatPercentage(coin.market_data.price_change_percentage_24h)}
              </StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Market Cap</StatLabel>
              <StatNumber>{formatLargeNumber(coin.market_data.market_cap.usd)}</StatNumber>
            </Stat>
            <Stat>
              <StatLabel>Volume</StatLabel>
              <StatNumber>{formatLargeNumber(coin.market_data.total_volume.usd)}</StatNumber>
            </Stat>
          </SimpleGrid>
        </Box>

        {/* Navigation Buttons */}
        <Box>
          <HStack spacing={2}>
            <Button
              flex="1"
              variant={activeSection === 'description' ? 'solid' : 'outline'}
              colorScheme="blue"
              size={["sm", "md"]}
              fontSize={["xs", "sm"]}
              onClick={() => setActiveSection('description')}
            >
              Description
            </Button>
            <Button
              flex="1"
              variant={activeSection === 'links' ? 'solid' : 'outline'}
              colorScheme="blue"
              size={["sm", "md"]}
              fontSize={["xs", "sm"]}
              onClick={() => setActiveSection('links')}
            >
              Links
            </Button>
            <Button
              flex="1"
              variant={activeSection === 'developer' ? 'solid' : 'outline'}
              colorScheme="blue"
              size={["sm", "md"]}
              fontSize={["xs", "sm"]}
              onClick={() => setActiveSection('developer')}
            >
              Dev Data
            </Button>
          </HStack>
        </Box>

        {/* Content Section */}
        <Box>
          <Heading size="md" mb={4}>
            {activeSection === 'developer' ? 'Developer Data' : 
             activeSection === 'description' ? 'Description' : 
             'Links'}
          </Heading>
          {renderContent()}
        </Box>
      </VStack>
    </Box>
  );
}; 