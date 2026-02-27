import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = ({ customItems = null }) => {
  const location = useLocation();

  const routeMap = {
    '/caregiver-management-dashboard': 'Dashboard',
    '/caregiver-registration-form': 'Registro de Cuidador',
    '/caregiver-profile-detail-view': 'Perfil del Cuidador',
    '/document-verification-queue': 'Verificación de Documentos',
    '/authentication-login': 'Iniciar Sesión'
  };

  const generateBreadcrumbs = () => {
    if (customItems) {
      return customItems;
    }

    const pathSegments = location.pathname.split('/').filter(segment => segment);
    const breadcrumbs = [
      { label: 'Inicio', path: '/caregiver-management-dashboard', isHome: true }
    ];

    if (location.pathname !== '/caregiver-management-dashboard') {
      const currentRoute = routeMap[location.pathname];
      if (currentRoute) {
        breadcrumbs.push({
          label: currentRoute,
          path: location.pathname,
          isCurrent: true
        });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (location.pathname === '/authentication-login') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbs.map((item, index) => (
        <div key={item.path || index} className="flex items-center">
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={16} 
              className="mx-2 text-text-secondary" 
            />
          )}
          
          {item.isCurrent ? (
            <span className="text-text-primary font-medium flex items-center">
              {item.isHome && (
                <Icon name="Home" size={16} className="mr-1" />
              )}
              {item.label}
            </span>
          ) : (
            <Link
              to={item.path}
              className="text-text-secondary hover:text-primary transition-colors duration-200 flex items-center"
            >
              {item.isHome && (
                <Icon name="Home" size={16} className="mr-1" />
              )}
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;