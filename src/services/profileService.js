import { supabase } from '../lib/supabaseClient';

const BUCKET_NAME = 'avatars';
const MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB

const ALLOWED_AVATAR_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
};

/**
 * Service pour gérer le profil utilisateur
 */
const profileService = {
  /**
   * Récupérer le profil d'un utilisateur
   */
  async getProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur récupération profil:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour le profil
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
      return { data: null, error };
    }
  },

  /**
   * Valider un fichier avatar
   */
  validateAvatar(file) {
    const errors = [];

    // Vérifier la taille
    if (file.size > MAX_AVATAR_SIZE) {
      errors.push('L\'image est trop volumineuse (max 2MB)');
    }

    // Vérifier le type
    if (!ALLOWED_AVATAR_TYPES[file.type]) {
      errors.push('Format d\'image non autorisé. Formats acceptés : JPG, PNG, WEBP');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  },

  /**
   * Upload un avatar
   */
  async uploadAvatar(userId, file) {
    try {
      // Valider le fichier
      const validation = this.validateAvatar(file);
      if (!validation.isValid) {
        return { data: null, error: { message: validation.errors.join(', ') } };
      }

      // Créer un nom de fichier unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Supprimer l'ancien avatar s'il existe
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);

      // Upload le nouveau
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: urlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);

      // Mettre à jour le profil avec la nouvelle URL
      const { data: profileData, error: profileError } = await this.updateProfile(
        userId,
        { avatar_url: urlData.publicUrl }
      );

      if (profileError) throw profileError;

      return { data: profileData, error: null };
    } catch (error) {
      console.error('Erreur upload avatar:', error);
      return { data: null, error };
    }
  },

  /**
   * Supprimer l'avatar
   */
  async deleteAvatar(userId) {
    try {
      // Supprimer du storage
      const filePath = `${userId}/${userId}`;
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);

      // Mettre à jour le profil
      const { data, error } = await this.updateProfile(userId, {
        avatar_url: null,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur suppression avatar:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour l'email (nécessite ré-authentification)
   */
  async updateEmail(newEmail) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: newEmail,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour email:', error);
      return { data: null, error };
    }
  },

  /**
   * Mettre à jour le mot de passe
   */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur mise à jour mot de passe:', error);
      return { data: null, error };
    }
  },
};

export default profileService;
