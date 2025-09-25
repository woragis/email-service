'use client';

import { useState } from 'react';
import { Button } from '../ui';

interface Email {
  id: string;
  from: string;
  fromEmail: string;
  subject: string;
  preview: string;
  time: string;
  date: string;
  isRead: boolean;
  isStarred: boolean;
  hasAttachments: boolean;
  labels: string[];
}

interface EmailListItemProps {
  email: Email;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onClick: () => void;
}

export function EmailListItem({ email, isSelected, onSelect, onClick }: EmailListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleStarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Toggle star status
    console.log('Toggle star for email:', email.id);
  };

  const handleArchiveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Archive email
    console.log('Archive email:', email.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // TODO: Delete email
    console.log('Delete email:', email.id);
  };

  return (
    <div
      className={`email-list-item ${email.isRead ? 'read' : 'unread'} ${isSelected ? 'selected' : ''} ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Selection Checkbox */}
      <div className="email-checkbox">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(e.target.checked)}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Star Button */}
      <div className="email-star">
        <button
          className={`star-button ${email.isStarred ? 'starred' : ''}`}
          onClick={handleStarClick}
        >
          {email.isStarred ? '⭐' : '☆'}
        </button>
      </div>

      {/* Sender Info */}
      <div className="email-sender">
        <div className="sender-avatar">
          {email.from.charAt(0).toUpperCase()}
        </div>
        <div className="sender-info">
          <span className="sender-name">{email.from}</span>
          <span className="sender-email">{email.fromEmail}</span>
        </div>
      </div>

      {/* Email Content */}
      <div className="email-content">
        <div className="email-subject">
          <span className={`subject-text ${email.isRead ? 'read' : 'unread'}`}>
            {email.subject}
          </span>
          {email.hasAttachments && (
            <span className="attachment-indicator">📎</span>
          )}
        </div>
        <div className="email-preview">
          {email.preview}
        </div>
        <div className="email-labels">
          {email.labels.map((label) => (
            <span key={label} className={`email-label label-${label}`}>
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Time */}
      <div className="email-time">
        <span className="time-text">{email.time}</span>
        <span className="date-text">{email.date}</span>
      </div>

      {/* Action Buttons */}
      <div className="email-actions">
        {(isHovered || isSelected) && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleArchiveClick}
              className="action-button archive"
            >
              📁
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDeleteClick}
              className="action-button delete"
            >
              🗑️
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
