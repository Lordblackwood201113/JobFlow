import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'job-documents';
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_TYPES = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'text/plain': ['.txt'],
};

/**
 * Service pour gérer le stockage de fichiers dans Supabase Storage
 */
const storageService = {
  /**
   * Valider un fichier avant upload
   */
  validateFile(file) {
    const errors = [];

    // Vérifier la taille
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Le fichier est trop volumineux (max 5MB)`);
    }

    // Vérifier le type
    if (!ALLOWED_TYPES[file.type]) {
      errors.push(`Type de fichier non autorisé. Formats acceptés : PDF, DOC, DOCX, TXT`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Upload un fichier dans Supabase Storage
   */
  async uploadFile(userId, jobId, file, documentType = 'Autre') {
    try {
      // Valider le fichier
      const validation = this.validateFile(file);
      if (!validation.isValid) {
        return { data: null, error: { message: validation.errors.join(', ') } };
      }

      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}.${fileExt}`;
      const filePath = `${userId}/${jobId}/${fileName}`;

      // Upload dans Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Créer l'entrée dans la table documents
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert([
          {
            job_id: jobId,
            user_id: userId,
            name: file.name,
            type: documentType,
            file_path: filePath,
            file_size: file.size,
            mime_type: file.type,
          },
        ])
        .select()
        .single();

      // Si l'insertion BD échoue, supprimer le fichier uploadé (rollback)
      if (docError) {
        await supabase.storage.from(BUCKET_NAME).remove([filePath]);
        throw docError;
      }

      return { data: docData, error: null };
    } catch (error) {
      console.error('Erreur upload fichier:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer tous les documents d'une candidature
   */
  async getJobDocuments(jobId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('job_id', jobId)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération documents:', error);
      return { data: [], error };
    }
  },

  /**
   * Obtenir l'URL publique d'un document
   */
  getPublicUrl(filePath) {
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Télécharger un document
   */
  async downloadFile(filePath) {
    try {
      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .download(filePath);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur téléchargement:', error);
      return { data: null, error };
    }
  },

  /**
   * Supprimer un document
   */
  async deleteDocument(documentId, filePath) {
    try {
      // Supprimer le fichier du storage
      const { error: storageError } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([filePath]);

      if (storageError) throw storageError;

      // Supprimer l'entrée de la base de données
      const { error: dbError } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (dbError) throw dbError;

      return { error: null };
    } catch (error) {
      console.error('Erreur suppression document:', error);
      return { error };
    }
  },

  /**
   * Obtenir la taille totale des documents d'un utilisateur
   */
  async getUserStorageSize(userId) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .select('file_size')
        .eq('user_id', userId);

      if (error) throw error;

      const totalSize = data.reduce((sum, doc) => sum + (doc.file_size || 0), 0);

      return {
        data: {
          totalSize,
          totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
          fileCount: data.length,
        },
        error: null,
      };
    } catch (error) {
      console.error('Erreur taille storage:', error);
      return { data: null, error };
    }
  },
};

export default storageService;
