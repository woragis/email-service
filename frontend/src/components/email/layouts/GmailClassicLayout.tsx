'use client';

import { usePreferencesStore } from '../../../stores/preferences';
import { EmailSidebar } from '../EmailSidebar';
import { EmailList } from '../EmailList';
import { EmailViewer } from '../EmailViewer';
import { EmailToolbar } from '../EmailToolbar';

interface GmailClassicLayoutProps {
  children?: React.ReactNode;
}

export function GmailClassicLayout({ children }: GmailClassicLayoutProps) {
  const { preferences } = usePreferencesStore();

  return (
    <div 
      className="gmail-classic-layout"
      style={{
        '--sidebar-width': `${preferences.layout.sidebarWidth}px`,
        '--email-list-width': `${preferences.layout.emailListWidth}px`,
      } as React.CSSProperties}
    >
      {/* Three-panel layout */}
      <div className="email-container">
        {/* Left Sidebar */}
        <aside className="email-sidebar">
          <EmailSidebar />
        </aside>

        {/* Middle Panel - Email List */}
        <div className="email-list-panel">
          <EmailToolbar />
          <EmailList />
        </div>

        {/* Right Panel - Email Content */}
        <div className="email-content-panel">
          <EmailViewer />
        </div>
      </div>

      {/* Overlay content (modals, etc.) */}
      {children}
    </div>
  );
}
