import { supabase } from './supabase'

export class CaregiverService {
  // Obtener todos los cuidadores con paginación
  static async getCaregivers(page = 1, limit = 10, filters = {}) {
    try {
      let query = supabase
        .from('caregivers')
        .select(`
          *,
          caregiver_documents (
            id,
            document_type,
            file_name,
            status,
            uploaded_at
          )
        `)
        .order('created_at', { ascending: false })

      // Aplicar filtros
      if (filters.status) {
        query = query.eq('status', filters.status)
      }
      if (filters.locality) {
        query = query.eq('locality', filters.locality)
      }
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
      }

      // Aplicar paginación
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) {
        throw new Error(`Error fetching caregivers: ${error.message}`)
      }

      return {
        caregivers: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      }
    } catch (error) {
      console.error('Error in getCaregivers:', error)
      throw error
    }
  }

  // Obtener un cuidador por ID
  static async getCaregiverById(id) {
    try {
      const { data, error } = await supabase
        .from('caregivers')
        .select(`
          *,
          caregiver_documents (
            id,
            document_type,
            file_name,
            file_path,
            file_size,
            mime_type,
            status,
            validation_notes,
            uploaded_at,
            validated_at
          )
        `)
        .eq('id', id)
        .single()

      if (error) {
        throw new Error(`Error fetching caregiver: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in getCaregiverById:', error)
      throw error
    }
  }

  // Crear un nuevo cuidador
  static async createCaregiver(caregiverData) {
    try {
      const { data, error } = await supabase
        .from('caregivers')
        .insert([caregiverData])
        .select()
        .single()

      if (error) {
        throw new Error(`Error creating caregiver: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in createCaregiver:', error)
      throw error
    }
  }

  // Actualizar un cuidador
  static async updateCaregiver(id, updates) {
    try {
      const { data, error } = await supabase
        .from('caregivers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating caregiver: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateCaregiver:', error)
      throw error
    }
  }

  // Cambiar el estado de un cuidador
  static async updateCaregiverStatus(id, status, notes = null, reviewedBy = null) {
    try {
      const updates = {
        status,
        notes,
        reviewed_by: reviewedBy,
        reviewed_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('caregivers')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating caregiver status: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateCaregiverStatus:', error)
      throw error
    }
  }

  // Eliminar un cuidador
  static async deleteCaregiver(id) {
    try {
      const { error } = await supabase
        .from('caregivers')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(`Error deleting caregiver: ${error.message}`)
      }

      return { success: true }
    } catch (error) {
      console.error('Error in deleteCaregiver:', error)
      throw error
    }
  }

  // Subir documento de cuidador
  static async uploadDocument(caregiverId, documentType, file) {
    try {
      // 1. Subir archivo a storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${documentType}_${Date.now()}.${fileExt}`
      const filePath = `caregiver-documents/${caregiverId}/${fileName}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('caregiver-documents')
        .upload(filePath, file)

      if (uploadError) {
        throw new Error(`Error uploading file: ${uploadError.message}`)
      }

      // 2. Crear registro en la base de datos
      const documentData = {
        caregiver_id: caregiverId,
        document_type: documentType,
        file_name: file.name,
        file_path: filePath,
        file_size: file.size,
        mime_type: file.type,
        status: 'pending'
      }

      const { data: docData, error: docError } = await supabase
        .from('caregiver_documents')
        .insert([documentData])
        .select()
        .single()

      if (docError) {
        // Si falla la inserción, eliminar el archivo subido
        await supabase.storage
          .from('caregiver-documents')
          .remove([filePath])
        throw new Error(`Error creating document record: ${docError.message}`)
      }

      return docData
    } catch (error) {
      console.error('Error in uploadDocument:', error)
      throw error
    }
  }

  // Actualizar estado de documento
  static async updateDocumentStatus(documentId, status, validationNotes = null, validatedBy = null) {
    try {
      const updates = {
        status,
        validation_notes: validationNotes,
        validated_by: validatedBy,
        validated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('caregiver_documents')
        .update(updates)
        .eq('id', documentId)
        .select()
        .single()

      if (error) {
        throw new Error(`Error updating document status: ${error.message}`)
      }

      return data
    } catch (error) {
      console.error('Error in updateDocumentStatus:', error)
      throw error
    }
  }

  // Obtener estadísticas de cuidadores
  static async getCaregiverStats() {
    try {
      const { data, error } = await supabase
        .from('caregivers')
        .select('status')

      if (error) {
        throw new Error(`Error fetching caregiver stats: ${error.message}`)
      }

      const stats = {
        total: data.length,
        pending: data.filter(c => c.status === 'pending').length,
        in_review: data.filter(c => c.status === 'in_review').length,
        approved: data.filter(c => c.status === 'approved').length,
        rejected: data.filter(c => c.status === 'rejected').length,
        suspended: data.filter(c => c.status === 'suspended').length
      }

      return stats
    } catch (error) {
      console.error('Error in getCaregiverStats:', error)
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
} 