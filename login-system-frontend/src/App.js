import React from "react";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AdminRoute from './components/AdminRoute';
import Login from "./components/Login";
import ProtectedRoute from './components/ProtectedRoute';
import Register from "./components/Register";
import { AuthProvider } from './context/AuthContext';
// import Customers from './pages/Customers';
import SalesStats from './components/SalesStats';
import Home from "./pages/Home";
import Orders from "./pages/Order";
import OrderHistory from './pages/OrderHistory';
// import Revenue from './pages/Revenue';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Default route that redirects to /login */}
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route 
                        path="/home" 
                        element={
                            <ProtectedRoute>
                                <Home />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/orders" 
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/order-history" 
                        element={
                            <ProtectedRoute>
                                <OrderHistory />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/revenue" 
                        element={
                            <ProtectedRoute>
                                <AdminRoute>
                                    <SalesStats />
                                </AdminRoute>
                            </ProtectedRoute>
                        } 
                    />
                    {/* <Route path="/customers" element={<AdminRoute><Customers /></AdminRoute>} /> */}
                    {/* <Route path="/revenue" element={<AdminRoute><Revenue /></AdminRoute>} /> */}
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
