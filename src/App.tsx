import React from 'react';
import { ChakraProvider, Box, Heading, Container, Text, VStack, useColorModeValue, HStack } from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CoinTable from './components/CoinTable';
import CoinDetail from './components/CoinDetail';

function App() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'white');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingGradient = useColorModeValue(
    'linear(to-r, blue.400, purple.500)',
    'linear(to-r, blue.200, purple.300)'
  );

  // Define the gradient animation
  const gradientShift = keyframes`
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  `;

  // Animation that will be used for the title
  const animation = `${gradientShift} 3s ease infinite`;

  return (
    <ChakraProvider>
      <Router>
        <Box minH="100vh" bg={bgColor} color={textColor} overflow="visible">
          <Container maxW="container.xl" py={8} overflow="visible">
            <VStack spacing={8} align="stretch" overflow="visible">
              <HStack justify="space-between" align="center">
                <Box textAlign="center" py={8}>
                  <Link to="/">
                    <Heading 
                      size="2xl" 
                      mb={4}
                      padding={1}
                      bgGradient={headingGradient}
                      bgClip="text"
                      fontWeight="extrabold"
                      bgSize="200% 200%"
                      animation={animation}
                      _hover={{
                        transform: 'scale(1.02)',
                        transition: 'transform 0.2s ease-in-out'
                      }}
                      transition="all 0.2s ease-in-out"
                    >
                      Cryptocurrency Market
                    </Heading>
                  </Link>
                  <Text fontSize="lg" color={useColorModeValue('gray.500', 'gray.400')}>
                    Real-time cryptocurrency prices and market data
                  </Text>
                </Box>
              </HStack>
              <Box 
                borderRadius="xl" 
                boxShadow="xl" 
                p={8} 
                bg={cardBg}
                minH="1000px"
                display="flex"
                flexDirection="column"
              >
                <Routes>
                  <Route path="/" element={<CoinTable />} />
                  <Route path="/coin/:id" element={<CoinDetail />} />
                </Routes>
              </Box>
            </VStack>
          </Container>
        </Box>
      </Router>
    </ChakraProvider>
  );
}

export default App;