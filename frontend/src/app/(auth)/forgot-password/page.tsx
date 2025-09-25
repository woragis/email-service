'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaMusic } from 'react-icons/fa';
import Link from 'next/link';
import { Button, Input } from '@/components/ui';
import { useRequestPasswordReset } from '@/hooks';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const router = useRouter();
  const resetRequestMutation = useRequestPasswordReset();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    resetRequestMutation.mutate(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  const handleResendEmail = () => {
    resetRequestMutation.mutate(email, {
      onSuccess: () => {
        setIsSubmitted(true);
      },
    });
  };

  if (isSubmitted) {
    return (
      <div className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <Link href="/" className="auth-logo">
                <span className="logo-icon"><FaMusic /></span>
                <span className="logo-text">Jazz Melodic</span>
              </Link>
              <h1 className="auth-title">Check your email</h1>
              <p className="auth-subtitle">
                We&apos;ve sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            <div className="auth-form">
              <div className="success-message">
                <div className="success-icon">✓</div>
                <p>
                  If an account with that email exists, we&apos;ve sent you a password reset link. 
                  Please check your inbox and follow the instructions to reset your password.
                </p>
                <p className="text-sm text-gray-600 mt-4">
                  Didn&apos;t receive the email? Check your spam folder or{' '}
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    className="auth-link"
                    disabled={resetRequestMutation.isPending}
                  >
                    try again
                  </button>
                </p>
              </div>

              <div className="auth-actions">
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
            <h1 className="auth-title">Forgot your password?</h1>
            <p className="auth-subtitle">
              No worries! Enter your email address and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              label="Email address"
              placeholder="Enter your email"
            />

            {resetRequestMutation.error && (
              <div className="form-error">
                <p className="error-message">{resetRequestMutation.error.message}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={resetRequestMutation.isPending}
              disabled={resetRequestMutation.isPending || !email}
              className="auth-button"
            >
              {resetRequestMutation.isPending ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>

          <div className="auth-footer">
            <Link href="/login" className="auth-link">
              ← Back to login
            </Link>
            <p className="auth-footer-text">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="auth-link">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
