import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';

function SignupPage({ showToast }) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emergencyEmail, setEmergencyEmail] = useState('');
    const [role, setRole] = useState('passenger');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [carModel, setCarModel] = useState('');
    const [carNumber, setCarNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (!name || !phone || !email || !password || !emergencyEmail) {
            showToast('Please fill in all fields', 'warning');
            return;
        }
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'warning');
            return;
        }
        if (role === 'driver' && (!licenseNumber || !carModel || !carNumber)) {
            showToast('Please fill in all driver details', 'warning');
            return;
        }

        setIsLoading(true);
        try {
            const userData = {
                name,
                phone,
                email,
                password,
                emergencyEmail,
                role: role === 'passenger' ? 0 : 1 // 0 for Passenger, 1 for Driver
            };

            if (role === 'driver') {
                userData.licenseNumber = licenseNumber;
                userData.carModel = carModel;
                userData.carNumber = carNumber;
            }

            await authAPI.register(userData);
            showToast('Account created successfully! Please login.', 'success');
            setTimeout(() => navigate('/login'), 1500);
        } catch (error) {
            if (error.response) {
                showToast(error.response.data.message || 'Registration failed', 'error');
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
                            <h2 className="text-center mb-4">Sign Up for RideShare</h2>
                            
                            <form onSubmit={handleSignup}>
                                <div className="mb-3">
                                    <label htmlFor="role" className="form-label">I am a</label>
                                    <select 
                                        className="form-select" 
                                        id="role" 
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        required
                                    >
                                        <option value="passenger">Passenger</option>
                                        <option value="driver">Driver</option>
                                    </select>
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Full Name</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Phone Number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control" 
                                        id="phone" 
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Enter your phone number"
                                        required
                                    />
                                </div>
                                
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
                                        placeholder="Create a password"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        id="confirmPassword" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="emergencyEmail" className="form-label">Emergency Email Address</label>
                                    <input 
                                        type="email" 
                                        className="form-control" 
                                        id="emergencyEmail" 
                                        value={emergencyEmail}
                                        onChange={(e) => setEmergencyEmail(e.target.value)}
                                        placeholder="Enter emergency contact email"
                                        required
                                    />
                                    <div className="form-text">This email will receive emergency alerts if you trigger SOS during a ride</div>
                                </div>
                                
                                {role === 'driver' && (
                                    <>
                                        <h5 className="mt-4 mb-3">Driver Information</h5>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="licenseNumber" className="form-label">License Number</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="licenseNumber" 
                                                value={licenseNumber}
                                                onChange={(e) => setLicenseNumber(e.target.value)}
                                                placeholder="Enter your license number"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="carModel" className="form-label">Car Model</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="carModel" 
                                                value={carModel}
                                                onChange={(e) => setCarModel(e.target.value)}
                                                placeholder="Enter your car model"
                                                required
                                            />
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="carNumber" className="form-label">Car Number</label>
                                            <input 
                                                type="text" 
                                                className="form-control" 
                                                id="carNumber" 
                                                value={carNumber}
                                                onChange={(e) => setCarNumber(e.target.value)}
                                                placeholder="Enter your car number"
                                                required
                                            />
                                        </div>
                                    </>
                                )}
                                
                                <div className="d-grid gap-2">
                                    <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Creating Account...
                                            </>
                                        ) : 'Sign Up'}
                                    </button>
                                </div>
                                
                                <div className="text-center mt-3">
                                    <span>Already have an account? </span>
                                    <Link to="/login" className="text-decoration-none">
                                        Login
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

export default SignupPage;