import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Sidebar from '../../components/ui/Sidebar';
import Breadcrumb from '../../components/ui/Breadcrumb';
import StatusIndicatorBar from '../../components/ui/StatusIndicatorBar';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoSection from './components/PersonalInfoSection';
import DocumentViewer from './components/DocumentViewer';
import ActivityTimeline from './components/ActivityTimeline';
import CommentsSection from './components/CommentsSection';

const CaregiverProfileDetailView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [caregiver, setCaregiver] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock caregiver data
  const mockCaregiver = {
    id: "CG-2024-001",
    firstName: "María Carmen",
    lastName: "González Rodríguez",
    dateOfBirth: "15/03/1985",
    dni: "12345678A",
    phone: "+34 666 123 456",
    email: "maria.gonzalez@email.com",
    address: "Calle Mayor 123, 28001 Madrid",
    experience: 8,
    specialization: "Cuidado de Personas Mayores",
    certifications: ["Primeros Auxilios", "Cuidados Geriátricos", "RCP Básica"],
    languages: ["Español", "Inglés Básico"],
    status: "active",
    registrationDate: "12/01/2024",
    documentsStatus: "approved",
    documents: {
      front: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
      back: "https://images.unsplash.com/photo-1554224154-26032fced8bd?w=400&h=250&fit=crop",
      status: "approved",
      uploadDate: "12/01/2024 14:30",
      fileSize: "2.4 MB"
    }
  };

  const mockActivities = [
    {
      type: "registration",
      title: "Registro Completado",
      description: "El cuidador completó el proceso de registro inicial",
      timestamp: "2024-01-12T14:30:00Z",
      user: "Sistema"
    },
    {
      type: "document_upload",
      title: "Documentos Subidos",
      description: "DNI frontal y reverso subidos correctamente",
      timestamp: "2024-01-12T14:35:00Z",
      user: "María Carmen González",
      attachments: ["dni-frontal.jpg", "dni-reverso.jpg"]
    },
    {
      type: "verification",
      title: "Verificación Iniciada",
      description: "Proceso de verificación de documentos iniciado",
      timestamp: "2024-01-13T09:15:00Z",
      user: "Admin Verificación"
    },
    {
      type: "approval",
      title: "Documentos Aprobados",
      description: "Todos los documentos han sido verificados y aprobados",
      details: "Documentos verificados manualmente. Información coincide con base de datos oficial.",
      timestamp: "2024-01-13T11:20:00Z",
      user: "Ana Martínez"
    },
    {
      type: "note",
      title: "Nota Administrativa",
      description: "Cuidador con excelente experiencia previa",
      details: "Referencias verificadas positivamente. Recomendado para casos complejos.",
      timestamp: "2024-01-14T16:45:00Z",
      user: "Carlos Ruiz"
    }
  ];

  const mockComments = [
    {
      id: 1,
      author: "Ana Martínez",
      content: "Documentos verificados correctamente. La información coincide con los registros oficiales.",
      timestamp: "2024-01-13T11:25:00Z",
      userId: 1,
      isPrivate: false
    },
    {
      id: 2,
      author: "Carlos Ruiz",
      content: "Excelente perfil profesional. Referencias muy positivas de empleadores anteriores.",
      timestamp: "2024-01-14T16:50:00Z",
      userId: 2,
      isPrivate: true
    },
    {
      id: 3,
      author: "Laura Fernández",
      content: "Certificaciones actualizadas y válidas. Recomiendo para asignaciones prioritarias.",
      timestamp: "2024-01-15T10:30:00Z",
      userId: 3,
      isPrivate: false
    }
  ];

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setCaregiver(mockCaregiver);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setCaregiver(prev => ({ ...prev, status: newStatus }));
    // Here you would typically make an API call
    console.log('Status changed to:', newStatus);
  };

  const handleEdit = () => {
    navigate('/caregiver-registration-form', { state: { editMode: true, caregiver } });
  };

  const handleGenerateReport = () => {
    console.log('Generating report for caregiver:', caregiver.id);
    // Here you would typically generate and download a report
  };

  const handleDocumentApprove = (documentType) => {
    console.log('Approving document:', documentType);
    // Here you would typically make an API call to approve the document
  };

  const handleDocumentReject = (documentType) => {
    console.log('Rejecting document:', documentType);
    // Here you would typically make an API call to reject the document
  };

  const handleAddComment = async (comment) => {
    console.log('Adding comment:', comment);
    // Here you would typically make an API call to add the comment
    return Promise.resolve();
  };

  const handleLogout = () => {
    navigate('/authentication-login');
  };

  const breadcrumbItems = [
    { label: 'Inicio', path: '/caregiver-management-dashboard', isHome: true },
    { label: 'Cuidadores', path: '/caregiver-management-dashboard' },
    { label: caregiver ? `${caregiver.firstName} ${caregiver.lastName}` : 'Cargando...', isCurrent: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-72 pt-16">
          <div className="p-6">
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-text-secondary">Cargando perfil del cuidador...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!caregiver) {
    return (
      <div className="min-h-screen bg-background">
        <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="lg:ml-72 pt-16">
          <div className="p-6">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-text-primary mb-4">Cuidador no encontrado</h2>
              <p className="text-text-secondary mb-6">El perfil solicitado no existe o ha sido eliminado.</p>
              <button
                onClick={() => navigate('/caregiver-management-dashboard')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Volver al Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} onLogout={handleLogout} />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="lg:ml-72 pt-16">
        <ProfileHeader
          caregiver={caregiver}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          onGenerateReport={handleGenerateReport}
        />

        <div className="p-6">
          <Breadcrumb customItems={breadcrumbItems} />

          <StatusIndicatorBar
            status="verification"
            title="Perfil Verificado"
            subtitle="Todos los documentos han sido aprobados y el perfil está activo"
            className="mb-6"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Personal Information */}
            <div className="lg:col-span-8 space-y-6">
              <PersonalInfoSection caregiver={caregiver} />
              <ActivityTimeline activities={mockActivities} />
              <CommentsSection 
                comments={mockComments} 
                onAddComment={handleAddComment} 
              />
            </div>

            {/* Right Column - Documents */}
            <div className="lg:col-span-4">
              <div className="sticky top-96">
                <DocumentViewer
                  documents={caregiver.documents}
                  onApprove={handleDocumentApprove}
                  onReject={handleDocumentReject}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaregiverProfileDetailView;