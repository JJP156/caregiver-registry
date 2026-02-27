import React from 'react';
import Icon from '../AppIcon';

const SelectableChips = ({ 
  options = [], 
  value = [], 
  onChange, 
  multiple = true,
  label = "Seleccionar opciones",
  className = "",
  chipClassName = ""
}) => {
  const handleChipClick = (optionValue) => {
    if (multiple) {
      const newValue = value.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...value, optionValue];
      onChange(newValue);
    } else {
      onChange(value === optionValue ? '' : optionValue);
    }
  };

  const isSelected = (optionValue) => {
    if (multiple) {
      return value.includes(optionValue);
    }
    return value === optionValue;
  };

  const getChipConfig = (type) => {
    const configs = {
      'Child Care': {
        label: 'Cuidado de Niños',
        icon: 'Baby',
        color: 'bg-blue-500',
        hoverColor: 'hover:bg-blue-600',
        selectedColor: 'bg-blue-600',
        textColor: 'text-white',
        borderColor: 'border-blue-500',
        selectedBorderColor: 'border-blue-600'
      },
      'Senior Care': {
        label: 'Cuidado de Adultos Mayores',
        icon: 'Heart',
        color: 'bg-purple-500',
        hoverColor: 'hover:bg-purple-600',
        selectedColor: 'bg-purple-600',
        textColor: 'text-white',
        borderColor: 'border-purple-500',
        selectedBorderColor: 'border-purple-600'
      },
      'Adult Care': {
        label: 'Cuidado de Adultos',
        icon: 'User',
        color: 'bg-green-500',
        hoverColor: 'hover:bg-green-600',
        selectedColor: 'bg-green-600',
        textColor: 'text-white',
        borderColor: 'border-green-500',
        selectedBorderColor: 'border-green-600'
      },
      'Household tasks': {
        label: 'Tareas del Hogar',
        icon: 'Home',
        color: 'bg-orange-500',
        hoverColor: 'hover:bg-orange-600',
        selectedColor: 'bg-orange-600',
        textColor: 'text-white',
        borderColor: 'border-orange-500',
        selectedBorderColor: 'border-orange-600'
      },
      'Personal care': {
        label: 'Cuidado Personal',
        icon: 'UserCheck',
        color: 'bg-teal-500',
        hoverColor: 'hover:bg-teal-600',
        selectedColor: 'bg-teal-600',
        textColor: 'text-white',
        borderColor: 'border-teal-500',
        selectedBorderColor: 'border-teal-600'
      },
      'Mobility assistance': {
        label: 'Asistencia de Movilidad',
        icon: 'Wheelchair',
        color: 'bg-indigo-500',
        hoverColor: 'hover:bg-indigo-600',
        selectedColor: 'bg-indigo-600',
        textColor: 'text-white',
        borderColor: 'border-indigo-500',
        selectedBorderColor: 'border-indigo-600'
      }
    };
    
    return configs[type] || {
      label: type,
      icon: 'Circle',
      color: 'bg-gray-500',
      hoverColor: 'hover:bg-gray-600',
      selectedColor: 'bg-gray-600',
      textColor: 'text-white',
      borderColor: 'border-gray-500',
      selectedBorderColor: 'border-gray-600'
    };
  };

  return (
    <div className={`space-y-3 ${className}`}>
      <label className="block text-sm font-medium text-text-primary">
        {label}
      </label>
      
      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const config = getChipConfig(option.value);
          const selected = isSelected(option.value);
          
          return (
            <button
              key={option.value}
              onClick={() => handleChipClick(option.value)}
              className={`
                inline-flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all duration-200 cursor-pointer
                ${selected 
                  ? `${config.selectedColor} ${config.selectedBorderColor} ${config.textColor} shadow-lg scale-105` 
                  : `${config.color} ${config.borderColor} ${config.textColor} ${config.hoverColor} hover:scale-105`
                }
                ${chipClassName}
              `}
            >
              <Icon 
                name={config.icon} 
                size={16} 
                className="flex-shrink-0"
              />
              <span className="font-medium text-sm whitespace-nowrap">
                {option.label}
              </span>
              
              {selected && (
                <Icon 
                  name="Check" 
                  size={14} 
                  className="flex-shrink-0 ml-1"
                />
              )}
            </button>
          );
        })}
      </div>
      
      {value.length > 0 && (
        <div className="text-xs text-text-secondary">
          {multiple 
            ? `${value.length} opción${value.length !== 1 ? 'es' : ''} seleccionada${value.length !== 1 ? 's' : ''}`
            : '1 opción seleccionada'
          }
        </div>
      )}
    </div>
  );
};

export default SelectableChips;




