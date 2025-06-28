import React, { useState } from 'react';
import {
  Box,
  Button,
  Input,
  Heading,
  Alert,
  AlertIcon,
  FormControl,
  FormLabel,
  FormErrorMessage,
  VStack,
  Spinner,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      setError('');

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
        method: 'POST',

        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      login(data.token);
      navigate('/api/login/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.800, blue.900)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
    >
      <Box
        bg="whiteAlpha.100"
        p={10}
        borderRadius="xl"
        boxShadow="2xl"
        backdropFilter="blur(10px)"
        border="1px solid rgba(255, 255, 255, 0.1)"
        w="100%"
        maxW="400px"
      >
        <Heading mb={6} color="white" textAlign="center">
          Sign In
        </Heading>

        {error && (
          <Alert status="error" borderRadius="md" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        )}

        <VStack spacing={5}>
          <FormControl isRequired isInvalid={!email && error !== ''}>
            <FormLabel color="whiteAlpha.800">Email</FormLabel>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              bg="whiteAlpha.100"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              _focus={{ borderColor: 'blue.400', bg: 'whiteAlpha.200' }}
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>

          <FormControl isRequired isInvalid={!password && error !== ''}>
            <FormLabel color="whiteAlpha.800">Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              bg="whiteAlpha.100"
              color="white"
              _placeholder={{ color: 'whiteAlpha.600' }}
              _focus={{ borderColor: 'blue.400', bg: 'whiteAlpha.200' }}
            />
            <FormErrorMessage>Password is required.</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            mt={2}
            onClick={handleLogin}
            isDisabled={isLoading}
          >
            {isLoading ? <Spinner size="sm" color="white" /> : 'Login'}
          </Button>

          <Text fontSize="sm" color="whiteAlpha.600" mt={4}>
            
          </Text>
        </VStack>
      </Box>
    </Box>
  );
};

export default LoginPage;
