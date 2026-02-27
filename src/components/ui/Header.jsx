import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';

const Header = ({ onSidebarToggle, user, onLogout, searchTerm, onSearchChange }) => {
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const isAuthPage = location.pathname === '/authentication-login';

  const Logo = () => (
    <Link to="/caregiver-management-dashboard" className="flex items-center space-x-2 lg:space-x-3">
      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary rounded-lg flex items-center justify-center">
        <Icon name="Heart" size={20} className="lg:hidden" color="white" strokeWidth={2} />
        <Icon name="Heart" size={24} className="hidden lg:block" color="white" strokeWidth={2} />
      </div>
      <div className="hidden sm:flex flex-col">
        <span className="text-lg lg:text-xl font-semibold text-text-primary">CaregiverRegistry</span>
        <span className="text-xs text-text-secondary font-normal">Sistema de Gestión</span>
      </div>
    </Link>
  );

  if (isAuthPage) {
    return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
        <div className="flex items-center justify-center h-16 px-4 lg:px-6">
          <Logo />
        </div>
      </header>
    );
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center space-x-2 lg:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onSidebarToggle}
            className="lg:hidden"
          >
            <Icon name="Menu" size={20} />
          </Button>
          <Logo />
        </div>

        {/* Search Bar - Mobile First */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <Input
            type="search"
            placeholder="Buscar cuidadores..."
            value={searchTerm || ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center space-x-2 lg:space-x-4">
          <div className="hidden md:flex items-center space-x-2 px-2 lg:px-3 py-1.5 bg-muted rounded-lg">
            <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
            <span className="text-sm text-text-secondary font-mono">
              {new Date().toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: '2-digit', 
                year: 'numeric' 
              })}
            </span>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-1 lg:space-x-2"
            >
              <div className="w-7 h-7 lg:w-8 lg:h-8 bg-primary rounded-full flex items-center justify-center">
                <Icon name="User" size={14} className="lg:hidden" color="white" />
                <Icon name="User" size={16} className="hidden lg:block" color="white" />
              </div>
              <span className="hidden md:block text-sm font-medium text-text-primary">
                {user?.name || 'Administrador'}
              </span>
              <Icon name="ChevronDown" size={16} />
            </Button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated">
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-text-primary">
                    {user?.name || 'Administrador'}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {user?.email || 'admin@caregiverregistry.com'}
                  </p>
                </div>
                <div className="p-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle profile navigation
                    }}
                  >
                    <Icon name="Settings" size={16} className="mr-2" />
                    Configuración
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => {
                      setShowUserMenu(false);
                      // Handle help navigation
                    }}
                  >
                    <Icon name="HelpCircle" size={16} className="mr-2" />
                    Ayuda
                  </Button>
                  <div className="border-t border-border my-1"></div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-error hover:text-error hover:bg-error/10"
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout?.();
                    }}
                  >
                    <Icon name="LogOut" size={16} className="mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="sm:hidden px-4 pb-3">
        <Input
          type="search"
          placeholder="Buscar cuidadores..."
          value={searchTerm || ''}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="w-full"
        />
      </div>
    </header>
  );
};

export default Header;