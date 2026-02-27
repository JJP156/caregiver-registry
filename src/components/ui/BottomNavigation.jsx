import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const BottomNavigation = () => {
  const location = useLocation();

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/caregiver-management-dashboard',
      icon: 'LayoutDashboard'
    },
    {
      label: 'Registro',
      path: '/caregiver-registration-form',
      icon: 'UserPlus'
    },
    {
      label: 'Verificación',
      path: '/document-verification-queue',
      icon: 'FileCheck'
    },
    {
      label: 'Perfil',
      path: '/caregiver-profile-detail-view',
      icon: 'UserCircle'
    }
  ];

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Don't show on auth page
  if (location.pathname === '/authentication-login') {
    return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border lg:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navigationItems.map((item) => {
          const isActive = isActiveRoute(item.path);
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-soft' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-muted'
              }`}
            >
              <Icon 
                name={item.icon} 
                size={20} 
                className="mb-1"
              />
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;