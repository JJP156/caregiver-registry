import React from 'react';
import Icon from '../../../components/AppIcon';

const LoginFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Política de Privacidad', href: '#privacy' },
    { label: 'Términos de Servicio', href: '#terms' },
    { label: 'Soporte Técnico', href: '#support' },
    { label: 'Documentación', href: '#docs' }
  ];

  const supportInfo = [
    {
      icon: 'Phone',
      label: 'Soporte 24/7',
      value: '+34 900 123 456'
    },
    {
      icon: 'Mail',
      label: 'Email de soporte',
      value: 'soporte@caregiverregistry.com'
    },
    {
      icon: 'MessageCircle',
      label: 'Chat en vivo',
      value: 'Disponible 9:00 - 18:00'
    }
  ];

  return (
    <footer className="mt-12 pt-8 border-t border-border">
      {/* Support Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {supportInfo.map((info, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={info.icon} size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-text-primary">
                {info.label}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {info.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Links */}
      <div className="flex flex-wrap justify-center gap-6 mb-6">
        {footerLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-sm text-text-secondary hover:text-primary transition-colors duration-200"
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* System Status */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-text-secondary">Sistema operativo</span>
        </div>
        <div className="w-px h-4 bg-border"></div>
        <div className="flex items-center space-x-2">
          <Icon name="Server" size={14} className="text-text-secondary" />
          <span className="text-xs text-text-secondary">Latencia: 23ms</span>
        </div>
        <div className="w-px h-4 bg-border"></div>
        <div className="flex items-center space-x-2">
          <Icon name="Shield" size={14} className="text-success" />
          <span className="text-xs text-text-secondary">Seguro</span>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center">
        <p className="text-xs text-text-secondary">
          © {currentYear} CaregiverRegistry. Todos los derechos reservados.
        </p>
        <p className="text-xs text-text-secondary mt-1">
          Sistema de Gestión de Cuidadores - Versión 2.1.0
        </p>
      </div>

      {/* Compliance Badges */}
      <div className="flex justify-center space-x-4 mt-4">
        <div className="flex items-center space-x-1">
          <Icon name="Shield" size={12} className="text-success" />
          <span className="text-xs text-text-secondary">SSL</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Lock" size={12} className="text-success" />
          <span className="text-xs text-text-secondary">RGPD</span>
        </div>
        <div className="flex items-center space-x-1">
          <Icon name="Award" size={12} className="text-success" />
          <span className="text-xs text-text-secondary">ISO 27001</span>
        </div>
      </div>
    </footer>
  );
};

export default LoginFooter;