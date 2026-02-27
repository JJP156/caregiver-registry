import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressIndicator = ({ currentStep = 1, totalSteps = 3 }) => {
  const steps = [
    {
      id: 1,
      title: 'Información Personal',
      description: 'Datos básicos del cuidador'
    },
    {
      id: 2,
      title: 'Documentación',
      description: 'Carga de documentos DNI'
    },
    {
      id: 3,
      title: 'Revisión y Envío',
      description: 'Confirmación final'
    }
  ];

  const getStepStatus = (stepId) => {
    if (stepId < currentStep) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'pending';
  };

  const getStepIcon = (stepId, status) => {
    if (status === 'completed') return 'CheckCircle';
    if (status === 'current') return 'Circle';
    return 'Circle';
  };

  const getStepClasses = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success border-success bg-success/10';
      case 'current':
        return 'text-primary border-primary bg-primary/10';
      default:
        return 'text-text-secondary border-border bg-muted';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-text-primary">
          Progreso del Registro
        </h2>
        <div className="text-sm text-text-secondary">
          Paso {currentStep} de {totalSteps}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-4">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id);
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative">
              <div className="flex items-start space-x-4">
                <div className={`
                  w-10 h-10 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200 ${getStepClasses(status)}
                `}>
                  <Icon 
                    name={getStepIcon(step.id, status)} 
                    size={20}
                    className={status === 'completed' ? 'fill-current' : ''}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className={`
                    text-sm font-medium
                    ${status === 'current' ? 'text-primary' : 
                      status === 'completed' ? 'text-success' : 'text-text-secondary'}
                  `}>
                    {step.title}
                  </h3>
                  <p className="text-xs text-text-secondary mt-1">
                    {step.description}
                  </p>
                </div>

                {status === 'current' && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                    <span className="text-xs text-primary font-medium">En progreso</span>
                  </div>
                )}
              </div>

              {!isLast && (
                <div className={`
                  absolute left-5 top-10 w-0.5 h-6 
                  ${status === 'completed' ? 'bg-success' : 'bg-border'}
                `} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;