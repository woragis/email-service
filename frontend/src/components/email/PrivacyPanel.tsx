'use client';

import { usePreferencesStore } from '../../stores/preferences';
import { Button } from '../ui';

export function PrivacyPanel() {
  const { preferences, updatePrivacy } = usePreferencesStore();

  const handlePrivacyToggle = (setting: keyof typeof preferences.privacy) => {
    updatePrivacy({
      [setting]: !preferences.privacy[setting],
    });
  };

  return (
    <div className="privacy-panel">
      <h3>Privacy & Security</h3>
      
      <div className="privacy-settings">
        <div className="privacy-setting">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={preferences.privacy.trackOpens}
              onChange={() => handlePrivacyToggle('trackOpens')}
            />
            Track Email Opens
          </label>
          <p className="privacy-description">
            Monitor when recipients open your emails
          </p>
        </div>

        <div className="privacy-setting">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={preferences.privacy.trackClicks}
              onChange={() => handlePrivacyToggle('trackClicks')}
            />
            Track Link Clicks
          </label>
          <p className="privacy-description">
            Monitor when recipients click links in emails
          </p>
        </div>

        <div className="privacy-setting">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={preferences.privacy.encryptEmails}
              onChange={() => handlePrivacyToggle('encryptEmails')}
            />
            End-to-End Encryption
          </label>
          <p className="privacy-description">
            Encrypt emails for maximum security
          </p>
        </div>

        <div className="privacy-setting">
          <label className="privacy-label">
            <input
              type="checkbox"
              checked={preferences.privacy.autoDelete}
              onChange={() => handlePrivacyToggle('autoDelete')}
            />
            Auto-Delete Old Emails
          </label>
          <p className="privacy-description">
            Automatically delete emails older than 30 days
          </p>
        </div>
      </div>

      <div className="privacy-actions">
        <Button variant="primary" size="sm">
          🔒 Secure Compose
        </Button>
        <Button variant="ghost" size="sm">
          🔐 Key Management
        </Button>
      </div>
    </div>
  );
}
