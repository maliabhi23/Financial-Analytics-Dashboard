// import React, { createContext, useContext, useState } from 'react';

// const AuthContext = createContext<any>(null);
// export const useAuth = () => useContext(AuthContext);

// export const AuthProvider = ({ children }: any) => {
//   const [token, setToken] = useState(localStorage.getItem('token'));
//   const login = (token: string) => {
//     localStorage.setItem('token', token);
//     setToken(token);
//   };
//   const logout = () => {
//     localStorage.removeItem('token');
//     setToken(null);
//   };
//   return (
//     <AuthContext.Provider value={{ token, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
