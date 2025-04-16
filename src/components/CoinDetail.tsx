import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Badge,
  VStack,
  HStack,
  Link as ChakraLink,
  useColorModeValue,
  Spinner,
  Grid,
  Button,
} from '@chakra-ui/react';
import { getCoinDetail } from '../services/api';
import { CoinDetailType } from '../types/types';

type Section = 'description' | 'links' | 'developer';

const CoinDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [coin, setCoin] = useState<CoinDetailType | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<Section>('description');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const buttonBg = useColorModeValue('white', 'gray.800');
  const activeButtonBg = useColorModeValue('blue.50', 'blue.900');

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        const data = await getCoinDetail(id);
        setCoin(data);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={20}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Box>
    );
  }

  if (!coin) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Coin not found</Text>
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
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <HStack spacing={4} mb={4}>
            <Image src={coin.image.large} alt={coin.name} boxSize="48px" />
            <Box>
              <Heading size="xl">{coin.name}</Heading>
              <Text fontSize="lg" color="gray.500">
                {coin.symbol.toUpperCase()}
              </Text>
            </Box>
          </HStack>
        </Box>

        <Box>
          <Heading size="md" mb={4}>Market Data</Heading>
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
                  <Td borderColor={borderColor}>Current Price</Td>
                  <Td isNumeric borderColor={borderColor}>
                    ${coin.market_data.current_price.usd.toLocaleString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>Market Cap</Td>
                  <Td isNumeric borderColor={borderColor}>
                    ${(coin.market_data.market_cap.usd / 1000000000).toFixed(2)}B
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>24h Change</Td>
                  <Td isNumeric borderColor={borderColor}>
                    <Badge colorScheme={coin.market_data.price_change_percentage_24h >= 0 ? 'green' : 'red'}>
                      {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                    </Badge>
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>Circulating Supply</Td>
                  <Td isNumeric borderColor={borderColor}>
                    {coin.market_data.circulating_supply.toLocaleString()}
                  </Td>
                </Tr>
                <Tr>
                  <Td borderColor={borderColor}>Total Supply</Td>
                  <Td isNumeric borderColor={borderColor}>
                    {coin.market_data.total_supply.toLocaleString()}
                  </Td>
                </Tr>
                {coin.market_data.max_supply && (
                  <Tr>
                    <Td borderColor={borderColor}>Max Supply</Td>
                    <Td isNumeric borderColor={borderColor}>
                      {coin.market_data.max_supply.toLocaleString()}
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>

        <Grid templateColumns="1fr 300px" gap={8}>
          <Box>
            <Heading size="md" mb={4}>Additional Information</Heading>
            {renderContent()}
          </Box>
          <Box>
            <VStack spacing={2} align="stretch">
              <Button
                variant="ghost"
                justifyContent="flex-start"
                bg={activeSection === 'description' ? activeButtonBg : buttonBg}
                onClick={() => setActiveSection('description')}
                leftIcon={<Text>📝</Text>}
              >
                Description
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                bg={activeSection === 'links' ? activeButtonBg : buttonBg}
                onClick={() => setActiveSection('links')}
                leftIcon={<Text>🔗</Text>}
              >
                Links
              </Button>
              <Button
                variant="ghost"
                justifyContent="flex-start"
                bg={activeSection === 'developer' ? activeButtonBg : buttonBg}
                onClick={() => setActiveSection('developer')}
                leftIcon={<Text>👨‍💻</Text>}
              >
                Developer Data
              </Button>
            </VStack>
          </Box>
        </Grid>
      </VStack>
    </Container>
  );
};

export default CoinDetail; 