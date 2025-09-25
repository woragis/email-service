import React from 'react';
import { ClientHeader } from './ClientHeader';
import './Header.css';

export interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return <ClientHeader className={className} />;
};
