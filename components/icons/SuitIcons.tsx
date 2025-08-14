
import React from 'react';

interface IconProps {
  className?: string;
}

export const OrosIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4Z" />
  </svg>
);

export const CopasIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
  </svg>
);

export const EspadasIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L13.79 3.79L12 5.59L10.21 3.79L12 2M12 22L10.21 20.21L12 18.41L13.79 20.21L12 22M3.79 10.21L2 12L3.79 13.79L5.59 12L3.79 10.21M20.21 10.21L18.41 12L20.21 13.79L22 12L20.21 10.21M12 6.41L17.59 12L12 17.59L6.41 12L12 6.41Z" />
    </svg>
);


export const BastosIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="2" x2="12" y2="22"></line>
    <line x1="16" y1="6" x2="12" y2="10"></line>
    <line x1="8" y1="6" x2="12" y2="10"></line>
    <line x1="16" y1="18" x2="12" y2="14"></line>
    <line x1="8" y1="18" x2="12" y2="14"></line>
  </svg>
);
