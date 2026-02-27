import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterPanel = ({ onFilterChange, filters, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  return (
    <div className="bg-surface border border-border rounded-lg h-fit">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <h3 className="font-semibold text-text-primary flex items-center">
          <Icon name="Filter" size={18} className="mr-2" />
          Filtros Avanzados
        </h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon 
            name={isExpanded ? "ChevronUp" : "ChevronDown"} 
            size={16} 
          />
        </Button>
      </div>

      {isExpanded && (
        <div className="p-4 space-y-4">
          {/* Search Section */}
          <div className="border border-border rounded-lg">
            <div className="p-3 border-b border-border">
              <span className="font-medium text-text-primary">Búsqueda</span>
            </div>
            <div className="p-3 space-y-3">
              <Input
                label="Nombre"
                type="search"
                placeholder="Buscar por nombre..."
                value={filters.name || ''}
                onChange={(e) => handleFilterChange('name', e.target.value)}
              />
              <Input
                label="Apellido"
                type="search"
                placeholder="Buscar por apellido..."
                value={filters.surname || ''}
                onChange={(e) => handleFilterChange('surname', e.target.value)}
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex flex-col space-y-2 pt-4 border-t border-border">
            <Button
              variant="outline"
              onClick={onClearFilters}
              className="w-full"
            >
              <Icon name="X" size={16} className="mr-2" />
              Limpiar Filtros
            </Button>
            <div className="text-xs text-text-secondary text-center">
              {Object.values(filters).filter(v => v && v !== 'all').length} filtros activos
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;