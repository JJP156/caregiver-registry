import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import VerificationToolbar from './components/VerificationToolbar';
import VerificationQueue from './components/VerificationQueue';
import DocumentViewer from './components/DocumentViewer';
import VerificationControls from './components/VerificationControls';
import { DocumentVerificationService } from '../../services/documentVerificationService';
import { useSupabase } from '../../hooks/useSupabase';

const DocumentVerificationQueuePage = () => {
  const { user } = useSupabase();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalDocuments, setTotalDocuments] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    status: 'pending',
    document_type: '',
    search: ''
  });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    valid: 0,
    invalid: 0,
    requires_resubmission: 0
  });

  // Load documents from Supabase
  useEffect(() => {
    const loadDocuments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await DocumentVerificationService.getPendingDocuments(currentPage, 10, filters);
        setDocuments(result.documents);
        setTotalDocuments(result.total);
        setTotalPages(result.totalPages);
      } catch (err) {
        console.error('Error loading documents:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const loadStats = async () => {
      try {
        const statsData = await DocumentVerificationService.getVerificationStats();
        setStats(statsData);
      } catch (err) {
        console.error('Error loading stats:', err);
      }
    };

    loadDocuments();
    loadStats();
  }, [currentPage, filters]);

  // Transform documents data to match component expectations
  const transformedDocuments = documents.map(doc => ({
    id: doc.id,
    caregiverName: `${doc.caregivers?.first_name || ''} ${doc.caregivers?.last_name || ''}`.trim(),
    dniNumber: '', // Not in current schema
    submissionDate: doc.uploaded_at,
    status: doc.status,
    priority: doc.status === 'pending' ? 'high' : 'medium',
    flagged: doc.status === 'invalid',
    documents: [
      {
        type: getDocumentTypeLabel(doc.document_type),
        url: doc.file_path,
        quality: 'good',
        size: formatFileSize(doc.file_size),
        format: doc.mime_type.split('/')[1]?.toUpperCase() || 'JPEG',
        resolution: '1920x1080'
      }
    ],
    caregiver: doc.caregivers,
    validationNotes: doc.validation_notes
  }));

  const handleDocumentSelect = async (document) => {
    try {
      const fullDocument = await DocumentVerificationService.getDocumentById(document.id);
      setSelectedDocument({
        ...document,
        caregiver: fullDocument.caregivers,
        validationNotes: fullDocument.validation_notes
      });
    } catch (error) {
      console.error('Error loading document details:', error);
      setSelectedDocument(document);
    }
  };

  const handleApprove = async (approvalData) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      await DocumentVerificationService.approveDocument(
        selectedDocument.id,
        user.id,
        approvalData.notes
      );

      // Reload documents
      window.location.reload();
    } catch (error) {
      console.error('Error approving document:', error);
      alert('Error al aprobar documento: ' + error.message);
    }
  };

  const handleReject = async (rejectionData) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      await DocumentVerificationService.rejectDocument(
        selectedDocument.id,
        user.id,
        rejectionData.notes
      );

      // Reload documents
      window.location.reload();
    } catch (error) {
      console.error('Error rejecting document:', error);
      alert('Error al rechazar documento: ' + error.message);
    }
  };

  const handleSaveNotes = async (notes) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      await DocumentVerificationService.updateValidationNotes(selectedDocument.id, notes);
      setSelectedDocument(prev => ({ ...prev, validationNotes: notes }));
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Error al guardar notas: ' + error.message);
    }
  };

  const handleBatchAction = async (batchData) => {
    try {
      if (!user?.id) {
        throw new Error('Usuario no autenticado');
      }

      await DocumentVerificationService.batchAction(
        selectedDocuments,
        batchData.action,
        user.id,
        batchData.notes
      );

      setSelectedDocuments([]);
      // Reload documents
      window.location.reload();
    } catch (error) {
      console.error('Error in batch action:', error);
      alert('Error en acción masiva: ' + error.message);
    }
  };

  const handleExport = (format) => {
    console.log('Exporting documents in format:', format);
    // TODO: Implement export functionality
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  };

  const handleLogout = () => {
    console.log('Logout');
  };

  // Helper functions
  const getDocumentTypeLabel = (type) => {
    const labels = {
      'id_front': 'DNI Frontal',
      'id_back': 'DNI Trasero',
      'criminal_record': 'Antecedentes Penales'
    };
    return labels[type] || type;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Cargando documentos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">Error al cargar documentos</h2>
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

  const userInfo = {
    name: user?.user_metadata?.full_name || 'Validador',
    email: user?.email || 'validator@example.com'
  };

  const statusActions = [
    {
      label: 'Actualizar',
      icon: 'RefreshCw',
      onClick: handleRefresh
    },
    {
      label: 'Configurar',
      icon: 'Settings',
      onClick: () => console.log('Configure verification')
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <Helmet>
        <title>Cola de Verificación de Documentos - CaregiverRegistry</title>
        <meta name="description" content="Verifica y valida documentos de cuidadores en el sistema CaregiverRegistry" />
      </Helmet>

      <Header 
        user={userInfo}
        onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
        onLogout={handleLogout}
      />
      
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className="lg:ml-72 pt-16 px-4 lg:px-6">
        <div className="max-w-full">
          <div className="hidden lg:block">
            <Breadcrumb />
          </div>
          
          <StatusIndicatorBar
            status="active"
            title="Sistema de Verificación Activo"
            subtitle={`${stats.pending} documentos pendientes • ${totalDocuments} total en cola`}
            actions={statusActions}
            className="mb-4 lg:mb-6"
          />

          <VerificationToolbar
            selectedDocuments={selectedDocuments}
            totalCount={totalDocuments}
            onFilterChange={handleFilterChange}
            filters={filters}
            stats={stats}
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Document Queue */}
            <div className="lg:col-span-2">
              <VerificationQueue
                documents={transformedDocuments}
                selectedDocuments={selectedDocuments}
                onDocumentSelect={handleDocumentSelect}
                onSelectionChange={setSelectedDocuments}
                onBatchAction={handleBatchAction}
                loading={loading}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Document Viewer */}
            <div className="lg:col-span-1">
              {selectedDocument ? (
                <DocumentViewer
                  document={selectedDocument}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onSaveNotes={handleSaveNotes}
                  onClose={() => setSelectedDocument(null)}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border p-6 text-center text-gray-500">
                  <div className="text-4xl mb-2">📄</div>
                  <p>Selecciona un documento para verificar</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentVerificationQueuePage;