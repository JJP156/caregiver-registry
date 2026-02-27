import React from 'react';
import Icon from '../../../components/AppIcon';
import RangeSlider from '../../../components/ui/RangeSlider';
import SelectableChips from '../../../components/ui/SelectableChips';

const SearchFilters = ({ filters, onFilterChange, onSearch, onClear, loading }) => {
  const caregiverTypes = [
    { value: 'Child Care', label: 'Cuidado de Niños' },
    { value: 'Senior Care', label: 'Cuidado de Adultos Mayores' },
    { value: 'Adult Care', label: 'Cuidado de Adultos' }
  ];

  const helpTypes = [
    { value: 'Household tasks', label: 'Tareas del Hogar' },
    { value: 'Personal care', label: 'Cuidado Personal' },
    { value: 'Mobility assistance', label: 'Asistencia de Movilidad' }
  ];

  const ageRanges = [
    { value: '18-25', label: '18-25 años' },
    { value: '26-35', label: '26-35 años' },
    { value: '36-45', label: '36-45 años' },
    { value: '46-55', label: '46-55 años' },
    { value: '56+', label: '56+ años' }
  ];

  const handleFilterChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleChipChange = (key, value) => {
    onFilterChange({ [key]: value });
  };

  const handleAgeRangeChange = (ageRange) => {
    onFilterChange({ ageRange: ageRange.join('-') });
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== null && value !== undefined);

  return (
    <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary mb-2">
            Filtros de Búsqueda
          </h2>
          <p className="text-text-secondary">
            Refina tu búsqueda para encontrar el cuidador perfecto
          </p>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClear}
            className="text-sm text-primary hover:text-primary/80 font-medium bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10 transition-colors"
          >
            Limpiar Todo
          </button>
        )}
      </div>

      {/* Primera fila: Búsqueda y Código Postal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Búsqueda por texto */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Buscar
          </label>
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="Nombre, habilidades..."
              value={filters.searchTerm}
              onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Código Postal */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">
            Código Postal
          </label>
          <div className="relative">
            <Icon 
              name="MapPin" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <input
              type="text"
              placeholder="28001"
              value={filters.zipCode}
              onChange={(e) => handleFilterChange('zipCode', e.target.value)}
              maxLength={5}
              className="w-full pl-10 pr-3 py-3 border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Segunda fila: Tipo de Cuidador */}
      <div className="mb-8">
        <SelectableChips
          options={caregiverTypes}
          value={filters.caregiverType ? [filters.caregiverType] : []}
          onChange={(value) => handleFilterChange('caregiverType', value.length > 0 ? value[0] : '')}
          multiple={false}
          label="Tipo de Cuidador"
        />
      </div>

      {/* Tercera fila: Tipo de Ayuda */}
      <div className="mb-8">
        <SelectableChips
          options={helpTypes}
          value={filters.helpType ? [filters.helpType] : []}
          onChange={(value) => handleFilterChange('helpType', value.length > 0 ? value[0] : '')}
          multiple={false}
          label="Tipo de Ayuda"
        />
      </div>

      {/* Cuarta fila: Rango de Edad */}
      <div className="mb-8">
        <RangeSlider
          value={filters.ageRange ? filters.ageRange.split('-').map(Number) : [25, 55]}
          onChange={handleAgeRangeChange}
          label="Rango de Edad"
        />
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
        <div className="text-sm text-text-secondary">
          {hasActiveFilters && (
            <span className="flex items-center space-x-2">
              <Icon name="Filter" size={16} className="text-primary" />
              <span>
                {Object.values(filters).filter(v => v !== '' && v !== null && v !== undefined).length} filtro{Object.values(filters).filter(v => v !== '' && v !== null && v !== undefined).length !== 1 ? 's' : ''} activo{Object.values(filters).filter(v => v !== '' && v !== null && v !== undefined).length !== 1 ? 's' : ''}
              </span>
            </span>
          )}
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={onClear}
            className="px-6 py-3 text-sm font-medium text-text-secondary hover:text-text-primary border border-border rounded-lg hover:bg-muted transition-colors"
          >
            Limpiar Filtros
          </button>
          
          <button
            onClick={onSearch}
            disabled={loading || !hasActiveFilters}
            className="px-8 py-3 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Buscando...</span>
              </>
            ) : (
              <>
                <Icon name="Search" size={16} />
                <span>Buscar Cuidadores</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filtros activos */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="flex flex-wrap gap-2">
            {Object.entries(filters).map(([key, value]) => {
              if (!value || value === '') return null;
              
              let label = '';
              let color = 'bg-primary/10 text-primary border-primary/20';
              
              switch (key) {
                case 'caregiverType':
                  const caregiverType = caregiverTypes.find(t => t.value === value);
                  label = caregiverType?.label || value;
                  if (value === 'Child Care') color = 'bg-blue-50 text-blue-700 border-blue-200';
                  else if (value === 'Senior Care') color = 'bg-purple-50 text-purple-700 border-purple-200';
                  else if (value === 'Adult Care') color = 'bg-green-50 text-green-700 border-green-200';
                  break;
                case 'helpType':
                  const helpType = helpTypes.find(t => t.value === value);
                  label = helpType?.label || value;
                  if (value === 'Household tasks') color = 'bg-orange-50 text-orange-700 border-orange-200';
                  else if (value === 'Personal care') color = 'bg-teal-50 text-teal-700 border-teal-200';
                  else if (value === 'Mobility assistance') color = 'bg-indigo-50 text-indigo-700 border-indigo-200';
                  break;
                case 'ageRange':
                  const [minAge, maxAge] = value.split('-');
                  label = `${minAge}-${maxAge} años`;
                  color = 'bg-pink-50 text-pink-700 border-pink-200';
                  break;
                case 'zipCode':
                  label = `CP: ${value}`;
                  color = 'bg-gray-50 text-gray-700 border-gray-200';
                  break;
                case 'searchTerm':
                  label = `"${value}"`;
                  color = 'bg-yellow-50 text-yellow-700 border-yellow-200';
                  break;
                default:
                  label = value;
              }
              
              return (
                <span
                  key={key}
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${color}`}
                >
                  {label}
                  <button
                    onClick={() => handleFilterChange(key, '')}
                    className="ml-2 hover:opacity-70 rounded-full p-0.5 transition-opacity"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;
