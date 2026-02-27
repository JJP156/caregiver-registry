import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Input from './Input';
import Button from './Button';
import Select from './Select';

const SearchHeader = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "Buscar cuidadores...",
  filters = [],
  showAdvancedFilters = false,
  onToggleAdvancedFilters,
  searchValue = "",
  className = ""
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvancedFilters);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch?.(localSearchValue);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localSearchValue, onSearch]);

  const handleToggleAdvanced = () => {
    const newState = !isAdvancedOpen;
    setIsAdvancedOpen(newState);
    onToggleAdvancedFilters?.(newState);
  };

  const handleClearSearch = () => {
    setLocalSearchValue('');
    onSearch?.('');
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'verified', label: 'Verificado' }
  ];

  const experienceOptions = [
    { value: 'all', label: 'Toda la experiencia' },
    { value: '0-1', label: '0-1 años' },
    { value: '1-3', label: '1-3 años' },
    { value: '3-5', label: '3-5 años' },
    { value: '5+', label: '5+ años' }
  ];

  const locationOptions = [
    { value: 'all', label: 'Todas las ubicaciones' },
    { value: 'madrid', label: 'Madrid' },
    { value: 'barcelona', label: 'Barcelona' },
    { value: 'valencia', label: 'Valencia' },
    { value: 'sevilla', label: 'Sevilla' }
  ];

  return (
    <div className={`bg-surface border border-border rounded-lg p-4 mb-6 ${className}`}>
      {/* Main Search Row */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <div className="relative">
            <Icon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
            />
            <Input
              type="search"
              placeholder={placeholder}
              value={localSearchValue}
              onChange={(e) => setLocalSearchValue(e.target.value)}
              className="pl-10 pr-10"
            />
            {localSearchValue && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
              >
                <Icon name="X" size={16} />
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleToggleAdvanced}
          className="flex items-center space-x-2"
        >
          <Icon name="Filter" size={16} />
          <span className="hidden sm:inline">Filtros</span>
          <Icon 
            name="ChevronDown" 
            size={16} 
            className={`transition-transform duration-200 ${isAdvancedOpen ? 'rotate-180' : ''}`}
          />
        </Button>

        <Button variant="ghost" size="icon" className="text-text-secondary">
          <Icon name="MoreVertical" size={20} />
        </Button>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              label="Estado"
              options={statusOptions}
              value="all"
              onChange={(value) => onFilterChange?.('status', value)}
              className="w-full"
            />
            
            <Select
              label="Experiencia"
              options={experienceOptions}
              value="all"
              onChange={(value) => onFilterChange?.('experience', value)}
              className="w-full"
            />
            
            <Select
              label="Ubicación"
              options={locationOptions}
              value="all"
              onChange={(value) => onFilterChange?.('location', value)}
              className="w-full"
            />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2 text-sm text-text-secondary">
              <Icon name="Info" size={16} />
              <span>Usa filtros para refinar los resultados de búsqueda</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  // Reset all filters
                  onFilterChange?.('reset');
                }}
              >
                Limpiar Filtros
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Export search results
                }}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchHeader;