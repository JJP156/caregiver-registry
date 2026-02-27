import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import CaregiverSearchCard from './components/CaregiverSearchCard';
import SearchFilters from './components/SearchFilters';
import Icon from '../../components/AppIcon';

const PublicCaregiverSearch = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    caregiverType: '',
    helpType: '',
    ageRange: '',
    zipCode: '',
    searchTerm: ''
  });

  // Mock data de cuidadores
  const mockCaregivers = [
    {
      id: 1,
      name: "María Elena Rodríguez",
      age: 35,
      nationality: "Española",
      location: "Madrid, 28001",
      experience: "8 años",
      caregiverType: "Child Care",
      helpTypes: ["Household tasks", "Personal care"],
      photo: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=400&fit=crop",
      description: "Cuidadora experimentada y cariñosa especializada en el cuidado de niños. Me encanta crear un ambiente seguro y divertido para los pequeños.",
      skills: [
        "Primeros auxilios",
        "Alimentación saludable",
        "Actividades educativas",
        "Higiene personal",
        "Organización del hogar"
      ],
      rating: 4.8,
      hourlyRate: "€15-20"
    },
    {
      id: 2,
      name: "Carmen Beatriz López",
      age: 42,
      nationality: "Española",
      location: "Barcelona, 08001",
      experience: "12 años",
      caregiverType: "Senior Care",
      helpTypes: ["Personal care", "Mobility assistance"],
      photo: "https://images.unsplash.com/photo-1554224154-22dec7ec8818?w=400&h=400&fit=crop",
      description: "Especialista en cuidado de adultos mayores con amplia experiencia en asistencia personal y movilidad. Paciente y comprensiva.",
      skills: [
        "Cuidado de personas mayores",
        "Asistencia de movilidad",
        "Medicación",
        "Compañía",
        "Higiene personal"
      ],
      rating: 4.9,
      hourlyRate: "€18-25"
    },
    {
      id: 3,
      name: "Ana Isabel Fernández",
      age: 28,
      nationality: "Colombiana",
      location: "Valencia, 46001",
      experience: "5 años",
      caregiverType: "Adult Care",
      helpTypes: ["Household tasks", "Personal care"],
      photo: "https://images.unsplash.com/photo-1554224155-ffd603bd01ec?w=400&h=400&fit=crop",
      description: "Joven cuidadora dinámica y responsable. Especializada en tareas del hogar y cuidado personal de adultos.",
      skills: [
        "Limpieza del hogar",
        "Cocina básica",
        "Lavado y planchado",
        "Compañía",
        "Organización"
      ],
      rating: 4.7,
      hourlyRate: "€12-18"
    },
    {
      id: 4,
      name: "Isabel Moreno Jiménez",
      age: 38,
      nationality: "Española",
      location: "Sevilla, 41001",
      experience: "10 años",
      caregiverType: "Child Care",
      helpTypes: ["Household tasks", "Personal care"],
      photo: "https://images.unsplash.com/photo-1554224155-0c74292c4b56?w=400&h=400&fit=crop",
      description: "Madre de dos hijos con amplia experiencia en cuidado infantil. Me encanta enseñar y cuidar de los niños.",
      skills: [
        "Cuidado infantil",
        "Juegos educativos",
        "Alimentación",
        "Rutinas diarias",
        "Comunicación con padres"
      ],
      rating: 4.6,
      hourlyRate: "€16-22"
    },
    {
      id: 5,
      name: "Rosa González Pérez",
      age: 45,
      nationality: "Peruana",
      location: "Madrid, 28002",
      experience: "15 años",
      caregiverType: "Senior Care",
      helpTypes: ["Personal care", "Mobility assistance", "Household tasks"],
      photo: "https://images.unsplash.com/photo-1554224154-1696413565d3?w=400&h=400&fit=crop",
      description: "Cuidadora senior con amplia experiencia en todos los aspectos del cuidado. Paciente, dedicada y muy profesional.",
      skills: [
        "Cuidado geriátrico",
        "Asistencia médica básica",
        "Tareas del hogar",
        "Compañía emocional",
        "Coordinación con familiares"
      ],
      rating: 5.0,
      hourlyRate: "€20-28"
    },
    {
      id: 6,
      name: "Teresa López García",
      age: 32,
      nationality: "Española",
      location: "Bilbao, 48001",
      experience: "7 años",
      caregiverType: "Adult Care",
      helpTypes: ["Household tasks", "Personal care"],
      photo: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400&h=400&fit=crop",
      description: "Cuidadora joven y enérgica especializada en tareas domésticas y cuidado personal. Muy organizada y eficiente.",
      skills: [
        "Limpieza profunda",
        "Organización del hogar",
        "Cocina saludable",
        "Lavado y planchado",
        "Mantenimiento básico"
      ],
      rating: 4.8,
      hourlyRate: "€14-20"
    }
  ];

  // Filtrar cuidadores basado en los filtros aplicados
  const filteredCaregivers = useMemo(() => {
    let filtered = [...mockCaregivers];

    // Filtro por tipo de cuidador
    if (filters.caregiverType) {
      filtered = filtered.filter(caregiver => 
        caregiver.caregiverType === filters.caregiverType
      );
    }

    // Filtro por tipo de ayuda
    if (filters.helpType) {
      filtered = filtered.filter(caregiver => 
        caregiver.helpTypes.includes(filters.helpType)
      );
    }

    // Filtro por rango de edad
    if (filters.ageRange) {
      const [minAge, maxAge] = filters.ageRange.split('-').map(Number);
      if (!isNaN(minAge) && !isNaN(maxAge)) {
        filtered = filtered.filter(caregiver => 
          caregiver.age >= minAge && caregiver.age <= maxAge
        );
      }
    }

    // Filtro por código postal (simulado)
    if (filters.zipCode) {
      filtered = filtered.filter(caregiver => 
        caregiver.location.includes(filters.zipCode.substring(0, 2))
      );
    }

    // Filtro por término de búsqueda
    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(caregiver => 
        caregiver.name.toLowerCase().includes(searchLower) ||
        caregiver.description.toLowerCase().includes(searchLower) ||
        caregiver.skills.some(skill => skill.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [filters]);

  // Simular búsqueda
  const handleSearch = async () => {
    setLoading(true);
    
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSearchResults(filteredCaregivers);
    setLoading(false);
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      caregiverType: '',
      helpType: '',
      ageRange: '',
      zipCode: '',
      searchTerm: ''
    });
    setSearchResults([]);
  };

  // Actualizar filtros
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Búsqueda automática cuando cambian los filtros
  useEffect(() => {
    if (Object.values(filters).some(value => value !== '')) {
      handleSearch();
    } else {
      setSearchResults([]);
    }
  }, [filters]);

  const user = {
    name: 'Visitante',
    email: 'guest@caregiverregistry.com'
  };

  const breadcrumbItems = [
    { label: 'Inicio', path: '/' },
    { label: 'Buscar Cuidadores', path: '/public-caregiver-search', isCurrent: true }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Buscar Cuidadores - CaregiverRegistry</title>
        <meta name="description" content="Encuentra cuidadores profesionales para niños, adultos mayores y adultos en tu área" />
      </Helmet>

      <Header 
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        onLogout={() => console.log('Logout')}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="transition-all duration-300 pt-16 pb-24 lg:ml-72">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Breadcrumb customItems={breadcrumbItems} />

          {/* Header de la página */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              Encuentra el Cuidador Perfecto
            </h1>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              Conectamos familias con cuidadores profesionales, certificados y con experiencia. 
              Encuentra la ayuda que necesitas en tu área.
            </p>
          </div>

          {/* Filtros de búsqueda */}
          <SearchFilters
            filters={filters}
            onFilterChange={updateFilters}
            onSearch={handleSearch}
            onClear={clearFilters}
            loading={loading}
          />

          {/* Resultados de búsqueda */}
          <div className="mt-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <span className="ml-3 text-lg text-text-secondary">Buscando cuidadores...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-text-primary">
                    {searchResults.length} Cuidador{searchResults.length !== 1 ? 'es' : ''} Encontrado{searchResults.length !== 1 ? 's' : ''}
                  </h2>
                  <button
                    onClick={clearFilters}
                    className="text-primary hover:text-primary/80 text-sm font-medium"
                  >
                    Limpiar Filtros
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map(caregiver => (
                    <CaregiverSearchCard
                      key={caregiver.id}
                      caregiver={caregiver}
                    />
                  ))}
                </div>
              </>
            ) : Object.values(filters).some(value => value !== '') ? (
              <div className="text-center py-12">
                <Icon name="Search" size={64} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  No se encontraron resultados
                </h3>
                <p className="text-text-secondary mb-4">
                  Intenta ajustar los filtros de búsqueda
                </p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90"
                >
                  Limpiar Filtros
                </button>
              </div>
            ) : (
              <div className="text-center py-12">
                <Icon name="Users" size={64} className="text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-medium text-text-primary mb-2">
                  Comienza tu búsqueda
                </h3>
                <p className="text-text-secondary">
                  Usa los filtros arriba para encontrar cuidadores en tu área
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublicCaregiverSearch;
