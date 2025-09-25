'use client';

import { useState } from 'react';
import { Button } from '../ui';

interface EmailViewerProps {
  className?: string;
}

// Mock email content
const mockEmail = {
  id: '1',
  from: 'John Doe',
  fromEmail: 'john@example.com',
  to: 'you@example.com',
  subject: 'Meeting Tomorrow at 2 PM',
  date: 'Today, 2:30 PM',
  isRead: false,
  isStarred: true,
  hasAttachments: true,
  labels: ['work'],
  content: `
    <div>
      <p>Hi there,</p>
      <p>Just confirming our meeting tomorrow at 2 PM. Looking forward to discussing the project updates and next steps.</p>
      <p>Please bring the quarterly reports and any questions you might have.</p>
      <p>Best regards,<br>John</p>
    </div>
  `,
  attachments: [
    { name: 'Q4_Report.pdf', size: '2.3 MB', type: 'pdf' },
    { name: 'Meeting_Notes.docx', size: '156 KB', type: 'docx' },
  ],
};

export function EmailViewer({ className }: EmailViewerProps) {
  const [isComposing, setIsComposing] = useState(false);

  const handleReply = () => {
    setIsComposing(true);
    // TODO: Open reply composer
  };

  const handleReplyAll = () => {
    setIsComposing(true);
    // TODO: Open reply all composer
  };

  const handleForward = () => {
    setIsComposing(true);
    // TODO: Open forward composer
  };

  const handleArchive = () => {
    // TODO: Archive email
    console.log('Archive email');
  };

  const handleDelete = () => {
    // TODO: Delete email
    console.log('Delete email');
  };

  const handleStar = () => {
    // TODO: Toggle star
    console.log('Toggle star');
  };

  const handlePrint = () => {
    window.print();
  };

  if (!mockEmail) {
    return (
      <div className={`email-viewer empty ${className || ''}`}>
        <div className="empty-state">
          <div className="empty-icon">📧</div>
          <h3>Select an email to read</h3>
          <p>Choose an email from the list to view its content</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`email-viewer ${className || ''}`}>
      {/* Email Header */}
      <div className="email-header">
        <div className="email-meta">
          <h1 className="email-subject">{mockEmail.subject}</h1>
          <div className="email-details">
            <div className="sender-info">
              <div className="sender-avatar">
                {mockEmail.from.charAt(0).toUpperCase()}
              </div>
              <div className="sender-details">
                <span className="sender-name">{mockEmail.from}</span>
                <span className="sender-email">{mockEmail.fromEmail}</span>
              </div>
            </div>
            <div className="email-time">{mockEmail.date}</div>
          </div>
        </div>

        <div className="email-actions">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleStar}
            className={`star-button ${mockEmail.isStarred ? 'starred' : ''}`}
          >
            {mockEmail.isStarred ? '⭐' : '☆'}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleArchive}>
            📁 Archive
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            🗑️ Delete
          </Button>
          <Button variant="ghost" size="sm" onClick={handlePrint}>
            🖨️ Print
          </Button>
        </div>
      </div>

      {/* Email Labels */}
      {mockEmail.labels.length > 0 && (
        <div className="email-labels">
          {mockEmail.labels.map((label) => (
            <span key={label} className={`email-label label-${label}`}>
              {label}
            </span>
          ))}
        </div>
      )}

      {/* Email Content */}
      <div className="email-content">
        <div 
          className="email-body"
          dangerouslySetInnerHTML={{ __html: mockEmail.content }}
        />
      </div>

      {/* Attachments */}
      {mockEmail.hasAttachments && mockEmail.attachments && (
        <div className="email-attachments">
          <h4 className="attachments-title">Attachments</h4>
          <div className="attachments-list">
            {mockEmail.attachments.map((attachment, index) => (
              <div key={index} className="attachment-item">
                <div className="attachment-icon">
                  {attachment.type === 'pdf' ? '📄' : '📝'}
                </div>
                <div className="attachment-info">
                  <span className="attachment-name">{attachment.name}</span>
                  <span className="attachment-size">{attachment.size}</span>
                </div>
                <Button variant="ghost" size="sm" className="download-button">
                  ⬇️
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reply Actions */}
      <div className="email-reply-actions">
        <Button variant="primary" onClick={handleReply}>
          Reply
        </Button>
        <Button variant="ghost" onClick={handleReplyAll}>
          Reply All
        </Button>
        <Button variant="ghost" onClick={handleForward}>
          Forward
        </Button>
      </div>
    </div>
  );
}
