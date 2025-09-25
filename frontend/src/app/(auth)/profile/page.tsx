'use client';

import { useAuth } from '@/stores/auth';
import { useMe } from '@/hooks';
import { Button } from '@/components/ui';
import { useLogout } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
export default function ProfilePage() {
  const { isAuthenticated, user } = useAuth();
  const { data: userData, isLoading, error } = useMe();
  const logoutMutation = useLogout();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-loading">
            <div className="loading-spinner"></div>
            <p>Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="container">
          <div className="profile-error">
            <h2>Error loading profile</h2>
            <p>{error.message}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentUser = userData || user;

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1 className="profile-title">Your Profile</h1>
          <p className="profile-subtitle">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="profile-content">
          <div className="profile-card">
            <div className="profile-info">
              <div className="profile-avatar">
                <span className="avatar-placeholder">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              
              <div className="profile-details">
                <h2 className="profile-name">
                  {currentUser?.firstName && currentUser?.lastName
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : currentUser?.username}
                </h2>
                <p className="profile-username">@{currentUser?.username}</p>
                <p className="profile-email">{currentUser?.email}</p>
                
                <div className="profile-status">
                  <span className={`status-badge ${currentUser?.isVerified ? 'verified' : 'unverified'}`}>
                    {currentUser?.isVerified ? '✓ Verified' : '○ Unverified'}
                  </span>
                  <span className={`status-badge ${currentUser?.isActive ? 'active' : 'inactive'}`}>
                    {currentUser?.isActive ? '● Active' : '○ Inactive'}
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-actions">
              <Button variant="secondary" size="md">
                Edit Profile
              </Button>
              <Button variant="secondary" size="md">
                Change Password
              </Button>
              <Button 
                variant="ghost" 
                size="md"
                onClick={handleLogout}
                disabled={logoutMutation.isPending}
              >
                {logoutMutation.isPending ? 'Signing out...' : 'Sign Out'}
              </Button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-card">
              <h3>Account Created</h3>
              <p>{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
            
            <div className="stat-card">
              <h3>Last Updated</h3>
              <p>{currentUser?.updatedAt ? new Date(currentUser.updatedAt).toLocaleDateString() : 'Unknown'}</p>
            </div>
            
            <div className="stat-card">
              <h3>Account Status</h3>
              <p>{currentUser?.isActive ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
