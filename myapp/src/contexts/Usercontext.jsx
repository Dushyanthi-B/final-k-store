// src/contexts/UserContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const Usercontext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('user'));
    if (storedUser) {
      console.log("User found in storage:", storedUser);
      setUser(storedUser);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setUser(null);
  };

  return (
    <Usercontext.Provider value={{ user, setUser, logout }}>
      {children}
    </Usercontext.Provider>
  );
};
