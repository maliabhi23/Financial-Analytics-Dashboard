import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import { AuthProvider } from './context/AuthContext';

import PrivateRoute from './Component/PrivateRoute';  // Make sure this exists and is correct

import { useEffect } from "react";




function App() {
  useEffect(() => {
    if (window.location.pathname !== "/api/login") {
      window.location.href = "/api/login";
    }
  }, []);
  
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
        <Routes>
  <Route path="/api/login" element={<LoginPage />} />
  <Route
    path="/api/login/dashboard"
    element={
      <PrivateRoute>
        <DashboardPage />
      </PrivateRoute>
    }
  />
</Routes>
   </Router>
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
