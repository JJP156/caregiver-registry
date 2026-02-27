import React from 'react';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const PersonalInfoSection = ({ 
  formData, 
  errors, 
  onChange, 
  isSubmitting 
}) => {
  const handleInputChange = (field, value) => {
    onChange(field, value);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="User" size={20} className="text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-text-primary">
            Información Personal
          </h2>
          <p className="text-sm text-text-secondary">
            Complete los datos personales del cuidador
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Nombre"
          type="text"
          placeholder="Ingrese el nombre"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={errors.firstName}
          required
          disabled={isSubmitting}
          className="w-full"
        />

        <Input
          label="Apellidos"
          type="text"
          placeholder="Ingrese los apellidos"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={errors.lastName}
          required
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="mt-6">
        <Input
          label="Fecha de Nacimiento"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
          error={errors.dateOfBirth}
          required
          disabled={isSubmitting}
          description="Formato: DD/MM/YYYY"
          className="w-full md:w-1/2"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Número de DNI"
          type="text"
          placeholder="12345678A"
          value={formData.dniNumber}
          onChange={(e) => handleInputChange('dniNumber', e.target.value)}
          error={errors.dniNumber}
          required
          disabled={isSubmitting}
          pattern="[0-9]{8}[A-Za-z]"
          maxLength={9}
          className="w-full"
        />

        <Input
          label="Teléfono de Contacto"
          type="tel"
          placeholder="+34 600 000 000"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          error={errors.phone}
          required
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="mt-6">
        <Input
          label="Email de Contacto"
          type="email"
          placeholder="cuidador@email.com"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={errors.email}
          required
          disabled={isSubmitting}
          className="w-full"
        />
      </div>

      <div className="mt-6">
        <Input
          label="Dirección de Residencia"
          type="text"
          placeholder="Calle, número, ciudad, código postal"
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
          error={errors.address}
          required
          disabled={isSubmitting}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;