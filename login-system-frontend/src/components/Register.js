import axios from "axios";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import LotteryBackground from "./LotteryBackground";
import "./Register.css";

function Register() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        role: "user"
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                formData
            );

            if (response.data.success) {
                navigate("/login");
            } else {
                setError(response.data.message || "Registration failed");
            }
        } catch (error) {
            console.error('Registration error:', error);
            setError(
                error.response?.data?.message ||
                error.message ||
                "Registration failed"
            );
        }
    };

    return (
        <div className="auth-container">
            <LotteryBackground />
            <div className="register-wrapper">
                <div className="register-form-container">
                    <div className="form-header">
                        <h2 className="register-title">Create Account</h2>
                        <p className="register-subtitle">Join our lottery management system</p>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-4">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                placeholder="Enter username"
                                value={formData.username}
                                onChange={handleChange}
                                className="register-input"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={handleChange}
                                className="register-input"
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
                                className="register-input"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-4">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="register-input"
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </Form.Select>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="register-button">
                            Create Account
                        </Button>
                    </Form>

                    <p className="login-link">
                        Already have an account?{" "}
                        <a href="/login">Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;
