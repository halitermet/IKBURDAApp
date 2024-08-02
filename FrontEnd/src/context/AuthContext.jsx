import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null});

  useEffect(() => {
    if (auth.token) {
      const decodedToken = decodeToken(auth.token);
      if (decodedToken) {
        const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        //const mustChangePassword = decodedToken["mustChangePassword"];
        setAuth({ ...auth, role});
      } else {
        setAuth({ ...auth, role: null});
      }
    } else {
      const token = localStorage.getItem('token');
      if (token) {
        const decodedToken = decodeToken(token);
        if (decodedToken) {
          const role = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
          //const mustChangePassword = decodedToken["mustChangePassword"];
          setAuth({ token, role});
        } else {
          setAuth({ token, role: null });
        }
      } else {
        console.log('No token found in localStorage');
      }
    }
  }, [auth.token]);

  const decodeToken = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));

      const decoded = JSON.parse(jsonPayload);
      return decoded;
    } catch (error) {
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
