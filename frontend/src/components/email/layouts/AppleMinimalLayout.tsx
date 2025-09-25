'use client';

import { usePreferencesStore } from '../../../stores/preferences';
import { EmailSidebar } from '../EmailSidebar';
import { EmailList } from '../EmailList';
import { EmailViewer } from '../EmailViewer';
import { EmailToolbar } from '../EmailToolbar';

interface AppleMinimalLayoutProps {
  children?: React.ReactNode;
}

export function AppleMinimalLayout({ children }: AppleMinimalLayoutProps) {
  const { preferences } = usePreferencesStore();

  return (
    <div 
      className="apple-minimal-layout"
      style={{
        '--sidebar-width': `${preferences.layout.sidebarWidth}px`,
        '--email-list-width': `${preferences.layout.emailListWidth}px`,
      } as React.CSSProperties}
    >
      {/* Two-panel layout for minimal design */}
      <div className="email-container">
        {/* Left Sidebar - Minimal and clean */}
        <aside className="email-sidebar minimal">
          <EmailSidebar />
        </aside>

        {/* Main Panel - Email List and Content */}
        <div className="email-main-panel">
          <EmailToolbar minimal />
          <div className="email-content-area">
            <EmailList />
            {preferences.layout.showPreview && (
              <div className="email-preview">
                <EmailViewer />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay content */}
      {children}
    </div>
  );
}
