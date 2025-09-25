'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMusic } from 'react-icons/fa';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useLogin } from '@/hooks';
import { LoginRequest } from '@/types/api';
export default function LoginPage() {
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
  });
  
  const router = useRouter();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <span className="logo-icon"><FaMusic /></span>
              <span className="logo-text">Jazz Melodic</span>
            </Link>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to your account to continue your musical journey
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              label="Email address"
              placeholder="Enter your email"
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              label="Password"
              placeholder="Enter your password"
            />

            {loginMutation.error && (
              <div className="form-error">
                <p className="error-message">{loginMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loginMutation.isPending}
              disabled={loginMutation.isPending}
              className="auth-button"
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="auth-link">
                Sign up
              </Link>
            </p>
            <Link href="/forgot-password" className="auth-link">
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
