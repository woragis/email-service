'use client';

import { usePreferencesStore } from '../../../stores/preferences';
import { EmailSidebar } from '../EmailSidebar';
import { EmailList } from '../EmailList';
import { EmailViewer } from '../EmailViewer';
import { EmailToolbar } from '../EmailToolbar';
import { PrivacyPanel } from '../PrivacyPanel';

interface ProtonPrivacyLayoutProps {
  children?: React.ReactNode;
}

export function ProtonPrivacyLayout({ children }: ProtonPrivacyLayoutProps) {
  const { preferences } = usePreferencesStore();

  return (
    <div 
      className="proton-privacy-layout"
      style={{
        '--sidebar-width': `${preferences.layout.sidebarWidth}px`,
        '--email-list-width': `${preferences.layout.emailListWidth}px`,
      } as React.CSSProperties}
    >
      {/* Three-panel layout with privacy focus */}
      <div className="email-container">
        {/* Left Sidebar with privacy controls */}
        <aside className="email-sidebar privacy">
          <EmailSidebar />
          <PrivacyPanel />
        </aside>

        {/* Middle Panel - Email List with encryption indicators */}
        <div className="email-list-panel">
          <EmailToolbar privacy />
          <EmailList />
        </div>

        {/* Right Panel - Email Content with security features */}
        <div className="email-content-panel">
          <EmailViewer />
        </div>
      </div>

      {/* Overlay content */}
      {children}
    </div>
  );
}
