'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMusic } from 'react-icons/fa';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useRegister } from '@/hooks';
import { RegisterRequest } from '@/types/api';
export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterRequest>({
    email: '',
    username: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  
  const router = useRouter();
  const registerMutation = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData, {
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
            <h1 className="auth-title">Join Jazz Melodic</h1>
            <p className="auth-subtitle">
              Create your account and start your musical journey with us
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                label="First name"
                placeholder="Enter your first name"
              />

              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                label="Last name"
                placeholder="Enter your last name"
              />
            </div>

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
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              label="Username"
              placeholder="Choose a username"
            />

            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
              label="Password"
              placeholder="Create a password (min. 8 characters)"
            />

            {registerMutation.error && (
              <div className="form-error">
                <p className="error-message">{registerMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={registerMutation.isPending}
              disabled={registerMutation.isPending}
              className="auth-button"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <div className="auth-footer">
            <p className="auth-footer-text">
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </p>
            <p className="auth-terms">
              By creating an account, you agree to our{' '}
              <Link href="/terms" className="auth-link">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="auth-link">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
