import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CaregiverSearchCard = ({ caregiver }) => {
  const navigate = useNavigate();
  const [showAllSkills, setShowAllSkills] = useState(false);

  const getCaregiverTypeLabel = (type) => {
    const labels = {
      'Child Care': 'Cuidado de Niños',
      'Senior Care': 'Cuidado de Adultos Mayores',
      'Adult Care': 'Cuidado de Adultos'
    };
    return labels[type] || type;
  };

  const getHelpTypeLabels = (types) => {
    const labels = {
      'Household tasks': 'Tareas del Hogar',
      'Personal care': 'Cuidado Personal',
      'Mobility assistance': 'Asistencia de Movilidad'
    };
    return types.map(type => labels[type] || type);
  };

  const handleContact = () => {
    // Aquí se implementaría la lógica de contacto
    alert(`Contactando a ${caregiver.name}...`);
  };

  const handleViewProfile = () => {
    navigate(`/caregiver-profile/${caregiver.id}`);
  };

  const displayedSkills = showAllSkills ? caregiver.skills : caregiver.skills.slice(0, 3);
  const hasMoreSkills = caregiver.skills.length > 3;

  return (
    <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow duration-200 overflow-hidden">
      {/* Header con foto y información básica */}
      <div className="relative">
        <Image
          src={caregiver.photo}
          alt={`Foto de ${caregiver.name}`}
          className="w-full h-48 object-cover"
        />
        
        {/* Badge de tipo de cuidador */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
            {getCaregiverTypeLabel(caregiver.caregiverType)}
          </span>
        </div>

        {/* Rating */}
        <div className="absolute top-3 right-3">
          <div className="flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
            <Icon name="Star" size={14} className="text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-text-primary">{caregiver.rating}</span>
          </div>
        </div>

        {/* Precio por hora */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1">
            <span className="text-sm font-semibold text-primary">{caregiver.hourlyRate}</span>
            <span className="text-xs text-text-secondary">/hora</span>
          </div>
        </div>
      </div>

      {/* Contenido de la card */}
      <div className="p-6">
        {/* Nombre y edad */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-1">
              {caregiver.name}
            </h3>
            <div className="flex items-center space-x-4 text-sm text-text-secondary">
              <span className="flex items-center space-x-1">
                <Icon name="Calendar" size={14} />
                <span>{caregiver.age} años</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{caregiver.location}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Nacionalidad y experiencia */}
        <div className="flex items-center space-x-4 mb-3 text-sm text-text-secondary">
          <span className="flex items-center space-x-1">
            <Icon name="Flag" size={14} />
            <span>{caregiver.nationality}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Clock" size={14} />
            <span>{caregiver.experience}</span>
          </span>
        </div>

        {/* Descripción */}
        <p className="text-text-secondary text-sm mb-4 line-clamp-3">
          {caregiver.description}
        </p>

        {/* Tipos de ayuda */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-text-primary mb-2">Tipos de Ayuda:</h4>
          <div className="flex flex-wrap gap-2">
            {getHelpTypeLabels(caregiver.helpTypes).map((type, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        {/* Habilidades */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-text-primary mb-2">Habilidades:</h4>
          <div className="space-y-2">
            {displayedSkills.map((skill, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon name="Check" size={14} className="text-green-500 flex-shrink-0" />
                <span className="text-sm text-text-secondary">{skill}</span>
              </div>
            ))}
            
            {hasMoreSkills && (
              <button
                onClick={() => setShowAllSkills(!showAllSkills)}
                className="text-sm text-primary hover:text-primary/80 font-medium"
              >
                {showAllSkills ? 'Mostrar menos' : `Ver ${caregiver.skills.length - 3} más`}
              </button>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex space-x-3">
          <button
            onClick={handleContact}
            className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="MessageCircle" size={16} />
            <span>Contactar</span>
          </button>
          
          <button
            onClick={handleViewProfile}
            className="flex-1 bg-white text-primary border border-primary py-2 px-4 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Icon name="User" size={16} />
            <span>Ver Perfil</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaregiverSearchCard;




