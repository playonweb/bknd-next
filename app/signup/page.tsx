'use client'

import { useState } from 'react';
import { useAuth } from 'bknd/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await register({ email, password });
      if (res && res.token) {
        router.push('/');
      } else {
        setError('Signup failed');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-[#e0e5ec]">
      <div className="w-full max-w-md neu-flat rounded-3xl p-8 flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide text-[#4a5568]">
          Sign Up
        </h1>
        <p className="text-center text-[#4a5568] opacity-60 -mt-2 mb-4">
          Join the Neu ToDo community
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#4a5568] px-2 opacity-80">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neu-pressed rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-[#a3b1c6] text-[#4a5568] font-medium"
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#4a5568] px-2 opacity-80">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neu-pressed rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-[#a3b1c6] text-[#4a5568] font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-[#4a5568] px-2 opacity-80">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="neu-pressed rounded-2xl px-6 py-4 outline-none transition-all placeholder:text-[#a3b1c6] text-[#4a5568] font-medium"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center font-medium bg-red-100/50 py-2 rounded-xl">
              {error}
            </p>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`neu-flat rounded-2xl py-4 font-bold text-[#4a5568] transition-all hover:-translate-y-1 active:translate-y-0 active:neu-pressed ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="text-center text-sm text-[#4a5568] opacity-80 mt-2">
          Already have an account? {' '}
          <Link href="/login" className="font-bold hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
