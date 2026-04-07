import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

const API_URL = process.env.REACT_APP_BACKEND_URL;

const Signup = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validation
    if (!email || !password || !name) {
      toast.error('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/auth/signup`, {
        email: email,
        password: password,
        name: name,
        role: 'consultant'
      });

      if (response.data) {
        toast.success('Account created successfully! Logging you in...');
        
        // Automatically log in after signup
        const loginResponse = await axios.post(`${API_URL}/api/auth/login`, {
          email: email,
          password: password
        });

        localStorage.setItem('token', loginResponse.data.token);
        localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
        setUser(loginResponse.data.user);
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Signup failed');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" data-testid="signup-page">
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://static.prod-images.emergentagent.com/jobs/1f8cd556-26ce-4a6e-9e7c-fac0f1e1bc1f/images/2dc13ba2f25b982f50c5aa00d9411ea4fa0df903963f275c02218c7413eb2e14.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-lime-400/20 to-cyan-500/20"></div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <img src="/assets/xac-logo.png" alt="XAC" className="w-16 h-16 object-contain" />
            </div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-zinc-50">
              Create Account
            </h1>
            <p className="mt-2 text-base text-zinc-400">Join XAC CRM</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6" data-testid="signup-form">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-xs tracking-wider uppercase font-bold text-zinc-500">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                data-testid="signup-name-input"
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email" className="text-xs tracking-wider uppercase font-bold text-zinc-500">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                data-testid="signup-email-input"
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password" className="text-xs tracking-wider uppercase font-bold text-zinc-500">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                data-testid="signup-password-input"
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
              />
              <p className="text-xs text-zinc-500">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-xs tracking-wider uppercase font-bold text-zinc-500">
                Confirm Password
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                data-testid="signup-confirm-password-input"
                className="bg-zinc-950 border-zinc-800 text-zinc-50"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              data-testid="signup-submit-button"
              className="w-full bg-lime-400 text-zinc-950 font-bold rounded-md px-4 py-6 hover:bg-lime-500 active:scale-95"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="text-center pt-4 border-t border-zinc-800">
            <p className="text-zinc-400">
              Already have an account?{' '}
              <Link to="/login" className="text-lime-400 hover:text-lime-300 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
