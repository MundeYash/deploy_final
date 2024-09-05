import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  const loadUser = async () => {
    if (localStorage.token) {
      setAuth({ ...auth, token: localStorage.token });
      axios.defaults.headers.common['x-auth-token'] = localStorage.token;
      try {
        const res = await axios.get('/api/auth/user');
        setAuth({ token: localStorage.token, user: res.data });
      } catch (err) {
        console.error(err);
      }
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
