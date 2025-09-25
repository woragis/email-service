'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaMusic } from 'react-icons/fa';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useResetPassword } from '@/hooks';

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [token, setToken] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const resetPasswordMutation = useResetPassword();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      router.push('/forgot-password');
      return;
    }
    setToken(tokenParam);
  }, [searchParams, router]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'Password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !token) {
      return;
    }

    resetPasswordMutation.mutate(
      {
        token,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          router.push('/login?message=password-reset-success');
        },
      }
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <Link href="/" className="auth-logo">
                <span className="logo-icon"><FaMusic /></span>
                <span className="logo-text">Jazz Melodic</span>
              </Link>
              <h1 className="auth-title">Invalid reset link</h1>
              <p className="auth-subtitle">
                The password reset link is invalid or has expired.
              </p>
            </div>

            <div className="auth-form">
              <div className="error-message">
                <p>
                  This password reset link is invalid or has expired. Please request a new one.
                </p>
              </div>

              <div className="auth-actions">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => router.push('/forgot-password')}
                  className="auth-button"
                >
                  Request new reset link
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => router.push('/login')}
                  className="auth-button"
                >
                  Back to login
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <Link href="/" className="auth-logo">
              <span className="logo-icon"><FaMusic /></span>
              <span className="logo-text">Jazz Melodic</span>
            </Link>
            <h1 className="auth-title">Reset your password</h1>
            <p className="auth-subtitle">
              Enter your new password below to complete the reset process.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              minLength={8}
              label="New password"
              placeholder="Enter your new password (min. 8 characters)"
              error={errors.newPassword}
            />

            <Input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={8}
              label="Confirm new password"
              placeholder="Confirm your new password"
              error={errors.confirmPassword}
            />

            {resetPasswordMutation.error && (
              <div className="form-error">
                <p className="error-message">{resetPasswordMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
              className="auth-button"
            >
              {resetPasswordMutation.isPending ? 'Resetting password...' : 'Reset password'}
            </Button>
          </form>

          <div className="auth-footer">
            <Link href="/login" className="auth-link">
              ← Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
