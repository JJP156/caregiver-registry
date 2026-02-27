import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const VerificationControls = ({ 
  document, 
  onApprove, 
  onReject, 
  onSaveNotes,
  className = '' 
}) => {
  const [notes, setNotes] = useState('');
  const [checklist, setChecklist] = useState({
    imageQuality: false,
    documentLegibility: false,
    informationMatch: false,
    noTampering: false,
    validFormat: false
  });
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionForm, setShowRejectionForm] = useState(false);

  const checklistItems = [
    {
      key: 'imageQuality',
      label: 'Calidad de imagen aceptable',
      description: 'La imagen es clara y nítida'
    },
    {
      key: 'documentLegibility',
      label: 'Documento legible',
      description: 'Todos los textos son legibles'
    },
    {
      key: 'informationMatch',
      label: 'Información coincidente',
      description: 'Los datos coinciden con el formulario'
    },
    {
      key: 'noTampering',
      label: 'Sin alteraciones',
      description: 'No hay signos de manipulación'
    },
    {
      key: 'validFormat',
      label: 'Formato válido',
      description: 'Cumple con los requisitos técnicos'
    }
  ];

  const rejectionReasons = [
    { value: 'poor_quality', label: 'Calidad de imagen insuficiente' },
    { value: 'illegible', label: 'Documento ilegible' },
    { value: 'incomplete', label: 'Información incompleta' },
    { value: 'mismatch', label: 'Datos no coinciden' },
    { value: 'tampering', label: 'Posible alteración detectada' },
    { value: 'wrong_format', label: 'Formato incorrecto' },
    { value: 'expired', label: 'Documento vencido' },
    { value: 'other', label: 'Otro motivo' }
  ];

  const handleChecklistChange = (key, checked) => {
    setChecklist(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  const handleApprove = () => {
    const allChecked = Object.values(checklist).every(Boolean);
    if (!allChecked) {
      alert('Por favor, complete todos los elementos de la lista de verificación antes de aprobar.');
      return;
    }
    
    onApprove?.({
      documentId: document.id,
      checklist,
      notes,
      timestamp: new Date().toISOString()
    });
  };

  const handleReject = () => {
    if (!rejectionReason) {
      alert('Por favor, seleccione un motivo de rechazo.');
      return;
    }
    
    onReject?.({
      documentId: document.id,
      reason: rejectionReason,
      notes,
      timestamp: new Date().toISOString()
    });
    
    setShowRejectionForm(false);
    setRejectionReason('');
  };

  const completionPercentage = Math.round(
    (Object.values(checklist).filter(Boolean).length / checklistItems.length) * 100
  );

  if (!document) {
    return (
      <div className={`bg-surface border border-border rounded-lg h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Icon name="ClipboardCheck" size={48} className="text-text-secondary mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Controles de Verificación
          </h3>
          <p className="text-sm text-text-secondary">
            Selecciona un documento para comenzar la verificación
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border border-border rounded-lg h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-text-primary">
            Verificación
          </h3>
          <div className="flex items-center space-x-2">
            <div className="text-sm text-text-secondary">
              Progreso: {completionPercentage}%
            </div>
            <div className="w-16 bg-muted rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
        <p className="text-sm text-text-secondary">
          Complete la lista de verificación para proceder
        </p>
      </div>

      {/* Verification Checklist */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h4 className="text-md font-medium text-text-primary mb-3">
            Lista de Verificación
          </h4>
          
          {checklistItems.map((item) => (
            <div key={item.key} className="border border-border rounded-lg p-3">
              <Checkbox
                label={item.label}
                description={item.description}
                checked={checklist[item.key]}
                onChange={(e) => handleChecklistChange(item.key, e.target.checked)}
                className="mb-0"
              />
            </div>
          ))}
        </div>

        {/* Notes Section */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-text-primary mb-2">
            Notas de Verificación
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Agregue observaciones o comentarios sobre la verificación..."
            className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-input text-text-primary placeholder-text-secondary resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Document Info */}
        <div className="mt-6 p-3 bg-muted rounded-lg">
          <h5 className="text-sm font-medium text-text-primary mb-2">
            Información del Documento
          </h5>
          <div className="space-y-1 text-xs text-text-secondary">
            <div>Cuidador: {document.caregiverName}</div>
            <div>DNI: {document.dniNumber}</div>
            <div>Enviado: {new Date(document.submissionDate).toLocaleString('es-ES')}</div>
            <div>Prioridad: {document.priority === 'high' ? 'Alta' : document.priority === 'medium' ? 'Media' : 'Baja'}</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-border bg-muted/30">
        {!showRejectionForm ? (
          <div className="space-y-3">
            <Button
              variant="success"
              fullWidth
              onClick={handleApprove}
              disabled={completionPercentage < 100}
              iconName="CheckCircle"
              iconPosition="left"
            >
              Aprobar Documento
            </Button>
            
            <Button
              variant="destructive"
              fullWidth
              onClick={() => setShowRejectionForm(true)}
              iconName="XCircle"
              iconPosition="left"
            >
              Rechazar Documento
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                fullWidth
                onClick={() => onSaveNotes?.(notes)}
                iconName="Save"
                iconPosition="left"
              >
                Guardar Notas
              </Button>
              
              <Button
                variant="ghost"
                fullWidth
                onClick={() => {
                  // Flag document for review
                }}
                iconName="Flag"
                iconPosition="left"
              >
                Marcar
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <h5 className="text-sm font-medium text-text-primary">
              Motivo de Rechazo
            </h5>
            
            <select
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full px-3 py-2 border border-border rounded-lg bg-input text-text-primary"
            >
              <option value="">Seleccione un motivo</option>
              {rejectionReasons.map((reason) => (
                <option key={reason.value} value={reason.value}>
                  {reason.label}
                </option>
              ))}
            </select>
            
            <div className="flex space-x-2">
              <Button
                variant="destructive"
                fullWidth
                onClick={handleReject}
                disabled={!rejectionReason}
              >
                Confirmar Rechazo
              </Button>
              
              <Button
                variant="outline"
                fullWidth
                onClick={() => {
                  setShowRejectionForm(false);
                  setRejectionReason('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationControls;