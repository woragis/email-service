'use client';

import { useState } from 'react';
import { usePreferencesStore } from '../../stores/preferences';
import { EmailListItem } from './EmailListItem';

interface EmailListProps {
  className?: string;
}

// Mock email data
const mockEmails = [
  {
    id: '1',
    from: 'John Doe',
    fromEmail: 'john@example.com',
    subject: 'Meeting Tomorrow at 2 PM',
    preview: 'Hi, just confirming our meeting tomorrow at 2 PM. Looking forward to discussing the project...',
    time: '2:30 PM',
    date: 'Today',
    isRead: false,
    isStarred: true,
    hasAttachments: true,
    labels: ['work'],
  },
  {
    id: '2',
    from: 'Sarah Wilson',
    fromEmail: 'sarah@company.com',
    subject: 'Project Update - Q4 Results',
    preview: 'The Q4 results are in and they look great! We exceeded our targets by 15%...',
    time: '11:45 AM',
    date: 'Today',
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    labels: ['work', 'important'],
  },
  {
    id: '3',
    from: 'Newsletter Team',
    fromEmail: 'newsletter@techblog.com',
    subject: 'Weekly Tech News - AI Breakthroughs',
    preview: 'This week in tech: New AI models, quantum computing advances, and more...',
    time: '9:15 AM',
    date: 'Today',
    isRead: false,
    isStarred: false,
    hasAttachments: false,
    labels: ['newsletters'],
  },
  {
    id: '4',
    from: 'Mike Johnson',
    fromEmail: 'mike@startup.io',
    subject: 'Coffee Chat This Friday?',
    preview: 'Hey! Would you be interested in grabbing coffee this Friday? I have some exciting news...',
    time: '4:20 PM',
    date: 'Yesterday',
    isRead: true,
    isStarred: false,
    hasAttachments: false,
    labels: ['personal'],
  },
  {
    id: '5',
    from: 'LinkedIn',
    fromEmail: 'notifications@linkedin.com',
    subject: 'You have 3 new connection requests',
    preview: 'You have 3 new connection requests waiting for your response...',
    time: '8:30 AM',
    date: 'Yesterday',
    isRead: false,
    isStarred: false,
    hasAttachments: false,
    labels: ['social'],
  },
];

export function EmailList({ className }: EmailListProps) {
  const { preferences } = usePreferencesStore();
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const handleEmailSelect = (emailId: string, selected: boolean) => {
    if (selected) {
      setSelectedEmails(prev => [...prev, emailId]);
    } else {
      setSelectedEmails(prev => prev.filter(id => id !== emailId));
    }
  };

  const handleSelectAll = () => {
    if (selectedEmails.length === mockEmails.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(mockEmails.map(email => email.id));
    }
  };

  return (
    <div className={`email-list ${preferences.emailDisplay.density} ${className || ''}`}>
      {/* List Header */}
      <div className="email-list-header">
        <div className="selection-controls">
          <input
            type="checkbox"
            checked={selectedEmails.length === mockEmails.length}
            onChange={handleSelectAll}
            className="select-all-checkbox"
          />
          <span className="selected-count">
            {selectedEmails.length > 0 && `${selectedEmails.length} selected`}
          </span>
        </div>
        
        <div className="list-info">
          <span className="total-count">{mockEmails.length} emails</span>
        </div>
      </div>

      {/* Email Items */}
      <div className="email-items">
        {mockEmails.map((email) => (
          <EmailListItem
            key={email.id}
            email={email}
            isSelected={selectedEmails.includes(email.id)}
            onSelect={(selected) => handleEmailSelect(email.id, selected)}
            onClick={() => {/* TODO: Open email */}}
          />
        ))}
      </div>

      {/* Empty State */}
      {mockEmails.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📧</div>
          <h3>No emails</h3>
          <p>Your inbox is empty</p>
        </div>
      )}
    </div>
  );
}
