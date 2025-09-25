'use client';

import { usePreferencesStore } from '../../../stores/preferences';
import { EmailSidebar } from '../EmailSidebar';
import { EmailList } from '../EmailList';
import { EmailViewer } from '../EmailViewer';
import { EmailToolbar } from '../EmailToolbar';
import { AdvancedFeaturesPanel } from '../AdvancedFeaturesPanel';

interface OutlookAdvancedLayoutProps {
  children?: React.ReactNode;
}

export function OutlookAdvancedLayout({ children }: OutlookAdvancedLayoutProps) {
  const { preferences } = usePreferencesStore();

  return (
    <div 
      className="outlook-advanced-layout"
      style={{
        '--sidebar-width': `${preferences.layout.sidebarWidth}px`,
        '--email-list-width': `${preferences.layout.emailListWidth}px`,
      } as React.CSSProperties}
    >
      {/* Enhanced three-panel layout with advanced features */}
      <div className="email-container">
        {/* Left Sidebar with advanced navigation */}
        <aside className="email-sidebar advanced">
          <EmailSidebar />
          <AdvancedFeaturesPanel />
        </aside>

        {/* Middle Panel - Email List with advanced filters */}
        <div className="email-list-panel">
          <EmailToolbar advanced />
          <EmailList />
        </div>

        {/* Right Panel - Email Content with rich features */}
        <div className="email-content-panel">
          <EmailViewer />
        </div>
      </div>

      {/* Overlay content */}
      {children}
    </div>
  );
}
