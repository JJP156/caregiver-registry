import React from 'react';
import Icon from '../../../components/AppIcon';

const SecurityInfo = () => {
  const securityFeatures = [
    {
      icon: 'Shield',
      title: 'Cifrado SSL/TLS',
      description: 'Conexión segura con cifrado de extremo a extremo'
    },
    {
      icon: 'Lock',
      title: 'Autenticación Segura',
      description: 'Verificación de identidad con múltiples factores'
    },
    {
      icon: 'Eye',
      title: 'Monitoreo 24/7',
      description: 'Supervisión continua de actividad sospechosa'
    },
    {
      icon: 'Database',
      title: 'Protección de Datos',
      description: 'Cumplimiento con RGPD y normativas de privacidad'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon name="ShieldCheck" size={32} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          Acceso Seguro
        </h3>
        <p className="text-sm text-text-secondary">
          Tu información está protegida con los más altos estándares de seguridad
        </p>
      </div>

      {/* Security Features */}
      <div className="space-y-4">
        {securityFeatures.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name={feature.icon} size={16} className="text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-text-primary">
                {feature.title}
              </h4>
              <p className="text-xs text-text-secondary mt-1">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Compliance Info */}
      <div className="p-4 bg-muted rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="Award" size={16} className="text-accent" />
          <span className="text-sm font-medium text-text-primary">
            Certificaciones
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
          <div>• ISO 27001</div>
          <div>• RGPD Compliant</div>
          <div>• SOC 2 Type II</div>
          <div>• HIPAA Ready</div>
        </div>
      </div>

      {/* Last Updated */}
      <div className="text-center">
        <p className="text-xs text-text-secondary">
          Última actualización de seguridad: 28/07/2025
        </p>
      </div>
    </div>
  );
};

export default SecurityInfo;