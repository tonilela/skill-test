import React from 'react';
import { Navigate } from 'react-router-dom';

import PropTypes from 'prop-types';

export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.token;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired, // Use 'node' type for children
};

