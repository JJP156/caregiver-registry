import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentViewer = ({ 
  document, 
  onApprove,
  onReject,
  onSaveNotes,
  onClose,
  className = '' 
}) => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [activeDocument, setActiveDocument] = useState(0);
  const [enhancementMode, setEnhancementMode] = useState('normal');
  const [notes, setNotes] = useState(document?.validationNotes || '');
  const [loading, setLoading] = useState(false);

  if (!document) {
    return (
      <div className={`bg-surface border border-border rounded-lg h-full flex items-center justify-center ${className}`}>
        <div className="text-center">
          <Icon name="FileImage" size={64} className="text-text-secondary mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-text-primary mb-2">
            Selecciona un documento
          </h3>
          <p className="text-sm text-text-secondary">
            Elige un documento de la cola para comenzar la verificación
          </p>
        </div>
      </div>
    );
  }

  const handleZoomIn = () => {
    const newZoom = Math.min(zoom + 25, 300);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoom - 25, 50);
    setZoom(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleRotate = () => {
    const newRotation = (rotation + 90) % 360;
    setRotation(newRotation);
    onRotate?.(newRotation);
  };

  const handleReset = () => {
    setZoom(100);
    setRotation(0);
    setEnhancementMode('normal');
  };

  const enhancementOptions = [
    { value: 'normal', label: 'Normal', icon: 'Image' },
    { value: 'contrast', label: 'Alto Contraste', icon: 'Sun' },
    { value: 'brightness', label: 'Brillo', icon: 'Lightbulb' },
    { value: 'sharpen', label: 'Nitidez', icon: 'Focus' }
  ];

  return (
    <div className={`bg-surface border border-border rounded-lg h-full flex flex-col ${className}`}>
      {/* Viewer Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary">
              {document.caregiverName}
            </h3>
            <p className="text-sm text-text-secondary">
              DNI: {document.dniNumber} • Enviado el {new Date(document.submissionDate).toLocaleDateString('es-ES')}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
            >
              <Icon name="Printer" size={16} className="mr-2" />
              Imprimir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                // Download functionality
              }}
            >
              <Icon name="Download" size={16} className="mr-2" />
              Descargar
            </Button>
          </div>
        </div>

        {/* Document Tabs */}
        <div className="flex items-center space-x-2">
          {document.documents.map((doc, index) => (
            <button
              key={index}
              onClick={() => setActiveDocument(index)}
              className={`
                px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${activeDocument === index
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-text-secondary hover:text-text-primary'
                }
              `}
            >
              <Icon name="FileImage" size={16} className="mr-2" />
              {doc.type}
            </button>
          ))}
        </div>
      </div>

      {/* Viewer Controls */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <Icon name="ZoomOut" size={16} />
            </Button>
            
            <span className="text-sm font-mono text-text-primary min-w-16 text-center">
              {zoom}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 300}
            >
              <Icon name="ZoomIn" size={16} />
            </Button>
            
            <div className="w-px h-6 bg-border mx-2" />
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
            >
              <Icon name="RotateCw" size={16} />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
            >
              <Icon name="RotateCcw" size={16} />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {enhancementOptions.map((option) => (
              <Button
                key={option.value}
                variant={enhancementMode === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setEnhancementMode(option.value);
                  onEnhance?.(option.value);
                }}
              >
                <Icon name={option.icon} size={16} className="mr-1" />
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Document Display */}
      <div className="flex-1 overflow-hidden bg-gray-100">
        <div className="h-full flex items-center justify-center p-4">
          <div 
            className="relative bg-white shadow-lg rounded-lg overflow-hidden"
            style={{
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.3s ease'
            }}
          >
            <Image
              src={document.documents[activeDocument]?.url || '/assets/images/no_image.png'}
              alt={`${document.documents[activeDocument]?.type} de ${document.caregiverName}`}
              className={`
                max-w-none h-auto
                ${enhancementMode === 'contrast' ? 'contrast-150' : ''}
                ${enhancementMode === 'brightness' ? 'brightness-125' : ''}
                ${enhancementMode === 'sharpen' ? 'filter-none' : ''}
              `}
              style={{
                width: '600px',
                height: '400px',
                objectFit: 'contain'
              }}
            />
            
            {/* Image Quality Indicator */}
            <div className="absolute top-2 right-2">
              <div className={`
                px-2 py-1 text-xs font-medium rounded-full
                ${document.documents[activeDocument]?.quality === 'good' ?'bg-success text-success-foreground' 
                  : document.documents[activeDocument]?.quality === 'fair' ?'bg-warning text-warning-foreground' :'bg-error text-error-foreground'
                }
              `}>
                {document.documents[activeDocument]?.quality === 'good' ? 'Buena Calidad' :
                 document.documents[activeDocument]?.quality === 'fair' ? 'Calidad Regular' : 'Baja Calidad'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Document Info */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-text-secondary">Tamaño del archivo:</span>
            <span className="ml-2 text-text-primary font-medium">
              {document.documents[activeDocument]?.size || '2.4 MB'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Formato:</span>
            <span className="ml-2 text-text-primary font-medium">
              {document.documents[activeDocument]?.format || 'JPEG'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Resolución:</span>
            <span className="ml-2 text-text-primary font-medium">
              {document.documents[activeDocument]?.resolution || '1920x1080'}
            </span>
          </div>
          <div>
            <span className="text-text-secondary">Subido:</span>
            <span className="ml-2 text-text-primary font-medium">
              {new Date(document.submissionDate).toLocaleString('es-ES')}
            </span>
          </div>
        </div>
      </div>

      {/* Verification Controls */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="space-y-4">
          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Notas de Validación
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Agrega notas sobre la validación del documento..."
              className="w-full p-3 border border-border rounded-lg resize-none focus:ring-2 focus:ring-primary focus:border-transparent"
              rows={3}
            />
            <div className="flex justify-end mt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSaveNotes(notes)}
                disabled={loading}
              >
                <Icon name="Save" size={16} className="mr-2" />
                Guardar Notas
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              <Icon name="X" size={16} className="mr-2" />
              Cerrar
            </Button>
            <Button
              variant="destructive"
              onClick={() => onReject({ notes })}
              className="flex-1"
              disabled={loading}
            >
              <Icon name="XCircle" size={16} className="mr-2" />
              Rechazar
            </Button>
            <Button
              variant="default"
              onClick={() => onApprove({ notes })}
              className="flex-1"
              disabled={loading}
            >
              <Icon name="CheckCircle" size={16} className="mr-2" />
              Aprobar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;