import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import ActionContextMenu from '../../../components/ui/ActionContextMenu';

const CaregiverCards = ({
  caregivers,
  selectedIds = [],
  onSelectionChange,
  onBulkAction, handleViewProfile, handleEdit, handleDelete, format
}) => {
  const navigate = useNavigate();

  const getStatusBadge = (status) => {
    const configs = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Activo', icon: 'CheckCircle' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pendiente', icon: 'Clock' },
      verified: { bg: 'bg-primary/10', text: 'text-primary', label: 'Verificado', icon: 'Shield' },
      incomplete: { bg: 'bg-error/10', text: 'text-error', label: 'Incompleto', icon: 'AlertCircle' },
      rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rechazado', icon: 'XCircle' }
    };
    const config = configs[status] || configs.pending;

    return (
      <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        <Icon name={config.icon} size={12} className="mr-1" />
        {config.label}
      </div>);

  };

  const getDocumentProgress = (caregiver) => {
    const totalDocs = 2;
    let completedDocs = 0;

    if (caregiver.documents?.idFront) completedDocs++;
    if (caregiver.documents?.idBack) completedDocs++;

    return { completed: completedDocs, total: totalDocs, percentage: completedDocs / totalDocs * 100 };
  };

  const handleCardClick = (caregiver) => {
    navigate('/caregiver-profile-detail-view', { state: { caregiver } });
  };

  const handleSelectCard = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const getCardActions = (caregiver) => [
  {
    label: 'Ver Perfil',
    icon: 'Eye',
    onClick: () => handleCardClick(caregiver)
  },
  {
    label: 'Editar',
    icon: 'Edit',
    onClick: () => navigate('/caregiver-registration-form', { state: { caregiver, mode: 'edit' } })
  },
  {
    label: 'Verificar Documentos',
    icon: 'FileCheck',
    onClick: () => navigate('/document-verification-queue', { state: { caregiver } })
  },
  { type: 'separator' },
  {
    label: 'Archivar',
    icon: 'Archive',
    onClick: () => onBulkAction('archive', [caregiver.id])
  },
  {
    label: 'Eliminar',
    icon: 'Trash2',
    variant: 'destructive',
    onClick: () => onBulkAction('delete', [caregiver.id])
  }];


  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 mb-6">
      {caregivers?.map((caregiver) =>
      <div
        key={caregiver.id}
        className={`bg-surface border rounded-lg p-4 lg:p-6 transition-all duration-200 hover:shadow-soft ${
        selectedIds.includes(caregiver.id) ?
        'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`
        }>

          {/* Card Header */}
          <div className="flex items-start justify-between mb-4">
            <Checkbox
            checked={selectedIds.includes(caregiver.id)}
            onChange={(checked) => {
              if (checked) {
                onSelectionChange([...selectedIds, caregiver.id]);
              } else {
                onSelectionChange(selectedIds.filter((id) => id !== caregiver.id));
              }
            }} />

            <ActionContextMenu
            trigger={
            <Button variant="ghost" size="icon" className="text-text-secondary hover:text-text-primary">
                  <Icon name="MoreVertical" size={16} />
                </Button>
            }
            actions={[
            {
              label: 'Ver Perfil',
              icon: 'Eye',
              onClick: () => handleViewProfile(caregiver.id)
            },
            {
              label: 'Editar',
              icon: 'Pencil',
              onClick: () => handleEdit(caregiver.id)
            },
            { type: 'separator' },
            {
              label: 'Eliminar',
              icon: 'Trash2',
              variant: 'destructive',
              onClick: () => handleDelete(caregiver.id)
            }]
            } />

          </div>

          {/* Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden mb-3 bg-muted">
              {caregiver.avatar ?
            <img
              src={caregiver.avatar}
              alt={`${caregiver.name} ${caregiver.surname}`}
              className="w-full h-full object-cover" /> :


            <div className="w-full h-full flex items-center justify-center">
                  <Icon name="User" size={24} className="text-text-secondary" />
                </div>
            }
            </div>
            <h3 className="font-semibold text-text-primary text-sm lg:text-base">
              {caregiver.name} {caregiver.surname}
            </h3>
            <p className="text-xs lg:text-sm text-text-secondary">{caregiver.email}</p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-4">
          </div>

          {/* Info Grid */}
          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-xs lg:text-sm">
              <span className="text-text-secondary">DNI:</span>
              <span className="font-medium text-text-primary">{caregiver.dni}</span>
            </div>
            <div className="flex items-center justify-between text-xs lg:text-sm">
              <span className="text-text-secondary">Teléfono:</span>
              <span className="font-medium text-text-primary">{caregiver.phone}</span>
            </div>
            <div className="flex items-center justify-between text-xs lg:text-sm">
              <span className="text-text-secondary">Registro:</span>
              <span className="font-medium text-text-primary">
                {caregiver.registrationDate}
              </span>
            </div>
          </div>

          {/* Documents Status */}
          <div className="flex justify-between items-center pt-3 border-t border-border">
            <span className="text-xs text-text-secondary">Documentos:</span>
            <div className="flex space-x-1">
              <div className={`w-2 h-2 rounded-full ${
            caregiver.documents?.idFront ? 'bg-success' : 'bg-error'}`
            } />
              <div className={`w-2 h-2 rounded-full ${
            caregiver.documents?.idBack ? 'bg-success' : 'bg-error'}`
            } />
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-2 mt-4">
            <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewProfile(caregiver.id)}
            className="flex-1 text-xs lg:text-sm">

              <Icon name="Eye" size={14} className="mr-1" />
              Ver
            </Button>
            <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(caregiver.id)}
            className="flex-1 text-xs lg:text-sm">

              <Icon name="Pencil" size={14} className="mr-1" />
              Editar
            </Button>
          </div>
        </div>
      )}
    </div>);

};

export default CaregiverCards;