'use client';

import { usePreferencesStore } from '../../stores/preferences';
import { GmailClassicLayout } from './layouts/GmailClassicLayout';
import { OutlookAdvancedLayout } from './layouts/OutlookAdvancedLayout';
import { AppleMinimalLayout } from './layouts/AppleMinimalLayout';
import { ProtonPrivacyLayout } from './layouts/ProtonPrivacyLayout';

interface EmailLayoutProps {
  children?: React.ReactNode;
}

export function EmailLayout({ children }: EmailLayoutProps) {
  const { preferences } = usePreferencesStore();

  const renderLayout = () => {
    switch (preferences.emailUIStyle) {
      case 'gmail-classic':
        return <GmailClassicLayout>{children}</GmailClassicLayout>;
      case 'outlook-advanced':
        return <OutlookAdvancedLayout>{children}</OutlookAdvancedLayout>;
      case 'apple-minimal':
        return <AppleMinimalLayout>{children}</AppleMinimalLayout>;
      case 'proton-privacy':
        return <ProtonPrivacyLayout>{children}</ProtonPrivacyLayout>;
      default:
        return <GmailClassicLayout>{children}</GmailClassicLayout>;
    }
  };

  return (
    <div className={`email-layout ${preferences.emailUIStyle} ${preferences.theme}`}>
      {renderLayout()}
    </div>
  );
}
