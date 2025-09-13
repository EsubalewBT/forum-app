import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import Api from '../Utils/Api.js';
import { setTokens } from '../Utils/tokenStore.js';
const Login = () => {
   const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e) => {
     
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
   
    e.preventDefault();
    const data = {
      email: formData.email,
      password: formData.password
    };
  Api.post('/login', data)
      .then(res => {
    setTokens(res.data.tokens);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        
        setFormData({
            email: '',
            password: ''
        });
        navigate('/home');
      })
      .catch(err => {
        console.error('Login failed:', err);
      });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 relative overflow-hidden">
        {/* Background with gradient shapes */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100">
          {/* Decorative shapes */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-blue-300 to-blue-400 rounded-full opacity-60 -translate-x-48 -translate-y-48"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-300 to-orange-400 rounded-full opacity-60 translate-x-48 translate-y-48"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Login Form */}
            <div className="max-w-md mx-auto lg:mx-0">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Login to your account</h2>
                  <p className="text-gray-600">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-medium underline">
                      Create a new account
                    </Link>
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="Your Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                  >
                    submit
                  </button>

                  {/* Create Account Link */}
                  <p className="text-center text-sm text-orange-500 hover:text-orange-600 mt-4">
                    <Link to="/signup" className="underline">
                      Create an account?
                    </Link>
                  </p>
                </form>
              </div>
            </div>

            {/* About Section */}
            <div className="space-y-6">
              <div className="text-orange-500 font-medium">About</div>
              <h1 className="text-4xl font-bold text-gray-900 leading-tight">
                Evangadi Networks Q&A
              </h1>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  The Student Forum is an open platform where learners connect, share
      knowledge, and solve academic challenges together. Whether you’re stuck
      on a concept or have insights to share, this is the place to collaborate.
                </p>
                <p>
                 You can ask questions on any subject, provide answers to peers, and
      learn from different perspectives. Our goal is to make learning more
      interactive, supportive, and community-driven.
                </p>
                <p>
                  You can ask questions on any subject, provide answers to peers, and
      learn from different perspectives. Our goal is to make learning more
      interactive, supportive, and community-driven.
                </p>
              </div>
              <Link to="/how" className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200">
                HOW IT WORKS
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;