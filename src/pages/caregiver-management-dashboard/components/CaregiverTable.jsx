import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import ActionContextMenu from '../../../components/ui/ActionContextMenu';

const CaregiverTable = ({
  caregivers,
  selectedIds = [],
  onSelectionChange,
  onSort,
  sortConfig,
  onBulkAction, handleViewProfile, handleEdit, handleDelete, format
}) => {
  const navigate = useNavigate();
  const [hoveredRow, setHoveredRow] = useState(null);

  const getStatusBadge = (status) => {
    const configs = {
      active: { bg: 'bg-success/10', text: 'text-success', label: 'Activo' },
      pending: { bg: 'bg-warning/10', text: 'text-warning', label: 'Pendiente' },
      verified: { bg: 'bg-primary/10', text: 'text-primary', label: 'Verificado' },
      incomplete: { bg: 'bg-error/10', text: 'text-error', label: 'Incompleto' },
      rejected: { bg: 'bg-error/10', text: 'text-error', label: 'Rechazado' }
    };
    const config = configs[status] || configs.pending;

    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>);

  };

  const getDocumentProgress = (caregiver) => {
    const totalDocs = 2; // DNI front and back
    let completedDocs = 0;

    if (caregiver.documents?.idFront) completedDocs++;
    if (caregiver.documents?.idBack) completedDocs++;

    return { completed: completedDocs, total: totalDocs, percentage: completedDocs / totalDocs * 100 };
  };

  const handleRowClick = (caregiver) => {
    navigate('/caregiver-profile-detail-view', { state: { caregiver } });
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      onSelectionChange(caregivers.map((c) => c.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id, checked) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig.key !== column) return 'ArrowUpDown';
    return sortConfig.direction === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  const getRowActions = (caregiver) => [
  {
    label: 'Ver Perfil',
    icon: 'Eye',
    onClick: () => handleRowClick(caregiver)
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


  const isAllSelected = caregivers.length > 0 && selectedIds.length === caregivers.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < caregivers.length;

  return (
    <div className="bg-surface border border-border rounded-lg mb-6 overflow-hidden">
      {/* Mobile Cards View for Small Screens */}
      <div className="block lg:hidden">
        <div className="p-4 space-y-4">
          {caregivers?.map((caregiver) =>
          <div key={caregiver.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                  checked={selectedIds.includes(caregiver.id)}
                  onChange={(checked) => {
                    if (checked) {
                      onSelectionChange([...selectedIds, caregiver.id]);
                    } else {
                      onSelectionChange(selectedIds.filter((id) => id !== caregiver.id));
                    }
                  }} />

                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-muted">
                      {caregiver.avatar ?
                    <img
                      src={caregiver.avatar}
                      alt={`${caregiver.name} ${caregiver.surname}`}
                      className="w-full h-full object-cover" /> :


                    <div className="w-full h-full flex items-center justify-center">
                          <Icon name="User" size={16} className="text-text-secondary" />
                        </div>
                    }
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {caregiver.name} {caregiver.surname}
                      </p>
                      <p className="text-sm text-text-secondary">{caregiver.email}</p>
                    </div>
                  </div>
                </div>
                <ActionContextMenu
                trigger={
                <Button variant="ghost" size="icon">
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

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-text-secondary">DNI:</span>
                  <p className="font-medium">{caregiver.dni}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Teléfono:</span>
                  <p className="font-medium">{caregiver.phone}</p>
                </div>
                <div>
                  <span className="text-text-secondary">Estado:</span>
                  <div className="flex items-center mt-1">
                  </div>
                </div>
                <div>
                  <span className="text-text-secondary">Registro:</span>
                  <p className="font-medium">
                    {caregiver.registrationDate}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr className="border-b border-border bg-muted/50">
                <th className="p-4 text-left">
                  <Checkbox
                    checked={selectedIds.length === caregivers.length && caregivers.length > 0}
                    indeterminate={selectedIds.length > 0 && selectedIds.length < caregivers.length}
                    onChange={(checked) => {
                      if (checked) {
                        onSelectionChange(caregivers.map((c) => c.id));
                      } else {
                        onSelectionChange([]);
                      }
                    }} />

                </th>
                <th className="p-4 text-left">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSort('name')}
                    className="flex items-center space-x-2 font-semibold text-text-primary hover:text-primary">

                    <span>Cuidador</span>
                    <Icon
                      name={sortConfig.key === 'name' ?
                      sortConfig.direction === 'asc' ? 'ChevronUp' : 'ChevronDown' :
                      'ChevronsUpDown'
                      }
                      size={16} />

                  </Button>
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">
                  <button
                    onClick={() => onSort('dni')}
                    className="flex items-center space-x-2 hover:text-primary transition-colors">

                    <span>DNI</span>
                    <Icon name={getSortIcon('dni')} size={14} />
                  </button>
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">
                  <button
                    onClick={() => onSort('registrationDate')}
                    className="flex items-center space-x-2 hover:text-primary transition-colors">

                    <span>Fecha Registro</span>
                    <Icon name={getSortIcon('registrationDate')} size={14} />
                  </button>
                </th>
                <th className="p-4 text-left font-semibold text-text-primary">Estado</th>
                <th className="p-4 text-left font-semibold text-text-primary">Contacto</th>
                <th className="p-4 text-left font-semibold text-text-primary">Progreso</th>
                <th className="p-4 text-center font-semibold text-text-primary">Documentos</th>
                <th className="p-4 text-center font-semibold text-text-primary">Acciones</th>
              </tr>
            </thead>
            
            <tbody>
              {caregivers.map((caregiver) => {
                const docProgress = getDocumentProgress(caregiver);
                const isSelected = selectedIds.includes(caregiver.id);
                const isHovered = hoveredRow === caregiver.id;

                return (
                  <tr
                    key={caregiver.id}
                    className={`border-b border-border transition-colors cursor-pointer ${
                    isSelected ? 'bg-primary/5' : isHovered ? 'bg-muted/30' : 'hover:bg-muted/20'}`
                    }
                    onMouseEnter={() => setHoveredRow(caregiver.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                    onClick={() => handleRowClick(caregiver)}>

                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(caregiver.id, e.target.checked)} />

                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center overflow-hidden">
                          {caregiver.avatar ?
                          <Image
                            src={caregiver.avatar}
                            alt={`${caregiver.name} ${caregiver.surname}`}
                            className="w-full h-full object-cover" /> :


                          <Icon name="User" size={20} className="text-text-secondary" />
                          }
                        </div>
                        <div>
                          <div className="font-medium text-text-primary">
                            {caregiver.name} {caregiver.surname}
                          </div>
                          <div className="text-sm text-text-secondary">
                            {caregiver.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <span className="font-mono text-sm text-text-primary">
                        {caregiver.dni}
                      </span>
                    </td>
                    
                    <td className="p-4">
                      <div className="text-sm text-text-primary">
                        {new Date(caregiver.registrationDate).toLocaleDateString('es-ES')}
                      </div>
                      <div className="text-xs text-text-secondary">
                        {new Date(caregiver.registrationDate).toLocaleTimeString('es-ES', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                    
                    <td className="p-4">
                      {getStatusBadge(caregiver.status)}
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                        caregiver.documents?.idFront ? 'bg-success' : 'bg-error'}`
                        } />
                        <div className={`w-2 h-2 rounded-full ${
                        caregiver.documents?.idBack ? 'bg-success' : 'bg-error'}`
                        } />
                        <span className="text-xs text-text-secondary ml-2">
                          {docProgress.completed}/{docProgress.total}
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-muted rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                            docProgress.percentage === 100 ? 'bg-success' :
                            docProgress.percentage >= 50 ? 'bg-warning' : 'bg-error'}`
                            }
                            style={{ width: `${docProgress.percentage}%` }} />

                        </div>
                        <span className="text-xs font-mono text-text-secondary">
                          {Math.round(docProgress.percentage)}%
                        </span>
                      </div>
                    </td>
                    
                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <ActionContextMenu
                        actions={getRowActions(caregiver)}
                        position="bottom-right" />

                    </td>
                  </tr>);

              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>);

};

export default CaregiverTable;