import React, { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import BottomNavigation from '../../components/ui/BottomNavigation';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import DashboardToolbar from './components/DashboardToolbar';
import CaregiverTable from './components/CaregiverTable';
import CaregiverCards from './components/CaregiverCards';
import PaginationControls from './components/PaginationControls';
import { CaregiverService } from '../../services/caregiverService';
import Icon from '../../components/AppIcon';

const CaregiverManagementDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [selectedIds, setSelectedIds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [sortConfig, setSortConfig] = useState({ key: 'created_at', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [caregivers, setCaregivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCaregivers, setTotalCaregivers] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: '',
    locality: '',
    search: ''
  });

  // Load caregivers from Supabase
  useEffect(() => {
    const loadCaregivers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await CaregiverService.getCaregivers(currentPage, itemsPerPage, {
          ...filters,
          search: searchTerm
        });
        
        setCaregivers(result.caregivers);
        setTotalCaregivers(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error('Error loading caregivers:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCaregivers();
  }, [currentPage, itemsPerPage, filters, searchTerm]);

  // Reset page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleBulkAction = async (action, ids) => {
    try {
      switch (action) {
        case 'selectAll':
          setSelectedIds(caregivers.map(c => c.id));
          break;
        case 'clearSelection':
          setSelectedIds([]);
          break;
        case 'approve':
          for (const id of ids) {
            await CaregiverService.updateCaregiverStatus(id, 'approved');
          }
          // Reload data
          window.location.reload();
          break;
        case 'reject':
          for (const id of ids) {
            await CaregiverService.updateCaregiverStatus(id, 'rejected');
          }
          // Reload data
          window.location.reload();
          break;
        case 'pending':
          for (const id of ids) {
            await CaregiverService.updateCaregiverStatus(id, 'pending');
          }
          // Reload data
          window.location.reload();
          break;
        case 'delete':
          if (window.confirm('¿Está seguro de que desea eliminar los cuidadores seleccionados?')) {
            for (const id of ids) {
              await CaregiverService.deleteCaregiver(id);
            }
            // Reload data
            window.location.reload();
          }
          break;
        default:
          console.log('Unknown bulk action:', action);
      }
      setSelectedIds([]);
    } catch (error) {
      console.error('Error in bulk action:', error);
      alert('Error al ejecutar la acción: ' + error.message);
    }
  };

  const handleExport = (type, format) => {
    console.log('Exporting:', type, format);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const user = {
    name: "Administrador",
    email: "admin@caregiverregistry.com"
  };

  const statusActions = [
    {
      label: 'Actualizar',
      icon: 'RefreshCw',
      onClick: () => window.location.reload()
    },
    {
      label: 'Configurar',
      icon: 'Settings',
      onClick: () => console.log('Configure dashboard')
    }
  ];

  // Transform caregivers data to match component expectations
  const transformedCaregivers = useMemo(() => {
    return caregivers.map(caregiver => ({
      id: caregiver.id,
      name: caregiver.first_name,
      surname: caregiver.last_name,
      email: caregiver.email,
      dni: '', // Not in current schema
      phone: caregiver.phone,
      birthDate: caregiver.birth_date,
      registrationDate: caregiver.created_at,
      status: caregiver.status,
      avatar: `https://randomuser.me/api/portraits/women/${Math.floor(Math.random() * 50) + 1}.jpg`,
      documents: {
        idFront: caregiver.caregiver_documents?.find(d => d.document_type === 'id_front')?.file_name || null,
        idBack: caregiver.caregiver_documents?.find(d => d.document_type === 'id_back')?.file_name || null
      }
    }));
  }, [caregivers]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Cargando cuidadores...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error al cargar datos</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Helmet>
        <title>Panel de Gestión de Cuidadores - CaregiverRegistry</title>
        <meta name="description" content="Gestiona y supervisa todos los cuidadores registrados en el sistema CaregiverRegistry" />
      </Helmet>

      <Header 
        user={user}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={() => console.log('Logout')}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <BottomNavigation />

      <main className="lg:ml-72 pt-16 px-4 lg:px-6">
        <div className="max-w-full">
          <div className="hidden lg:block">
            <Breadcrumb />
          </div>
          
          <StatusIndicatorBar
            status="active"
            title="Sistema de Gestión Activo"
            subtitle={`${totalCaregivers} cuidadores registrados • ${transformedCaregivers.length} mostrados`}
            actions={statusActions}
            className="mb-4 lg:mb-6"
          />

          {/* Banner de bienvenida con enlaces útiles */}
          <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h3 className="text-lg font-semibold text-primary mb-2">
                  ¡Bienvenido al Sistema de Gestión de Cuidadores!
                </h3>
                <p className="text-text-secondary">
                  Gestiona cuidadores, verifica documentos y mantén el control total del sistema.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/public-caregiver-search"
                  className="inline-flex items-center justify-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200"
                >
                  <Icon name="Search" size={16} className="mr-2" />
                  Buscar Cuidadores
                </a>
                <a
                  href="/caregiver-registration-form"
                  className="inline-flex items-center justify-center px-4 py-2 bg-white text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
                >
                  <Icon name="UserPlus" size={16} className="mr-2" />
                  Registrar Cuidador
                </a>
              </div>
            </div>
          </div>

          <DashboardToolbar
            selectedIds={selectedIds}
            totalCount={totalCaregivers}
            filteredCount={transformedCaregivers.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onBulkAction={handleBulkAction}
            onExport={handleExport}
            onFilterChange={handleFilterChange}
            filters={filters}
          />

          {/* Data Display */}
          <div className="w-full overflow-x-auto">
            {viewMode === 'table' ? (
              <CaregiverTable
                caregivers={transformedCaregivers}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onSort={handleSort}
                sortConfig={sortConfig}
                onBulkAction={handleBulkAction}
              />
            ) : (
              <CaregiverCards
                caregivers={transformedCaregivers}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
                onBulkAction={handleBulkAction}
              />
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalCaregivers}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CaregiverManagementDashboard;