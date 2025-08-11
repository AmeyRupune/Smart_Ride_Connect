import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function LoginPage({ onLogin, showToast }) {
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!selectedRole) {
            showToast('Please select your role', 'warning');
            return;
        }
        if (!email || !password) {
            showToast('Please enter your email and password', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const response = await authAPI.login({
                email,
                password,
                role: selectedRole
            });

            const { token, user } = response.data;
            localStorage.setItem('token', token);
            onLogin(selectedRole, user.name);
            navigate('/dashboard');
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message || 'Login failed', 'error');
            } else {
                showToast('Network error. Please try again.', 'error');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">Login to RideShare</h2>
                            
                            <div className="role-selection mb-4">
                                <div 
                                    className={`role-card ${selectedRole === 'passenger' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('passenger')}
                                >
                                    <i className="bi bi-person-fill"></i>
                                    <h5>Passenger</h5>
                                </div>
                                <div 
                                    className={`role-card ${selectedRole === 'driver' ? 'selected' : ''}`}
                                    onClick={() => handleRoleSelect('driver')}
                                >
                                    <i className="bi bi-person-badge-fill"></i>
                                    <h5>Driver</h5>
                                </div>
                            </div>
                            
                            <form onSubmit={handleLogin}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="email" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Enter your email"
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </div>
                                <div className="mb-3 text-end">
                                    <Link to="/forgot-password" className="text-decoration-none">Forgot Password?</Link>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Logging in...
                                            </>
                                        ) : 'Login'}
                                    </button>
                                </div>
                                <div className="text-center mt-3">
                                    <span>Not Registered? </span>
                                    <Link to="/signup" className="text-decoration-none">
                                        Sign Up
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;