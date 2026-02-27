import React from 'react';
import Icon from '../../../components/AppIcon';

const PersonalInfoSection = ({ caregiver }) => {
  const personalInfo = [
    { label: 'Nombre Completo', value: `${caregiver.firstName} ${caregiver.lastName}`, icon: 'User' },
    { label: 'Fecha de Nacimiento', value: caregiver.dateOfBirth, icon: 'Calendar' },
    { label: 'DNI', value: caregiver.dni, icon: 'CreditCard' },
    { label: 'Teléfono', value: caregiver.phone, icon: 'Phone' },
    { label: 'Email', value: caregiver.email, icon: 'Mail' },
    { label: 'Dirección', value: caregiver.address, icon: 'MapPin' }
  ];

  const experienceInfo = [
    { label: 'Años de Experiencia', value: `${caregiver.experience} años`, icon: 'Clock' },
    { label: 'Especialización', value: caregiver.specialization, icon: 'Heart' },
    { label: 'Certificaciones', value: caregiver.certifications.join(', '), icon: 'Award' },
    { label: 'Idiomas', value: caregiver.languages.join(', '), icon: 'Globe' }
  ];

  const InfoCard = ({ title, items, bgColor = 'bg-surface' }) => (
    <div className={`${bgColor} border border-border rounded-lg p-6 mb-6`}>
      <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center">
        <Icon name="Info" size={20} className="mr-2 text-primary" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon name={item.icon} size={16} className="text-text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-secondary">{item.label}</p>
              <p className="text-base text-text-primary mt-1 break-words">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <InfoCard title="Información Personal" items={personalInfo} />
      <InfoCard title="Información Profesional" items={experienceInfo} bgColor="bg-muted/30" />
    </div>
  );
};

export default PersonalInfoSection;