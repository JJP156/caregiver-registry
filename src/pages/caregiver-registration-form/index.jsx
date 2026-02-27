import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import PersonalInfoSection from './components/PersonalInfoSection';
import DNIUploadSection from './components/DNIUploadSection';
import ProgressIndicator from './components/ProgressIndicator';
import FloatingActionBar from './components/FloatingActionBar';
import ValidationSummary from './components/ValidationSummary';
import Icon from '../../components/AppIcon';

const CaregiverRegistrationForm = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    dniNumber: '',
    phone: '',
    address: '',
    dniFront: null,
    dniFrontPreview: '',
    dniBack: null,
    dniBackPreview: '',
    dniFrontError: '',
    dniBackError: ''
  });

  const [errors, setErrors] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  // Mock user data
  const user = {
    name: 'María González',
    email: 'maria.gonzalez@caregiverregistry.com'
  };

  useEffect(() => {
    // Load draft from localStorage on component mount
    const savedDraft = localStorage.getItem('caregiver-registration-draft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(prev => ({ ...prev, ...parsedDraft }));
        setLastSaved(new Date(parsedDraft.lastSaved));
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, []);

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);

    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Personal information validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'El nombre es obligatorio';
    } else if (formData.firstName.length < 2) {
      newErrors.firstName = 'El nombre debe tener al menos 2 caracteres';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Los apellidos son obligatorios';
    } else if (formData.lastName.length < 2) {
      newErrors.lastName = 'Los apellidos deben tener al menos 2 caracteres';
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'La fecha de nacimiento es obligatoria';
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'Debe ser mayor de 18 años';
      } else if (age > 80) {
        newErrors.dateOfBirth = 'Edad no válida';
      }
    }

    if (!formData.dniNumber.trim()) {
      newErrors.dniNumber = 'El número de DNI es obligatorio';
    } else if (!/^[0-9]{8}[A-Za-z]$/.test(formData.dniNumber)) {
      newErrors.dniNumber = 'Formato de DNI inválido (ej: 12345678A)';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es obligatorio';
    } else if (!/^(\+34|0034|34)?[6789]\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Formato de teléfono inválido';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
    } else if (formData.address.length < 10) {
      newErrors.address = 'La dirección debe ser más específica';
    }

    // DNI upload validation
    if (!formData.dniFront) {
      newErrors.dniFront = 'La imagen del DNI (anverso) es obligatoria';
    }

    if (!formData.dniBack) {
      newErrors.dniBack = 'La imagen del DNI (reverso) es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const draftData = {
        ...formData,
        lastSaved: new Date().toISOString()
      };
      
      // Remove file objects and previews for localStorage
      const { dniFront, dniBack, dniFrontPreview, dniBackPreview, ...saveData } = draftData;
      
      localStorage.setItem('caregiver-registration-draft', JSON.stringify(saveData));
      setLastSaved(new Date());
      setHasChanges(false);
      
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Clear draft from localStorage
      localStorage.removeItem('caregiver-registration-draft');
      
      // Navigate to success page or dashboard
      navigate('/caregiver-management-dashboard', {
        state: { 
          message: 'Registro de cuidador enviado correctamente',
          type: 'success'
        }
      });
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error al enviar el formulario. Inténtelo de nuevo.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldFocus = (fieldName) => {
    const element = document.querySelector(`[name="${fieldName}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.focus();
    }
  };

  const handleLogout = () => {
    navigate('/authentication-login');
  };

  const isFormValid = () => {
    return formData.firstName.trim() && 
           formData.lastName.trim() && 
           formData.dateOfBirth && 
           formData.dniNumber.trim() && 
           formData.phone.trim() && 
           formData.address.trim() && 
           formData.dniFront && 
           formData.dniBack &&
           Object.keys(errors).length === 0;
  };

  const breadcrumbItems = [
    { label: 'Dashboard', path: '/caregiver-management-dashboard' },
    { label: 'Registro', path: '/caregiver-registration-form', isCurrent: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={handleLogout}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`
        transition-all duration-300 pt-16 pb-24
        ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-72'}
      `}>
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Breadcrumb customItems={breadcrumbItems} />

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Registro de Nuevo Cuidador
            </h1>
            <p className="text-text-secondary">
              Complete el formulario con la información personal y documentación requerida
            </p>
          </div>

          {lastSaved && (
            <StatusIndicatorBar
              status="active"
              title="Borrador guardado"
              subtitle={`Última actualización: ${lastSaved.toLocaleString('es-ES')}`}
              className="mb-6"
            />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
           

            <div className="lg:col-span-3 space-y-6">
              <ProgressIndicator currentStep={currentStep} totalSteps={3} />

              <ValidationSummary 
                errors={errors}
                onFieldFocus={handleFieldFocus}
              />

              <PersonalInfoSection
                formData={formData}
                errors={errors}
                onChange={handleFormChange}
                isSubmitting={isSubmitting}
              />

              <DNIUploadSection
                formData={formData}
                errors={errors}
                onChange={handleFormChange}
                isSubmitting={isSubmitting}
              />

              {errors.submit && (
                <div className="bg-error/5 border border-error/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <Icon name="AlertCircle" size={20} className="text-error" />
                    <span className="text-sm text-error">{errors.submit}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <FloatingActionBar
        onSaveDraft={handleSaveDraft}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        isSaving={isSaving}
        hasChanges={hasChanges}
        isValid={isFormValid()}
      />
    </div>
  );
};

export default CaregiverRegistrationForm;