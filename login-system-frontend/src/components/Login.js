import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Login.css";
import LotteryBackground from "./LotteryBackground";

const API_URL = process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5000/api';

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const data = await response.json();
            
            if (data.token) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                await login(formData.email, formData.password);
                navigate("/home");
            } else {
                alert("Login failed: " + (data.message || "Unknown error"));
            }
        } catch (error) {
            console.error("Login error:", error);
            alert(`Login failed: ${error.message}`);
        }
    };

    return (
        <div className="auth-container">
            <LotteryBackground />
            <div className="login-wrapper">
                <div className="login-form-container">
                    <div className="form-header">
                        <h2 className="login-title">Welcome Back!</h2>
                        <p className="login-subtitle">Enter your credentials to access your account</p>
                    </div>

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                className="login-input"
                                required
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit" className="login-button">
                            Login
                        </Button>
                    </Form>

                    <p className="register-link">
                        Don't have an account?{" "}
                        <a href="/register">Register Now</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;