import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Users, Shield, Clock, Bell } from 'lucide-react';
import toast from 'react-hot-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Login failed. Please try again.');
    }
  };

  const demoAccounts = [
    { email: 'john@example.com', role: 'Admin', name: 'John Kamau' },
    { email: 'mary@example.com', role: 'Member', name: 'Mary Wanjiku' },
    { email: 'peter@example.com', role: 'Member', name: 'Peter Ochieng' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold text-primary-900 mb-4">
            ChamaApp
          </h1>
          <p className="text-xl text-primary-700 mb-8">
            Simplify your group savings with automated contributions and smart notifications
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary-200 p-2 rounded-lg">
                <Users className="text-primary-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Group Management</h3>
                <p className="text-primary-600">Manage members and contributions easily</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-200 p-2 rounded-lg">
                <Clock className="text-primary-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Automated Reminders</h3>
                <p className="text-primary-600">Never miss a contribution deadline</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-200 p-2 rounded-lg">
                <Shield className="text-primary-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Secure Payments</h3>
                <p className="text-primary-600">Multiple payment methods supported</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="bg-primary-200 p-2 rounded-lg">
                <Bell className="text-primary-700" size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-primary-900">Real-time Updates</h3>
                <p className="text-primary-600">Track payments and status instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                required
              />
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-4 text-center">Demo Accounts (Password: password)</p>
            <div className="space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.email}
                  onClick={() => {
                    setEmail(account.email);
                    setPassword('password');
                  }}
                  className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-900">{account.name}</p>
                      <p className="text-sm text-gray-600">{account.email}</p>
                    </div>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {account.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;