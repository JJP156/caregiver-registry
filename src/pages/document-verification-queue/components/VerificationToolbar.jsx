import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const VerificationToolbar = ({ 
  queueStats,
  onBatchAction,
  onExport,
  onRefresh,
  selectedDocuments = [],
  className = '' 
}) => {
  const [batchAction, setBatchAction] = useState('');
  const [showBatchControls, setShowBatchControls] = useState(false);

  const batchActionOptions = [
    { value: '', label: 'Seleccionar acción...' },
    { value: 'approve_all', label: 'Aprobar Seleccionados' },
    { value: 'reject_all', label: 'Rechazar Seleccionados' },
    { value: 'flag_all', label: 'Marcar Seleccionados' },
    { value: 'assign_reviewer', label: 'Asignar Revisor' },
    { value: 'change_priority', label: 'Cambiar Prioridad' }
  ];

  const exportOptions = [
    { value: 'pdf', label: 'Exportar PDF' },
    { value: 'excel', label: 'Exportar Excel' },
    { value: 'csv', label: 'Exportar CSV' }
  ];

  const handleBatchAction = () => {
    if (!batchAction || selectedDocuments.length === 0) return;
    
    onBatchAction?.({
      action: batchAction,
      documentIds: selectedDocuments,
      timestamp: new Date().toISOString()
    });
    
    setBatchAction('');
    setShowBatchControls(false);
  };

  const handleKeyboardShortcut = (e) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'r':
          e.preventDefault();
          onRefresh?.();
          break;
        case 'e':
          e.preventDefault();
          onExport?.('pdf');
          break;
        default:
          break;
      }
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyboardShortcut);
    return () => document.removeEventListener('keydown', handleKeyboardShortcut);
  }, []);

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 mb-6 ${className}`}>
      {/* Main Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-text-primary">
            Cola de Verificación de Documentos
          </h2>
          
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <Icon name="Clock" size={16} />
            <span>
              Actualizado: {new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            iconName="RefreshCw"
            iconPosition="left"
          >
            Actualizar
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowBatchControls(!showBatchControls)}
            iconName="Settings"
            iconPosition="left"
          >
            Acciones
          </Button>
          
          <div className="relative">
            <select
              onChange={(e) => onExport?.(e.target.value)}
              className="text-sm border border-border rounded px-3 py-1.5 bg-input appearance-none pr-8"
              defaultValue=""
            >
              <option value="" disabled>Exportar</option>
              {exportOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
            />
          </div>
        </div>
      </div>

      {/* Statistics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        <div className="bg-muted rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-text-primary">
            {queueStats?.total || 0}
          </div>
          <div className="text-xs text-text-secondary">Total</div>
        </div>
        
        <div className="bg-warning/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-warning">
            {queueStats?.pending || 0}
          </div>
          <div className="text-xs text-text-secondary">Pendientes</div>
        </div>
        
        <div className="bg-primary/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-primary">
            {queueStats?.inReview || 0}
          </div>
          <div className="text-xs text-text-secondary">En Revisión</div>
        </div>
        
        <div className="bg-success/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-success">
            {queueStats?.approved || 0}
          </div>
          <div className="text-xs text-text-secondary">Aprobados Hoy</div>
        </div>
        
        <div className="bg-error/10 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-error">
            {queueStats?.flagged || 0}
          </div>
          <div className="text-xs text-text-secondary">Marcados</div>
        </div>
      </div>

      {/* Batch Controls */}
      {showBatchControls && (
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-sm text-text-secondary">
                {selectedDocuments.length} documento(s) seleccionado(s)
              </div>
              
              {selectedDocuments.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Select
                    options={batchActionOptions}
                    value={batchAction}
                    onChange={setBatchAction}
                    placeholder="Seleccionar acción..."
                    className="min-w-48"
                  />
                  
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleBatchAction}
                    disabled={!batchAction}
                    iconName="Play"
                    iconPosition="left"
                  >
                    Ejecutar
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Select all documents
                }}
                iconName="CheckSquare"
                iconPosition="left"
              >
                Seleccionar Todo
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Clear selection
                }}
                iconName="Square"
                iconPosition="left"
              >
                Limpiar Selección
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard Shortcuts Info */}
      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">R</kbd>
              <span>Actualizar</span>
            </div>
            <div className="flex items-center space-x-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">Ctrl</kbd>
              <span>+</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">E</kbd>
              <span>Exportar</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Icon name="Zap" size={14} />
            <span>Atajos de teclado disponibles</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationToolbar;