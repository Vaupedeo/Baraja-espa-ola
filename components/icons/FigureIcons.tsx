
import React from 'react';

interface IconProps {
  className?: string;
}

export const SotaIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="7" r="4"></circle>
        <path d="M5.2 20.8C5.2 17.1 8.2 14 12 14s6.8 3.1 6.8 6.8"></path>
    </svg>
);

export const CaballoIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v2l2 1v3l-2 1v1l2 1v2l-2 1v1l2 1v2l-2 1v1h4l1-1h2l1 1h4l1-1h2l1 1h4v-2l-2-1v-2l2-1v-1l-2-1V9l2-1V7l-2-1V4l-2-1H7Z"/>
        <path d="M3 13h1"/>
    </svg>
);

export const ReyIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"></path>
    </svg>
);
