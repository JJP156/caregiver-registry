import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DNIUploadSection = ({ 
  formData, 
  errors, 
  onChange, 
  isSubmitting 
}) => {
  const [dragStates, setDragStates] = useState({
    front: false,
    back: false
  });
  
  const frontInputRef = useRef(null);
  const backInputRef = useRef(null);

  const handleDragOver = (e, side) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [side]: true }));
  };

  const handleDragLeave = (e, side) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [side]: false }));
  };

  const handleDrop = (e, side) => {
    e.preventDefault();
    setDragStates(prev => ({ ...prev, [side]: false }));
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0], side);
    }
  };

  const handleFileSelect = (file, side) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onChange(`dni${side.charAt(0).toUpperCase() + side.slice(1)}Error`, 
        'Por favor, seleccione un archivo de imagen válido');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onChange(`dni${side.charAt(0).toUpperCase() + side.slice(1)}Error`, 
        'El archivo no puede superar los 5MB');
      return;
    }

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    
    // Update form data
    onChange(`dni${side.charAt(0).toUpperCase() + side.slice(1)}`, file);
    onChange(`dni${side.charAt(0).toUpperCase() + side.slice(1)}Preview`, previewUrl);
    onChange(`dni${side.charAt(0).toUpperCase() + side.slice(1)}Error`, '');
  };

  const handleFileInputChange = (e, side) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file, side);
    }
  };

  const removeFile = (side) => {
    const fieldName = `dni${side.charAt(0).toUpperCase() + side.slice(1)}`;
    const previewName = `${fieldName}Preview`;
    
    // Revoke object URL to prevent memory leaks
    if (formData[previewName]) {
      URL.revokeObjectURL(formData[previewName]);
    }
    
    onChange(fieldName, null);
    onChange(previewName, '');
    onChange(`${fieldName}Error`, '');
    
    // Reset file input
    if (side === 'front' && frontInputRef.current) {
      frontInputRef.current.value = '';
    } else if (side === 'back' && backInputRef.current) {
      backInputRef.current.value = '';
    }
  };

  const renderUploadZone = (side, title, description) => {
    const fieldName = `dni${side.charAt(0).toUpperCase() + side.slice(1)}`;
    const previewName = `${fieldName}Preview`;
    const errorName = `${fieldName}Error`;
    const isDragging = dragStates[side];
    const hasFile = formData[fieldName];
    const hasError = errors[errorName];

    return (
      <div className="flex-1">
        <div className="mb-3">
          <h3 className="text-sm font-medium text-text-primary flex items-center">
            {title}
            <span className="text-error ml-1">*</span>
          </h3>
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        </div>

        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200
            ${isDragging 
              ? 'border-primary bg-primary/5' 
              : hasError 
              ? 'border-error bg-error/5' 
              : hasFile 
              ? 'border-success bg-success/5' :'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
            }
            ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
          onDragOver={(e) => !isSubmitting && handleDragOver(e, side)}
          onDragLeave={(e) => !isSubmitting && handleDragLeave(e, side)}
          onDrop={(e) => !isSubmitting && handleDrop(e, side)}
          onClick={() => !isSubmitting && (side === 'front' ? frontInputRef.current?.click() : backInputRef.current?.click())}
        >
          <input
            ref={side === 'front' ? frontInputRef : backInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleFileInputChange(e, side)}
            className="hidden"
            disabled={isSubmitting}
          />

          {hasFile && formData[previewName] ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <Image
                  src={formData[previewName]}
                  alt={`DNI ${side} preview`}
                  className="w-32 h-20 object-cover rounded-lg border border-border"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(side);
                  }}
                  className="absolute -top-2 -right-2 w-6 h-6"
                  disabled={isSubmitting}
                >
                  <Icon name="X" size={14} />
                </Button>
              </div>
              <div className="flex items-center justify-center space-x-2 text-success">
                <Icon name="CheckCircle" size={16} />
                <span className="text-sm font-medium">Archivo cargado</span>
              </div>
              <p className="text-xs text-text-secondary">
                {formData[fieldName]?.name}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className={`
                w-16 h-16 mx-auto rounded-full flex items-center justify-center
                ${isDragging ? 'bg-primary text-primary-foreground' : 'bg-muted text-text-secondary'}
              `}>
                <Icon name={isDragging ? "Upload" : "Camera"} size={24} />
              </div>
              
              <div>
                <p className="text-sm font-medium text-text-primary mb-1">
                  {isDragging ? 'Suelte el archivo aquí' : 'Arrastra y suelta tu imagen'}
                </p>
                <p className="text-xs text-text-secondary">
                  o <span className="text-primary font-medium">haz clic para seleccionar</span>
                </p>
              </div>
              
              <div className="text-xs text-text-secondary space-y-1">
                <p>Formatos: JPG, PNG, PDF</p>
                <p>Tamaño máximo: 5MB</p>
              </div>
            </div>
          )}
        </div>

        {hasError && (
          <div className="mt-2 flex items-center space-x-2 text-error">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm">{errors[errorName]}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
          <Icon name="FileImage" size={20} className="text-accent" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Documentación DNI
          </h2>
          <p className="text-sm text-text-secondary">
            Suba las imágenes del DNI (anverso y reverso)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {renderUploadZone('front', 'DNI - Anverso', 'Cara frontal del documento')}
        {renderUploadZone('back', 'DNI - Reverso', 'Cara posterior del documento')}
      </div>

      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={16} className="text-primary mt-0.5 flex-shrink-0" />
          <div className="text-sm text-text-secondary">
            <p className="font-medium text-text-primary mb-1">Requisitos de las imágenes:</p>
            <ul className="space-y-1 text-xs">
              <li>• Las imágenes deben ser claras y legibles</li>
              <li>• Evite reflejos, sombras o desenfoques</li>
              <li>• El documento debe ocupar la mayor parte de la imagen</li>
              <li>• Formatos aceptados: JPG, PNG, PDF</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DNIUploadSection;