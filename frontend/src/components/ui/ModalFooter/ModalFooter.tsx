'use client';

import React from 'react';
import { Button } from '../Button';
import './ModalFooter.css';

export interface ModalFooterProps {
  onCancel: () => void;
  onConfirm: () => void;
  confirmText: string;
  cancelText?: string;
  isLoading?: boolean;
  confirmVariant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  confirmIcon?: React.ReactNode;
  disabled?: boolean;
}

export const ModalFooter: React.FC<ModalFooterProps> = ({
  onCancel,
  onConfirm,
  confirmText,
  cancelText = 'Cancel',
  isLoading = false,
  confirmVariant = 'primary',
  confirmIcon,
  disabled = false
}) => {
  return (
    <div className="modal-footer">
      <Button
        variant="ghost"
        onClick={onCancel}
        disabled={isLoading}
      >
        {cancelText}
      </Button>
      <Button
        variant={confirmVariant}
        onClick={onConfirm}
        disabled={isLoading || disabled}
      >
        {confirmIcon}
        {isLoading ? 'Loading...' : confirmText}
      </Button>
    </div>
  );
};
