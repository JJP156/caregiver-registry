import React from 'react';
import Icon from '../AppIcon';
import Button from './Button';


const StatusIndicatorBar = ({
  status = 'active',
  title = '',
  subtitle = '',
  actions = [],
  className = '', variant, getStatusStyles
}) => {
  const getStatusConfig = (status) => {
    const configs = {
      active: {
        bgColor: 'bg-success/10',
        borderColor: 'border-success/20',
        iconColor: 'text-success',
        icon: 'CheckCircle'
      },
      pending: {
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/20',
        iconColor: 'text-warning',
        icon: 'Clock'
      },
      error: {
        bgColor: 'bg-error/10',
        borderColor: 'border-error/20',
        iconColor: 'text-error',
        icon: 'AlertCircle'
      },
      processing: {
        bgColor: 'bg-primary/10',
        borderColor: 'border-primary/20',
        iconColor: 'text-primary',
        icon: 'Loader'
      },
      verification: {
        bgColor: 'bg-accent/10',
        borderColor: 'border-accent/20',
        iconColor: 'text-accent',
        icon: 'FileCheck'
      }
    };
    return configs[status] || configs.active;
  };

  const statusConfig = getStatusConfig(status);

  const getVariantClasses = () => {
    switch (variant) {
      case 'sticky':
        return 'sticky top-16 z-30';
      case 'floating':
        return 'absolute top-4 left-4 right-4 z-20';
      default:
        return '';
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 lg:p-6 ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex items-center space-x-4">
          {/* Status Indicator */}
          <div className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full`} />
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h2 className="text-base lg:text-lg font-semibold text-text-primary truncate">
              {title}
            </h2>
            {subtitle &&
            <p className="text-sm text-text-secondary mt-1">
                {subtitle}
              </p>
            }
          </div>
        </div>

        {/* Actions */}
        {actions.length > 0 &&
        <div className="flex flex-wrap gap-2">
            {actions.map((action, index) =>
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={action.onClick}
            className="flex items-center space-x-2 text-xs lg:text-sm">

                {action.icon && <Icon name={action.icon} size={14} />}
                <span>{action.label}</span>
              </Button>
          )}
          </div>
        }
      </div>
    </div>);

};

export default StatusIndicatorBar;