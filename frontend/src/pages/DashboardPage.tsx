import React, { useEffect, useState } from 'react';
import {
  Box, Flex, Text, Input, Avatar, Badge, Button,
  Grid, GridItem, Card, CardBody, VStack, HStack,
  Table, Thead, Tbody, Tr, Th, Td, InputGroup,
  InputLeftElement, Select, IconButton, Drawer,
  DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent,
  DrawerCloseButton, useDisclosure, List, ListItem,
  ListIcon, Divider
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { 
  SearchIcon, CalendarIcon, HamburgerIcon, 
  SettingsIcon, ChatIcon, StarIcon
} from '@chakra-ui/icons';
import { useAuth } from '../context/AuthContext';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from 'recharts';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


interface Transaction {
  id: number;
  date: string;
  amount: number;
  category: string;
  status: string;
  user_profile?: string;
  user_name?: string;
}

const DashboardPage = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('10 May - 20 Maay');
  const [activeNavItem, setActiveNavItem] = useState('Dashboard');
  const { isOpen, onOpen, onClose } = useDisclosure();

  

  //make the date filter here
  const [startDate, setStartDate] = useState('');
const [endDate, setEndDate] = useState('');

const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

const [selectedColumns, setSelectedColumns] = useState<string[]>(['Name', 'Date', 'Amount', 'Status']);
const [isCSVModalOpen, setCSVModalOpen] = useState(false);
const [sortOrder, setSortOrder] = useState('date-desc');


const { logout } = useAuth();
const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE_URL}/api/transactions`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        console.log("✅ Fetched data from backend:", data);
        setTransactions(data);
      })
      .catch(err => {
        console.error("❌ Failed to fetch transactions:", err);
      });
  }, [token]);

  const filtered = transactions.filter(t => {
    const searchLower = search.toLowerCase();
    const txnDate = new Date(t.date);
    const isWithinDate =
      (!startDate || txnDate >= new Date(startDate)) &&
      (!endDate || txnDate <= new Date(endDate));
  
    return (
      isWithinDate &&
      (
        t.category?.toLowerCase().includes(searchLower) ||
        t.status?.toLowerCase().includes(searchLower) ||
        t.user_name?.toLowerCase().includes(searchLower) ||
        t.amount?.toString().includes(search) ||
        txnDate.toLocaleDateString().includes(search)
      )
    );
  });



  const handleSort = (key: string) => {
    setSortConfig(prev => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };
  


// handle the csv export 
const handleExportCSV = () => {
  const headers = ['Name', 'Date', 'Amount', 'Status'];
  const rows = filtered.map(txn => [
    txn.user_name || `User ${txn.id}`,
    new Date(txn.date).toLocaleDateString(),
    `${txn.category === 'revenue' ? '+' : '-'}$${txn.amount?.toFixed(2)}`,
    txn.status || 'Pending',
  ]);
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'transactions.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



  // Calculate metrics
  const totalBalance = filtered.reduce((sum, t) => sum + (t.amount || 0), 0);
const revenue = filtered
  .filter(t => t.category?.toLowerCase() === 'revenue')
  .reduce((sum, t) => sum + (t.amount || 0), 0);
const expenses = filtered
  .filter(t => t.category?.toLowerCase() === 'expense')
  .reduce((sum, t) => sum + (t.amount || 0), 0);
const savings = revenue - expenses;
const [aggregation, setAggregation] = useState('Monthly');

  // Prepare chart data (monthly aggregation)
  const chartData = React.useMemo(() => {
    const dataMap: { [key: string]: { income: number; expenses: number } } = {};
  
    filtered.forEach(t => {
      const date = new Date(t.date);
      let key = '';
  
      if (aggregation === 'Monthly') {
        key = date.toLocaleString('default', { month: 'short' }); // Jan, Feb...
      } else if (aggregation === 'Weekly') {
        const week = Math.ceil(date.getDate() / 7);
        key = `${date.toLocaleString('default', { month: 'short' })} W${week}`;
      } else if (aggregation === 'Daily') {
        key = date.toLocaleDateString('en-GB'); // e.g., 26/06/2025
      }
  
      if (!dataMap[key]) {
        dataMap[key] = { income: 0, expenses: 0 };
      }
  
      if (t.category?.toLowerCase() === 'revenue') {
        dataMap[key].income += t.amount || 0;
      } else {
        dataMap[key].expenses += t.amount || 0;
      }
    });
  
    // Convert to array and sort by key (for correct ordering)
    return Object.entries(dataMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([label, values]) => ({
        month: label,
        income: values.income,
        expenses: values.expenses,
      }));
  }, [filtered, aggregation]);
  
  // Filter transactions based on search
  
  

  const sortedTransactions = [...filtered].sort((a, b) => {
    if (sortOrder === 'date-desc') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortOrder === 'date-asc') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortOrder === 'amount-asc') {
      return (a.amount || 0) - (b.amount || 0);
    } else if (sortOrder === 'amount-desc') {
      return (b.amount || 0) - (a.amount || 0);
    }
    return 0;
  });
  
  

  // Recent transactions (last 3)
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  const navItems = [
    { name: 'Dashboard', icon: '📊', isActive: true },
    { name: 'Transactions', icon: '💳', isActive: false },
    { name: 'Wallet', icon: '💰', isActive: false },
    { name: 'Analytics', icon: '📈', isActive: false },
    { name: 'Personal', icon: '👤', isActive: false },
    { name: 'Messages', icon: '💬', isActive: false },
    { name: 'Settings', icon: '⚙️', isActive: false },
  ];

  const MetricCard = ({ title, amount, icon, color }: {
    title: string;
    amount: number;
    icon: string;
    color: string;
  }) => (
    <Card bg="gray.800" borderRadius="xl" border="1px solid" borderColor="gray.700">
      <CardBody p={6}>
        <HStack justify="space-between" align="start">
          <VStack align="start" spacing={2}>
            <Text color="gray.400" fontSize="sm" fontWeight="medium">{title}</Text>
            <Text color="white" fontSize="2xl" fontWeight="bold">
              ${amount.toLocaleString()}
            </Text>
          </VStack>
          <Box
            bg={`${color}.500`}
            p={3}
            borderRadius="lg"
            color="white"
            fontSize="lg"
          >
            {icon}
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );

  // Sidebar Component
  const Sidebar = ({ isMobile = false }) => (
    <VStack spacing={0} align="stretch" h="full">
      {/* Logo */}
      <Box p={6} borderBottom="1px solid" borderColor="gray.700">
        <HStack>
          <Box
            w={8}
            h={8}
            bg="green.500"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            color="white"
            fontWeight="bold"
          >
            P
          </Box>
          <Text color="white" fontSize="xl" fontWeight="bold">Penta</Text>
        </HStack>
      </Box>

      {/* Navigation */}
      <VStack spacing={1} p={4} flex={1}>
        {navItems.map((item, index) => (
          <Button
            key={index}
            w="full"
            justifyContent="flex-start"
            variant="ghost"
            leftIcon={<Text fontSize="lg">{item.icon}</Text>}
            color={item.name === activeNavItem ? "white" : "gray.400"}
            bg={item.name === activeNavItem ? "green.600" : "transparent"}
            _hover={{
              bg: item.name === activeNavItem ? "green.600" : "gray.700",
              color: "white"
            }}
            borderRadius="lg"
            h={12}
            onClick={() => {
              setActiveNavItem(item.name);
              if (isMobile) onClose();
            }}
          >
            {item.name}

          </Button>
        ))}
        
      </VStack>
    </VStack>
  
  );


  return (
    <Flex bg="gray.900" minH="100vh">
      {/* Desktop Sidebar */}
      <Box
        w="250px"
        bg="gray.800"
        borderRight="1px solid"
        borderColor="gray.700"
        display={{ base: 'none', lg: 'block' }}
      >
        <Sidebar />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg="gray.800">
          <DrawerCloseButton color="white" />
          <DrawerBody p={0}>
            <Sidebar isMobile={true} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Main Content */}
      <Box flex={1} overflow="hidden">
        {/* Header */}
        <Flex
          justify="space-between"
          align="center"
          p={6}
          borderBottom="1px solid"
          borderColor="gray.700"
          bg="gray.800"
        >
          <HStack>
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              color="white"
              display={{ base: 'flex', lg: 'none' }}
              onClick={onOpen}
            />
            <Text color="white" fontSize="2xl" fontWeight="bold">
              {activeNavItem}
            </Text>
          </HStack>
          
          <HStack spacing={4}>
            
            <InputGroup maxW="400px" display={{ base: 'none', md: 'block' }}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search..."
                bg="gray.700"
                border="1px solid"
                borderColor="gray.600"
                color="white"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'green.500', boxShadow: '0 0 0 1px #10B981' }}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </InputGroup>
            <Button
  colorScheme="red"
  size="sm"
  onClick={() => {
    logout(); // Clear token
    navigate('/api/login'); // ✅ Leading slash makes it absolute path
  }}
>
  Logout
</Button>

        
          </HStack>
        </Flex>

        {/* Dashboard Content */}
        <Box p={6} overflow="auto" h="calc(100vh - 80px)">
          {/* Mobile Search */}
          <InputGroup mb={6} display={{ base: 'block', md: 'none' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search..."
              bg="gray.800"
              border="1px solid"
              borderColor="gray.600"
              color="white"
              _placeholder={{ color: 'gray.400' }}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </InputGroup>

          {/* Metrics Cards */}
          <Grid 
            templateColumns={{ 
              base: 'repeat(2, 1fr)', 
              md: 'repeat(2, 1fr)', 
              lg: 'repeat(4, 1fr)' 
            }} 
            gap={6} 
            mb={8}
          >
            <MetricCard
              title="Balance"
              amount={totalBalance}
              icon="💰"
              color="green"
            />
            <MetricCard
              title="Revenue"
              amount={revenue}
              icon="📈"
              color="blue"
            />
            <MetricCard
              title="Expenses"
              amount={expenses}
              icon="💳"
              color="purple"
            />
            <MetricCard
              title="Savings"
              amount={savings}
              icon="💎"
              color="teal"
            />
          </Grid>

          {/* Main Content Grid */}
          <Grid 
            templateColumns={{ base: '1fr', xl: '2fr 1fr' }} 
            gap={6}
            mb={8}
          >
            {/* Chart Section */}
            <Card bg="gray.800" borderRadius="xl" border="1px solid" borderColor="gray.700">
              <CardBody p={6}>
                <HStack justify="space-between" mb={6} flexWrap="wrap" spacing={4}>
                  <Text color="white" fontSize="xl" fontWeight="semibold">
                    Overview
                  </Text>
                  <HStack spacing={4} flexWrap="wrap">
                    <HStack spacing={4}>
                      <HStack>
                        <Box w={3} h={3} bg="green.500" borderRadius="full" />
                        <Text color="gray.400" fontSize="sm">Income</Text>
                      </HStack>
                      <HStack>
                        <Box w={3} h={3} bg="yellow.500" borderRadius="full" />
                        <Text color="gray.400" fontSize="sm">Expenses</Text>
                      </HStack>
                    </HStack>
                    <Select
  size="sm"
  bg="gray.700"
  border="1px solid"
  borderColor="gray.600"
  color="gray"
  value={aggregation}
  onChange={(e) => setAggregation(e.target.value)}
  maxW="120px"
>
  <option value="Monthly">Monthly</option>
  <option value="Weekly">Weekly</option>
  <option value="Daily">Daily</option>
</Select>

                  </HStack>
                </HStack>
                
                <Box h={{ base: '250px', md: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" fontSize={12} />
                      <YAxis stroke="#9CA3AF" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          color: 'white'
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="income"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: '#10B981', strokeWidth: 0, r: 4 }}
                      />
                      <Line
                        type="monotone"
                        dataKey="expenses"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={{ fill: '#F59E0B', strokeWidth: 0, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </CardBody>
            </Card>

            {/* Recent Transactions */}
            <Card bg="gray.800" borderRadius="xl" border="1px solid" borderColor="gray.700">
              <CardBody p={6}>
                <HStack justify="space-between" mb={4}>
                  <Text color="white" fontSize="xl" fontWeight="semibold">
                    Recent Transaction
                  </Text>
                  <Button
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'gray.700' }}
                  >
                    See all
                  </Button>
                </HStack>
                
                <VStack spacing={4} align="stretch">
                  {recentTransactions.map((txn, index) => (
                    <HStack key={index} justify="space-between" p={3} borderRadius="lg" _hover={{ bg: 'gray.700' }}>
                      <HStack>
                        <Avatar
                          size="sm"
                          src={txn.user_profile}
                          name={txn.user_name || `User ${txn.id}`}
                        />
                        <VStack align="start" spacing={0}>
                          <Text color="white" fontSize="sm" fontWeight="medium">
                            {txn.category === 'revenue' ? 'Transfer from' : 'Transfer to'}
                          </Text>
                          <Text color="gray.400" fontSize="xs">
                            {txn.user_name || `User ${txn.id}`}
                          </Text>
                        </VStack>
                      </HStack>
                      <Text
                        color={txn.category === 'revenue' ? 'green.400' : 'red.400'}
                        fontSize="sm"
                        fontWeight="bold"
                      >
                        {txn.category === 'revenue' ? '+' : '-'}${txn.amount?.toFixed(2)}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </CardBody>
            </Card>
          </Grid>

          {/* Transactions Table */}
          <Card bg="gray.800" borderRadius="xl" border="1px solid" borderColor="gray.700">
            <CardBody p={6}>
             

             


{/*  below export the csv them */}

<HStack spacing={4} flexWrap="wrap">
  <InputGroup maxW="300px">
    <InputLeftElement pointerEvents="none">
      <SearchIcon color="gray.400" />
    </InputLeftElement>
    <Input
      placeholder="Search for anything..."
      bg="gray.700"
      border="1px solid"
      borderColor="gray.600"
      color="white"
      _placeholder={{ color: 'gray.400' }}
      _focus={{ borderColor: 'green.500' }}
      value={search}
      onChange={e => setSearch(e.target.value)}
    />
  </InputGroup>

  <HStack spacing={2}>
  <Input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
    bg="gray.700"
    border="1px solid"
    borderColor="gray.600"
    color="white"
    size="sm"
    maxW="150px"
  />
  <Input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
    bg="gray.700"
    border="1px solid"
    borderColor="gray.600"
    color="white"
    size="sm"
    maxW="150px"
  />

<Select
  bg="gray.700"
  border="1px solid"
  borderColor="gray.600"
  color="gray"
  maxW="200px"
  value={sortOrder}
  onChange={(e) => setSortOrder(e.target.value)}
>
  <option value="date-desc">Date (Newest First)</option>
  <option value="date-asc">Date (Oldest First)</option>
  <option value="amount-desc">Amount (High to Low)</option>
  <option value="amount-asc">Amount (Low to High)</option>
</Select>

</HStack>

  {/* ✅ Add this button */}
  <Button
    onClick={handleExportCSV}
    colorScheme="green"
    variant="solid"
    size="sm"
  >
    Export CSV
  </Button>
</HStack>



              <Box overflowX="auto">
                <Table variant="simple" size="md">
                  <Thead>
                    <Tr>
                      {/* <Th color="gray.400" fontSize="xs" textTransform="none" fontWeight="medium">Name</Th>
                      <Th color="gray.400" fontSize="xs" textTransform="none" fontWeight="medium">Date</Th>
                      <Th color="gray.400" fontSize="xs" textTransform="none" fontWeight="medium">Amount</Th>
                      <Th color="gray.400" fontSize="xs" textTransform="none" fontWeight="medium">Status</Th> */}
                    

                  <Th onClick={() => handleSort('user_name')} cursor="pointer">Name</Th>
                  <Th onClick={() => handleSort('date')} cursor="pointer">Date</Th>
                  <Th onClick={() => handleSort('amount')} cursor="pointer">Amount</Th>
                  <Th>Status</Th>

                    
                    
                    </Tr>
                  </Thead>
                  <Tbody>
                    {sortedTransactions.length > 0 ? sortedTransactions.map((txn, index) => (
                      <Tr key={index} _hover={{ bg: 'gray.700' }}>
                        <Td border="none" py={4}>
                          <HStack>
                            <Avatar
                              size="sm"
                              src={txn.user_profile}
                              name={txn.user_name || `User ${txn.id}`}
                            />
                            <Text color="white" fontSize="sm" fontWeight="medium">
                              {txn.user_name || `User ${txn.id}`}
                            </Text>
                          </HStack>
                        </Td>
                        <Td border="none" py={4}>
                          <Text color="gray.400" fontSize="sm">
                            {new Date(txn.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </Text>
                        </Td>
                        <Td border="none" py={4}>
                          <Text
                            color={txn.category === 'revenue' ? 'green.400' : 'red.400'}
                            fontSize="sm"
                            fontWeight="bold"
                          >
                            {txn.category === 'revenue' ? '+' : '-'}${txn.amount?.toFixed(2)}
                          </Text>
                        </Td>
                        <Td border="none" py={4}>
                          <Badge
                            colorScheme={txn.status?.toLowerCase() === 'paid' ? 'green' : 'yellow'}
                            variant="solid"
                            borderRadius="full"
                            px={3}
                            py={1}
                            fontSize="xs"
                            textTransform="capitalize"
                          >
                            {txn.status || 'Pending'}
                          </Badge>
                        </Td>
                      </Tr>
                    )) : (
                      <Tr>
                        <Td colSpan={4} textAlign="center" py={8} border="none">
                          <Text color="gray.400">
                            {search ? `No transactions found for "${search}"` : 'No transactions available'}
                          </Text>
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </Box>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </Flex>
  );
};

export default DashboardPage;