import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationSummary = ({ errors, onFieldFocus, className = '' }) => {
  const errorEntries = Object.entries(errors).filter(([key, value]) => value);
  
  if (errorEntries.length === 0) {
    return null;
  }

  const getFieldLabel = (fieldName) => {
    const labels = {
      firstName: 'Nombre',
      lastName: 'Apellidos',
      dateOfBirth: 'Fecha de Nacimiento',
      dniNumber: 'Número de DNI',
      phone: 'Teléfono',
      address: 'Dirección',
      dniFront: 'DNI Anverso',
      dniBack: 'DNI Reverso'
    };
    return labels[fieldName] || fieldName;
  };

  return (
    <div className={`bg-error/5 border border-error/20 rounded-lg p-4 mb-6 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon name="AlertTriangle" size={20} className="text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-medium text-error mb-2">
            Se encontraron {errorEntries.length} error{errorEntries.length > 1 ? 'es' : ''} en el formulario
          </h3>
          <ul className="space-y-2">
            {errorEntries.map(([fieldName, errorMessage]) => (
              <li key={fieldName} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon name="X" size={14} className="text-error" />
                  <span className="text-sm text-text-primary">
                    <strong>{getFieldLabel(fieldName)}:</strong> {errorMessage}
                  </span>
                </div>
                {onFieldFocus && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFieldFocus(fieldName)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <Icon name="ArrowRight" size={14} />
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ValidationSummary;