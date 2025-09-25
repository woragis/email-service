'use client';

import { useState } from 'react';
import { EmailLayout } from '../../components/email';
import { PreferencesModal } from '../../components/modals';
import { Button } from '../../components/ui';

export default function EmailPage() {
  const [showPreferences, setShowPreferences] = useState(false);

  return (
    <>
      <div className="email-page-header">
        <div className="header-content">
          <h1 className="page-title">Email</h1>
          <Button 
            variant="ghost" 
            onClick={() => setShowPreferences(true)}
            className="preferences-button"
          >
            ⚙️ Preferences
          </Button>
        </div>
      </div>

      <EmailLayout />

      <PreferencesModal 
        isOpen={showPreferences}
        onClose={() => setShowPreferences(false)}
      />
    </>
  );
}
