import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const FloatingActionBar = ({ 
  onSaveDraft, 
  onSubmit, 
  isSubmitting, 
  isSaving, 
  hasChanges,
  isValid 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border shadow-elevated">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {hasChanges && (
              <div className="flex items-center space-x-2 text-warning">
                <Icon name="AlertCircle" size={16} />
                <span className="text-sm font-medium">Cambios sin guardar</span>
              </div>
            )}
            
            <div className="text-sm text-text-secondary">
              {isSubmitting ? 'Enviando registro...' : 
               isSaving ? 'Guardando borrador...': 'Formulario listo para enviar'}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={onSaveDraft}
              disabled={isSubmitting || isSaving || !hasChanges}
              loading={isSaving}
              iconName="Save"
              iconPosition="left"
            >
              Guardar Borrador
            </Button>

            <Button
              variant="default"
              onClick={onSubmit}
              disabled={isSubmitting || isSaving || !isValid}
              loading={isSubmitting}
              iconName="Send"
              iconPosition="left"
            >
              Enviar Registro
            </Button>
          </div>
        </div>

        {/* Progress indicator during submission */}
        {(isSubmitting || isSaving) && (
          <div className="mt-3">
            <div className="w-full bg-muted rounded-full h-1">
              <div className="bg-primary h-1 rounded-full animate-pulse w-1/3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingActionBar;