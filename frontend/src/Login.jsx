import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [loginError, setLoginError] = useState('');
    localStorage.clear();

    const handleLogin = async () => {
        setErrors({ email: '', password: '' });
        setLoginError('');

        let valid = true;
        const newErrors = { email: '', password: '' };

        if (email === '') {
            newErrors.email = 'Email is required';
            valid = false;
        }
        if (password === '') {
            newErrors.password = 'Password is required';
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address (e.g., user@example.com).';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            try {
                const response = await axios.post('http://localhost:5000/api/users/login', {
                    email: email,
                    password: password
                });

                if (response.status === 200) {
                    localStorage.setItem('token', response.data.token);
                    navigate('/chat');
                } else {
                    setLoginError('Incorrect email or password. Please try again.');
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setLoginError(error.response.data.message);
                } else {
                    setLoginError('An error occurred during login. Please try again.');
                }
            }
        }
    };

    return (
        <div className="flex flex-row h-screen">
            <div className="hidden md:flex w-1/2 justify-center items-center">
                <img src={require('./img/phone.png')} alt="phone pic" className="w-full h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <div className="max-w-sm w-full px-4 md:px-0">
                    <div className="text-center mb-6">
                        <p className="text-huge text-[#344054]">Log in to your account</p>
                        <p className="text-tiny text-[#667085]">Hello again! Log in and get productive.</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="text-tiny">Email <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full focus:outline-none focus:ring-[#26B7CD]`}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                        <div>
                            <label className="text-tiny">Password <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full focus:outline-none focus:ring-[#26B7CD]`}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                    </div>
                    {loginError && <p className="text-red-500 text-xs mt-2">{loginError}</p>}
                    <div className="flex items-center space-x-2 my-4">
                        <input id="default-checkbox" type="checkbox" className="w-5 h-5 text-[#26B7CD] border-gray-300 rounded focus:outline-none focus:ring-0" />
                        <label htmlFor="check" className="text-[#475467] text-tiny">Remember me</label>
                    </div>
                    <button
                        className="border rounded-md p-2 max-w-md w-full my-6 bg-[#E4E7EC] text-[#98A2B3] hover:bg-[#26B7CD] hover:text-white rounded transition duration-300 ease-in-out text-tiny"
                        onClick={handleLogin}
                    >
                        Log in
                    </button>
                    <div>
                        <label className="text-[#667085] text-tiny">Don't have an account? <a href='/signup' className="text-[#197A89]">Signup</a></label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;