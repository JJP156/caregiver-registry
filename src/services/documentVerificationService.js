import { supabase } from './supabase'

export class DocumentVerificationService {
  // Obtener documentos pendientes de verificación
  static async getPendingDocuments(page = 1, limit = 10, filters = {}) {
    try {
      let query = supabase
        .from('caregiver_documents')
        .select(`
          *,
          caregivers (
            id,
            first_name,
            last_name,
            email,
            phone,
            status,
            created_at
          )
        `)
        .order('uploaded_at', { ascending: true })

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status)
      } else {
        // Por defecto, mostrar solo documentos pendientes
        query = query.eq('status', 'pending')
      }

      if (filters.document_type) {
        query = query.eq('document_type', filters.document_type)
      }

      if (filters.search) {
        query = query.or(`caregivers.first_name.ilike.%${filters.search}%,caregivers.last_name.ilike.%${filters.search}%,caregivers.email.ilike.%${filters.search}%`)
      }

      // Aplicar paginación
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Error fetching documents: ${error.message}`)
      }

      return {
        documents: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error in getPendingDocuments:', error)
      throw error
    }
  }

  // Obtener un documento específico con información del cuidador
  static async getDocumentById(documentId) {
    try {
      const { data, error } = await supabase
        .from('caregiver_documents')
        .select(`
          *,
          caregivers (
            id,
            first_name,
            last_name,
            email,
            phone,
            birth_date,
            locality,
            status,
            created_at
          )
        `)
        .eq('id', documentId)
        .single()

      if (error) {
        throw new Error(`Error fetching document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in getDocumentById:', error)
      throw error
    }
  }

  // Obtener todos los documentos de un cuidador
  static async getCaregiverDocuments(caregiverId) {
    try {
      const { data, error } = await supabase
        .from('caregiver_documents')
        .select('*')
        .eq('caregiver_id', caregiverId)
        .order('uploaded_at', { ascending: false })

      if (error) {
        throw new Error(`Error fetching caregiver documents: ${error.message}`)
      }

      return data || []
    } catch (error) {
      console.error('Error in getCaregiverDocuments:', error)
      throw error
    }
  }

  // Aprobar un documento
  static async approveDocument(documentId, validatorId, notes = null) {
    try {
      const updates = {
        status: 'valid',
        validation_notes: notes,
        validated_by: validatorId,
        validated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error approving document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in approveDocument:', error)
      throw error
    }
  }

  // Rechazar un documento
  static async rejectDocument(documentId, validatorId, notes = null) {
    try {
      const updates = {
        status: 'invalid',
        validation_notes: notes,
        validated_by: validatorId,
        validated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error rejecting document: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in rejectDocument:', error)
      throw error
    }
  }

  // Solicitar resubmisión de documento
  static async requestResubmission(documentId, validatorId, notes = null) {
    try {
      const updates = {
        status: 'requires_resubmission',
        validation_notes: notes,
        validated_by: validatorId,
        validated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error requesting resubmission: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in requestResubmission:', error)
      throw error
    }
  }

  // Actualizar notas de validación
  static async updateValidationNotes(documentId, notes) {
    try {
      const { data, error } = await supabase
        .from('caregiver_documents')
        .update({ validation_notes: notes })
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating validation notes: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateValidationNotes:', error)
      throw error
    }
  }

  // Acción masiva en documentos
  static async batchAction(documentIds, action, validatorId, notes = null) {
    try {
      const updates = {
        validated_by: validatorId,
        validated_at: new Date().toISOString()
      }

      switch (action) {
        case 'approve':
          updates.status = 'valid'
          break
        case 'reject':
          updates.status = 'invalid'
          break
        case 'resubmit':
          updates.status = 'requires_resubmission'
          break
        default:
          throw new Error('Invalid action')
      }

      if (notes) {
        updates.validation_notes = notes
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .in('id', documentIds)
        .select()

      if (error) {
        throw new Error(`Error in batch action: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in batchAction:', error)
      throw error
    }
  }

  // Obtener estadísticas de verificación
  static async getVerificationStats() {
    try {
      const { data, error } = await supabase
        .from('caregiver_documents')
        .select('status')

      if (error) {
        throw new Error(`Error fetching verification stats: ${error.message}`)
      }

      const stats = {
        total: data.length,
        pending: data.filter(d => d.status === 'pending').length,
        valid: data.filter(d => d.status === 'valid').length,
        invalid: data.filter(d => d.status === 'invalid').length,
        requires_resubmission: data.filter(d => d.status === 'requires_resubmission').length
      }

      return stats
    } catch (error) {
      console.error('Error in getVerificationStats:', error)
      throw error
    }
  }

  // Obtener URL de descarga de documento
  static async getDocumentDownloadUrl(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('caregiver-documents')
        .createSignedUrl(filePath, 3600) // URL válida por 1 hora

      if (error) {
        throw new Error(`Error creating download URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      console.error('Error in getDocumentDownloadUrl:', error)
      throw error
    }
  }

  // Obtener URL de vista previa de documento
  static async getDocumentPreviewUrl(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from('caregiver-documents')
        .createSignedUrl(filePath, 3600, {
          transform: {
            width: 800,
            height: 600,
            resize: 'contain'
          }
        })

      if (error) {
        throw new Error(`Error creating preview URL: ${error.message}`)
      }

      return data.signedUrl
    } catch (error) {
      console.error('Error in getDocumentPreviewUrl:', error)
      throw error
    }
  }

  // Marcar documento como revisado (sin cambiar estado)
  static async markAsReviewed(documentId, validatorId, notes = null) {
    try {
      const updates = {
        reviewed_by: validatorId,
        reviewed_at: new Date().toISOString()
      }

      if (notes) {
        updates.validation_notes = notes
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error marking document as reviewed: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in markAsReviewed:', error)
      throw error
    }
  }
} 