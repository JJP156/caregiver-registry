import React from 'react';
import Icon from '../../../components/AppIcon';

const ActivityTimeline = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'registration': return 'UserPlus';
      case 'document_upload': return 'Upload';
      case 'verification': return 'FileCheck';
      case 'approval': return 'CheckCircle';
      case 'rejection': return 'XCircle';
      case 'note': return 'MessageSquare';
      case 'edit': return 'Edit';
      default: return 'Clock';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'registration': return 'text-primary bg-primary/10';
      case 'document_upload': return 'text-accent bg-accent/10';
      case 'verification': return 'text-warning bg-warning/10';
      case 'approval': return 'text-success bg-success/10';
      case 'rejection': return 'text-error bg-error/10';
      case 'note': return 'text-secondary bg-secondary/10';
      case 'edit': return 'text-primary bg-primary/10';
      default: return 'text-text-secondary bg-muted';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center">
        <Icon name="Activity" size={20} className="mr-2 text-primary" />
        Historial de Actividad
      </h3>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-6">
          {activities.map((activity, index) => (
            <div key={index} className="relative flex items-start space-x-4">
              {/* Timeline Icon */}
              <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type)} size={20} />
              </div>

              {/* Activity Content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="text-base font-medium text-text-primary">
                      {activity.title}
                    </h4>
                    <p className="text-sm text-text-secondary mt-1">
                      {activity.description}
                    </p>
                    
                    {activity.details && (
                      <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-text-primary">{activity.details}</p>
                      </div>
                    )}

                    {activity.attachments && activity.attachments.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {activity.attachments.map((attachment, attachIndex) => (
                          <div key={attachIndex} className="flex items-center space-x-2 px-3 py-1.5 bg-muted rounded-lg">
                            <Icon name="Paperclip" size={14} className="text-text-secondary" />
                            <span className="text-sm text-text-primary">{attachment}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="text-right ml-4">
                    <p className="text-sm text-text-secondary">
                      {formatDate(activity.timestamp)}
                    </p>
                    {activity.user && (
                      <p className="text-xs text-text-secondary mt-1">
                        por {activity.user}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <Icon name="Clock" size={48} className="mx-auto text-text-secondary/50 mb-4" />
          <p className="text-text-secondary">No hay actividad registrada</p>
        </div>
      )}
    </div>
  );
};

export default ActivityTimeline;