import React from 'react';

export function BrandLogo({ className = "brand-mark" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 13h4l2.2-6 3.5 11 2.2-5H20" />
    </svg>
  );
}

export function FireIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-4-10-2 2-3 4-3 6-2-1-3-3-3-5-3 3-4 6-4 9a7 7 0 0 0 7 7Z" />
    </svg>
  );
}

export function WaterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3s7 8 7 12a7 7 0 0 1-14 0c0-4 7-12 7-12Z" />
    </svg>
  );
}

export function ActivityIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12h4l3-7 4 14 3-7h4" />
    </svg>
  );
}

export function NutritionIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 21V9M12 13C5 13 4 7 4 4c5 0 8 2 8 9ZM12 16c0-6 3-9 8-9 0 5-2 9-8 9Z" />
    </svg>
  );
}

export function GoalIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m12 12 7-7" />
    </svg>
  );
}

export function ProgressIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 19V5M4 19h17M8 15l4-4 3 2 5-7" />
    </svg>
  );
}

export function BadgeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="5" />
      <path d="m8 12-2 9 6-3 6 3-2-9" />
    </svg>
  );
}

export function DashboardIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function ProfileIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
  );
}

export function AdminIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3 20 6v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6l8-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

export function LogoutIcon() {
  return (
    <svg className="nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 4H4v16h6M14 8l4 4-4 4M8 12h10" />
    </svg>
  );
}
