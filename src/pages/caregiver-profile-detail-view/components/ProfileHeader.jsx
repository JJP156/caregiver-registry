import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import ActionContextMenu from '../../../components/ui/ActionContextMenu';

const ProfileHeader = ({ caregiver, onStatusChange, onEdit, onGenerateReport }) => {
  const [isChangingStatus, setIsChangingStatus] = useState(false);

  const statusOptions = [
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'suspended', label: 'Suspendido' }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { color: 'text-success bg-success/10 border-success/20', icon: 'CheckCircle', label: 'Activo' };
      case 'pending':
        return { color: 'text-warning bg-warning/10 border-warning/20', icon: 'Clock', label: 'Pendiente' };
      case 'inactive':
        return { color: 'text-text-secondary bg-muted border-border', icon: 'Pause', label: 'Inactivo' };
      case 'suspended':
        return { color: 'text-error bg-error/10 border-error/20', icon: 'XCircle', label: 'Suspendido' };
      default:
        return { color: 'text-text-secondary bg-muted border-border', icon: 'Circle', label: 'Desconocido' };
    }
  };

  const statusConfig = getStatusConfig(caregiver.status);

  const handleStatusChange = async (newStatus) => {
    setIsChangingStatus(true);
    try {
      await onStatusChange(newStatus);
    } catch (error) {
      console.error('Error changing status:', error);
    } finally {
      setIsChangingStatus(false);
    }
  };

  const contextMenuActions = [
    {
      label: 'Editar Perfil',
      icon: 'Edit',
      onClick: onEdit
    },
    {
      label: 'Generar Reporte',
      icon: 'FileText',
      onClick: onGenerateReport
    },
    { type: 'separator' },
    {
      label: 'Enviar Notificación',
      icon: 'Bell',
      onClick: () => console.log('Send notification')
    },
    {
      label: 'Historial Completo',
      icon: 'History',
      onClick: () => console.log('View full history')
    },
    { type: 'separator' },
    {
      label: 'Eliminar Perfil',
      icon: 'Trash2',
      variant: 'destructive',
      onClick: () => console.log('Delete profile')
    }
  ];

  return (
    <div className="sticky top-16 z-30 bg-surface border-b border-border p-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Profile Avatar */}
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Icon name="User" size={24} color="white" />
          </div>

          {/* Profile Info */}
          <div>
            <h1 className="text-2xl font-bold text-text-primary">
              {caregiver.firstName} {caregiver.lastName}
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className={`inline-flex items-center px-3 py-1.5 rounded-full border text-sm font-medium ${statusConfig.color}`}>
                <Icon name={statusConfig.icon} size={14} className="mr-1.5" />
                {statusConfig.label}
              </div>
              <span className="text-sm text-text-secondary">
                ID: {caregiver.id}
              </span>
              <span className="text-sm text-text-secondary">
                Registrado: {caregiver.registrationDate}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={onEdit}
            iconName="Edit"
            iconPosition="left"
          >
            Editar
          </Button>

          <Button
            variant="outline"
            onClick={onGenerateReport}
            iconName="FileText"
            iconPosition="left"
          >
            Reporte
          </Button>

          <div className="relative">
            <Select
              options={statusOptions}
              value={caregiver.status}
              onChange={handleStatusChange}
              disabled={isChangingStatus}
              className="min-w-32"
            />
          </div>

          <ActionContextMenu
            actions={contextMenuActions}
            position="bottom-right"
          />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-6 mt-6 pt-6 border-t border-border">
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">{caregiver.experience}</div>
          <div className="text-sm text-text-secondary">Años Experiencia</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-text-primary">{caregiver.certifications.length}</div>
          <div className="text-sm text-text-secondary">Certificaciones</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-success">
            {caregiver.documentsStatus === 'approved' ? '100%' : '50%'}
          </div>
          <div className="text-sm text-text-secondary">Docs Verificados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-primary">4.8</div>
          <div className="text-sm text-text-secondary">Calificación</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;