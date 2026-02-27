import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VerificationQueue = ({ 
  documents, 
  selectedDocuments, 
  onDocumentSelect,
  onSelectionChange,
  onBatchAction,
  loading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  className = '' 
}) => {
  const [sortBy, setSortBy] = useState('date');
  const [filterPriority, setFilterPriority] = useState('all');

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-error text-error-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-success text-success-foreground';
      default:
        return 'bg-muted text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'Clock';
      case 'in-review':
        return 'Eye';
      case 'flagged':
        return 'AlertTriangle';
      default:
        return 'FileText';
    }
  };

  const sortedDocuments = [...documents].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.submissionDate) - new Date(a.submissionDate);
      case 'name':
        return a.caregiverName.localeCompare(b.caregiverName);
      case 'priority':
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      default:
        return 0;
    }
  });

  const filteredDocuments = sortedDocuments.filter(doc => 
    filterPriority === 'all' || doc.priority === filterPriority
  );

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(filteredDocuments.map(doc => doc.id));
    }
  };

  return (
    <div className={`bg-surface border border-border rounded-lg h-full flex flex-col ${className}`}>
      {/* Queue Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-text-primary">
            Cola de Verificación
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-secondary">
              {filteredDocuments.length} documentos
            </span>
            <Button variant="ghost" size="icon">
              <Icon name="RefreshCw" size={16} />
            </Button>
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex items-center space-x-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-input"
          >
            <option value="date">Por Fecha</option>
            <option value="name">Por Nombre</option>
            <option value="priority">Por Prioridad</option>
          </select>
          
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="text-sm border border-border rounded px-2 py-1 bg-input"
          >
            <option value="all">Todas las Prioridades</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
      </div>

      {/* Batch Actions */}
      {selectedDocuments.length > 0 && (
        <div className="p-4 border-b border-border bg-primary/5">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {selectedDocuments.length} documento(s) seleccionado(s)
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBatchAction({ action: 'approve', documentIds: selectedDocuments })}
              >
                <Icon name="CheckCircle" size={16} className="mr-2" />
                Aprobar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBatchAction({ action: 'reject', documentIds: selectedDocuments })}
              >
                <Icon name="XCircle" size={16} className="mr-2" />
                Rechazar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Document List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Select All Header */}
            {filteredDocuments.length > 0 && (
              <div className="p-4 border-b border-border bg-muted/30">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={selectedDocuments.length === filteredDocuments.length}
                    onChange={handleSelectAll}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium text-text-primary">
                    Seleccionar todos ({filteredDocuments.length})
                  </span>
                </div>
              </div>
            )}

            {/* Documents */}
            {filteredDocuments.map((document) => (
              <div
                key={document.id}
                className="p-4 border-b border-border cursor-pointer transition-colors duration-200 hover:bg-muted"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          onSelectionChange([...selectedDocuments, document.id]);
                        } else {
                          onSelectionChange(selectedDocuments.filter(id => id !== document.id));
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded border-border"
                    />
                    <div 
                      className="flex-1 min-w-0"
                      onClick={() => onDocumentSelect(document)}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <Icon 
                          name={getStatusIcon(document.status)} 
                          size={16} 
                          className="text-text-secondary flex-shrink-0" 
                        />
                        <h4 className="text-sm font-medium text-text-primary truncate">
                          {document.caregiverName}
                        </h4>
                      </div>
                      
                      <p className="text-xs text-text-secondary mb-2">
                        DNI: {document.dniNumber}
                      </p>
                      
                      <div className="flex items-center space-x-2 text-xs text-text-secondary">
                        <Icon name="Calendar" size={12} />
                        <span>
                          {new Date(document.submissionDate).toLocaleDateString('es-ES')}
                        </span>
                        <Icon name="Clock" size={12} />
                        <span>
                          {new Date(document.submissionDate).toLocaleTimeString('es-ES', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`
                      px-2 py-1 text-xs font-medium rounded-full
                      ${getPriorityColor(document.priority)}
                    `}>
                      {document.priority === 'high' ? 'Alta' : 
                       document.priority === 'medium' ? 'Media' : 'Baja'}
                    </span>
                    
                    {document.flagged && (
                      <div className="flex items-center space-x-1 text-error">
                        <Icon name="Flag" size={12} />
                        <span className="text-xs">Marcado</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Document Types */}
                <div className="flex items-center space-x-2 mt-2 ml-8">
                  {document.documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-1 px-2 py-1 bg-muted rounded text-xs"
                    >
                      <Icon name="FileImage" size={12} />
                      <span>{doc.type}</span>
                      {doc.quality && (
                        <span className={`
                          w-2 h-2 rounded-full
                          ${doc.quality === 'good' ? 'bg-success' : 
                            doc.quality === 'fair' ? 'bg-warning' : 'bg-error'}
                        `} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredDocuments.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <Icon name="FileX" size={48} className="text-text-secondary mb-4" />
                <h4 className="text-lg font-medium text-text-primary mb-2">
                  No hay documentos pendientes
                </h4>
                <p className="text-sm text-text-secondary">
                  Todos los documentos han sido procesados
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Página {currentPage} de {totalPages}
            </span>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <Icon name="ChevronLeft" size={16} />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <Icon name="ChevronRight" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Queue Stats */}
      <div className="p-4 border-t border-border bg-muted/50">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-text-primary">
              {documents.filter(d => d.status === 'pending').length}
            </div>
            <div className="text-xs text-text-secondary">Pendientes</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-warning">
              {documents.filter(d => d.status === 'in-review').length}
            </div>
            <div className="text-xs text-text-secondary">En Revisión</div>
          </div>
          <div>
            <div className="text-lg font-semibold text-error">
              {documents.filter(d => d.flagged).length}
            </div>
            <div className="text-xs text-text-secondary">Marcados</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationQueue;