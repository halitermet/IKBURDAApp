import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const PrivateRoute = ({ element: Component, roles, ...rest }) => {
  const { auth } = useContext(AuthContext);


  if (!auth.token) {
    return <Navigate to="/login" />;
  }

  /*if (auth.mustChangePassword === false) {
    return <Navigate to="/resetPassword" />;
  }*/

  if (roles && !roles.includes(auth.role)) {
    return <Navigate to="/login" />;
  }

  return <Component {...rest} />;
};

export default PrivateRoute;
