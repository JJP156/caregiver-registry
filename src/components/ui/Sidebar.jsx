import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  const navigationItems = [
    {
      label: 'Dashboard',
      path: '/caregiver-management-dashboard',
      icon: 'LayoutDashboard',
      tooltip: 'Panel principal de gestión'
    },
    {
      label: 'Búsqueda Pública',
      path: '/public-caregiver-search',
      icon: 'Search',
      tooltip: 'Buscar cuidadores públicamente'
    },
    {
      label: 'Cuidadores',
      icon: 'Users',
      tooltip: 'Gestión de cuidadores',
      children: [
        {
          label: 'Gestión General',
          path: '/caregiver-management-dashboard',
          icon: 'UserCheck'
        },
        {
          label: 'Perfil Detallado',
          path: '/caregiver-profile-detail-view',
          icon: 'UserCircle'
        }
      ]
    },
    {
      label: 'Registro',
      path: '/caregiver-registration-form',
      icon: 'UserPlus',
      tooltip: 'Registro de nuevos cuidadores'
    },
    {
      label: 'Verificación',
      path: '/document-verification-queue',
      icon: 'FileCheck',
      tooltip: 'Cola de verificación de documentos'
    }
  ];

  const toggleSection = (label) => {
    setExpandedSections(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  const isParentActive = (children) => {
    return children?.some(child => isActiveRoute(child.path));
  };

  const renderNavigationItem = (item, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedSections[item.label];
    const isActive = item.path ? isActiveRoute(item.path) : isParentActive(item.children);

    if (hasChildren) {
      return (
        <div key={item.label} className="mb-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection(item.label)}
            className={`w-full justify-start px-3 py-2 h-auto ${
              isActive ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-muted'
            }`}
          >
            <Icon name={item.icon} size={18} className="mr-3 flex-shrink-0" />
            <span className="flex-1 text-left font-medium">{item.label}</span>
            <Icon 
              name="ChevronRight" 
              size={16} 
              className={`transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
            />
          </Button>
          
          {isExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {item.children.map(child => renderNavigationItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.label}
        to={item.path}
        onClick={onClose}
        className="block mb-1"
      >
        <Button
          variant="ghost"
          size="sm"
          className={`w-full justify-start px-3 py-2 h-auto ${
            isActive 
              ? 'bg-primary text-primary-foreground shadow-soft' 
              : 'text-text-secondary hover:text-text-primary hover:bg-muted'
          } ${level > 0 ? 'pl-6' : ''}`}
        >
          <Icon name={item.icon} size={18} className="mr-3 flex-shrink-0" />
          <span className="font-medium">{item.label}</span>
        </Button>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 lg:w-72 bg-surface border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:fixed
        pt-16
      `}>
        <div className="flex flex-col h-full">
          {/* Navigation Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-text-primary">Navegación</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="lg:hidden"
              >
                <Icon name="X" size={20} />
              </Button>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 p-4 overflow-y-auto">
            <div className="space-y-2">
              {navigationItems.map(item => renderNavigationItem(item))}
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center">
                <Icon name="Shield" size={16} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  Sistema Activo
                </p>
                <p className="text-xs text-text-secondary">
                  Versión 2.1.0
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;