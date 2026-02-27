import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import ActionContextMenu from '../../../components/ui/ActionContextMenu';

const DashboardToolbar = ({ 
  selectedIds, 
  totalCount, 
  filteredCount,
  viewMode, 
  onViewModeChange, 
  onBulkAction,
  onExport 
}) => {
  const navigate = useNavigate();

  const bulkActions = [
    {
      label: 'Verificar Seleccionados',
      icon: 'CheckCircle',
      onClick: () => onBulkAction('verify', selectedIds)
    },
    {
      label: 'Marcar como Pendientes',
      icon: 'Clock',
      onClick: () => onBulkAction('pending', selectedIds)
    },
    { type: 'separator' },
    {
      label: 'Exportar Seleccionados',
      icon: 'Download',
      onClick: () => onExport('selected', selectedIds)
    },
    {
      label: 'Archivar Seleccionados',
      icon: 'Archive',
      onClick: () => onBulkAction('archive', selectedIds)
    },
    { type: 'separator' },
    {
      label: 'Eliminar Seleccionados',
      icon: 'Trash2',
      variant: 'destructive',
      onClick: () => onBulkAction('delete', selectedIds)
    }
  ];

  const exportActions = [
    {
      label: 'Exportar Todo (Excel)',
      icon: 'FileSpreadsheet',
      onClick: () => onExport('all', 'excel')
    },
    {
      label: 'Exportar Todo (PDF)',
      icon: 'FileText',
      onClick: () => onExport('all', 'pdf')
    },
    {
      label: 'Exportar Filtrados (Excel)',
      icon: 'Filter',
      onClick: () => onExport('filtered', 'excel')
    },
    {
      label: 'Exportar Filtrados (PDF)',
      icon: 'Filter',
      onClick: () => onExport('filtered', 'pdf')
    }
  ];

  const sortOptions = [
    { value: 'name_asc', label: 'Nombre (A-Z)' },
    { value: 'name_desc', label: 'Nombre (Z-A)' },
    { value: 'date_desc', label: 'Más Recientes' },
    { value: 'date_asc', label: 'Más Antiguos' },
    { value: 'status_asc', label: 'Estado (A-Z)' }
  ];

  return (
    <div className="bg-surface border border-border rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
      {/* Main Toolbar Row */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-4">
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 lg:space-x-4">
          <Button
            variant="default"
            onClick={() => navigate('/caregiver-registration-form')}
            className="flex items-center justify-center space-x-2 w-full sm:w-auto"
          >
            <Icon name="Plus" size={16} />
            <span>Nuevo Cuidador</span>
          </Button>

          <div className="flex space-x-2">
            {selectedIds.length > 0 && (
              <ActionContextMenu
                trigger={
                  <Button variant="outline" className="flex items-center space-x-2 flex-1 sm:flex-none">
                    <Icon name="Settings" size={16} />
                    <span className="sm:inline">Acciones ({selectedIds.length})</span>
                    <Icon name="ChevronDown" size={14} />
                  </Button>
                }
                actions={bulkActions}
                position="bottom-left"
              />
            )}

            <ActionContextMenu
              trigger={
                <Button variant="outline" className="flex items-center space-x-2 flex-1 sm:flex-none">
                  <Icon name="Download" size={16} />
                  <span className="sm:inline">Exportar</span>
                  <Icon name="ChevronDown" size={14} />
                </Button>
              }
              actions={exportActions}
              position="bottom-left"
            />
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2 lg:space-x-4">
          {/* Results Counter */}
          <div className="text-sm text-text-secondary text-center sm:text-left">
            {filteredCount !== totalCount ? (
              <span>
                Mostrando <span className="font-medium text-text-primary">{filteredCount}</span> de{' '}
                <span className="font-medium text-text-primary">{totalCount}</span> cuidadores
              </span>
            ) : (
              <span>
                <span className="font-medium text-text-primary">{totalCount}</span> cuidadores
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Sort Dropdown */}
            <Select
              options={sortOptions}
              value="date_desc"
              onChange={(value) => {
                // Handle sort change
              }}
              className="w-full sm:w-48"
            />

            {/* View Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('table')}
                className="px-2 lg:px-3"
              >
                <Icon name="Table" size={16} />
              </Button>
              <Button
                variant={viewMode === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('cards')}
                className="px-2 lg:px-3"
              >
                <Icon name="Grid3X3" size={16} />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Info Bar */}
      {selectedIds.length > 0 && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4 space-y-2 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <Icon name="CheckCircle" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">
              {selectedIds.length} cuidador{selectedIds.length !== 1 ? 'es' : ''} seleccionado{selectedIds.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction('selectAll')}
              className="text-xs"
            >
              Seleccionar Todo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onBulkAction('clearSelection')}
              className="text-xs"
            >
              Limpiar Selección
            </Button>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 lg:gap-4 pt-4 border-t border-border">
        <div className="text-center p-2">
          <div className="text-xl lg:text-2xl font-bold text-success">
            {Math.floor(totalCount * 0.65)}
          </div>
          <div className="text-xs text-text-secondary">Activos</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl lg:text-2xl font-bold text-warning">
            {Math.floor(totalCount * 0.20)}
          </div>
          <div className="text-xs text-text-secondary">Pendientes</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl lg:text-2xl font-bold text-primary">
            {Math.floor(totalCount * 0.10)}
          </div>
          <div className="text-xs text-text-secondary">Verificados</div>
        </div>
        <div className="text-center p-2">
          <div className="text-xl lg:text-2xl font-bold text-error">
            {Math.floor(totalCount * 0.05)}
          </div>
          <div className="text-xs text-text-secondary">Incompletos</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardToolbar;