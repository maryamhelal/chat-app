import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Signup() {
    const navigate = useNavigate();
    const [firstname, setFirstName] = useState('');
    const [lastname, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({ firstname: '', lastname: '', email: '', username: '', password: '' });
    const [signupError, setSignupError] = useState('');

    const handleSignup = async () => {
        setErrors({ firstname: '', lastname: '', email: '', username: '', password: '' });
        setSignupError('');

        let valid = true;
        const newErrors = { firstname: '', lastname: '', email: '', username: '', password: '' };

        if (firstname === '') {
            newErrors.firstname = 'First name is required';
            valid = false;
        }
        if (lastname === '') {
            newErrors.lastname = 'Last name is required';
            valid = false;
        }
        if (email === '') {
            newErrors.email = 'Email is required';
            valid = false;
        }
        if (username === '') {
            newErrors.username = 'Username is required';
            valid = false;
        }
        if (password === '') {
            newErrors.password = 'Password is required';
            valid = false;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!emailPattern.test(email)) {
            newErrors.email = 'Please enter a valid email address (e.g., user@example.com).';
            valid = false;
        }
        if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters long';
            valid = false;
        } else if (!passwordPattern.test(password)) {
            newErrors.password = 'Password must include at least one uppercase letter, one lowercase letter, one number, and one special character';
            valid = false;
        }

        setErrors(newErrors);

        if (valid) {
            try {
                const response = await axios.post('http://localhost:5000/api/users/signup', {
                    firstName: firstname,
                    lastName: lastname,
                    email: email,
                    username: username,
                    password: password
                });

                if (response.status===200) {
                    window.alert('Signup was successful! Redirecting to login page.');
                    navigate('/');
                } else {
                    setSignupError('Incorrect data entered. Please try again.');
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    setSignupError(error.response.data.message);
                } else {
                    setSignupError('An error occurred during signup. Please try again.');
                }
            }
        }
    };

    return (
        <div className="flex flex-row h-screen">
            <div className="hidden md:flex w-1/2 flex justify-center items-center">
                <img src={require('./img/phone.png')} alt="phone pic" className="w-full h-full" />
            </div>
            <div className="w-full md:w-1/2 flex flex-col items-center justify-center">
                <div className="max-w-sm w-full px-4 md:px-0">
                    <div className="text-center mb-6">
                        <p className="text-huge text-[#344054]">Create an account</p>
                        <p className="text-tiny text-[#667085]">Sign up now to claim your free space.</p>
                    </div>
                    <div className="space-y-4">
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <label className="text-tiny">First name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`border ${errors.firstname ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full focus:outline-none focus:ring-[#26B7CD]`}
                                    placeholder="First Name"
                                    value={firstname}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    required
                                />
                                {errors.firstname && <p className="text-red-500 text-xs mt-1">{errors.firstname}</p>}
                            </div>
                            <div className="flex-1">
                                <label className="text-tiny">Last name <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    className={`border ${errors.lastname ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full focus:outline-none focus:ring-[#26B7CD]`}
                                    placeholder="Last Name"
                                    value={lastname}
                                    onChange={(e) => setLastName(e.target.value)}
                                    required
                                />
                                {errors.lastname && <p className="text-red-500 text-xs mt-1">{errors.lastname}</p>}
                            </div>
                        </div>
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
                            <label className="text-tiny">Username <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                className={`border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-md p-2 w-full focus:outline-none focus:ring-[#26B7CD]`}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username}</p>}
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
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                                >
                                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-gray-500`}></i>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                    </div>
                    {signupError && <p className="text-red-500 text-xs mt-2">{signupError}</p>}
                    <button
                        className="border rounded-md p-2 max-w-md w-full my-6 bg-[#E4E7EC] text-[#98A2B3] hover:bg-[#26B7CD] hover:text-white rounded transition duration-300 ease-in-out text-tiny"
                        onClick={handleSignup}
                    >
                        Signup
                    </button>
                    <div>
                        <label className="text-[#667085] text-tiny">Already have an account? <a href='/' className="text-[#197A89]">Login</a></label>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Signup;