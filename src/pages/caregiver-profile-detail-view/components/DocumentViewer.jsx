import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentViewer = ({ documents, onApprove, onReject }) => {
  const [activeTab, setActiveTab] = useState('front');
  const [isZoomed, setIsZoomed] = useState(false);

  const tabs = [
    { id: 'front', label: 'DNI Frontal', icon: 'CreditCard' },
    { id: 'back', label: 'DNI Reverso', icon: 'RotateCcw' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'text-success bg-success/10 border-success/20';
      case 'rejected': return 'text-error bg-error/10 border-error/20';
      case 'pending': return 'text-warning bg-warning/10 border-warning/20';
      default: return 'text-text-secondary bg-muted border-border';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved': return 'CheckCircle';
      case 'rejected': return 'XCircle';
      case 'pending': return 'Clock';
      default: return 'FileText';
    }
  };

  const handleDownload = (imageUrl, filename) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary flex items-center">
            <Icon name="FileImage" size={20} className="mr-2 text-primary" />
            Documentos DNI
          </h3>
          <div className={`px-3 py-1.5 rounded-full border text-sm font-medium ${getStatusColor(documents.status)}`}>
            <Icon name={getStatusIcon(documents.status)} size={14} className="mr-1.5" />
            {documents.status === 'approved' ? 'Aprobado' : 
             documents.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-surface text-text-primary shadow-soft'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Display */}
      <div className="p-4">
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '1.6/1' }}>
          <Image
            src={documents[activeTab]}
            alt={`DNI ${activeTab === 'front' ? 'Frontal' : 'Reverso'}`}
            className={`w-full h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
          
          {/* Zoom Controls */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setIsZoomed(!isZoomed)}
              className="w-8 h-8 bg-surface/90 backdrop-blur-sm"
            >
              <Icon name={isZoomed ? "ZoomOut" : "ZoomIn"} size={14} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => handleDownload(documents[activeTab], `dni-${activeTab}.jpg`)}
              className="w-8 h-8 bg-surface/90 backdrop-blur-sm"
            >
              <Icon name="Download" size={14} />
            </Button>
          </div>
        </div>

        {/* Document Info */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-text-secondary">Subido:</span>
              <p className="text-text-primary font-medium">{documents.uploadDate}</p>
            </div>
            <div>
              <span className="text-text-secondary">Tamaño:</span>
              <p className="text-text-primary font-medium">{documents.fileSize}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {documents.status === 'pending' && (
          <div className="flex space-x-2 mt-4">
            <Button
              variant="success"
              size="sm"
              onClick={() => onApprove(activeTab)}
              className="flex-1"
            >
              <Icon name="Check" size={16} className="mr-2" />
              Aprobar
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onReject(activeTab)}
              className="flex-1"
            >
              <Icon name="X" size={16} className="mr-2" />
              Rechazar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentViewer;