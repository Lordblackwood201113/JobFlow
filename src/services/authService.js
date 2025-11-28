import { supabase } from '../lib/supabaseClient';

/**
 * Service d'authentification pour gérer toutes les opérations liées à l'auth
 */
const authService = {
  /**
   * Connexion avec email et mot de passe
   */
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return { data: null, error };
    }
  },

  /**
   * Inscription avec email et mot de passe
   */
  async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: metadata.full_name || '',
          },
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      return { data: null, error };
    }
  },

  /**
   * Déconnexion
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      return { error };
    }
  },

  /**
   * Connexion avec OAuth (Google, GitHub, etc.)
   */
  async signInWithOAuth(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error(`Erreur de connexion avec ${provider}:`, error);
      return { data: null, error };
    }
  },

  /**
   * Demande de réinitialisation du mot de passe (envoie l'email)
   */
  async resetPasswordRequest(email) {
    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur de réinitialisation:', error);
      return { data: null, error };
    }
  },

  /**
   * Mise à jour du mot de passe
   */
  async updatePassword(newPassword) {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur de mise à jour du mot de passe:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer la session actuelle
   */
  async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return { session, error: null };
    } catch (error) {
      console.error('Erreur de récupération de session:', error);
      return { session: null, error };
    }
  },

  /**
   * Récupérer l'utilisateur actuel
   */
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return { user, error: null };
    } catch (error) {
      console.error('Erreur de récupération de l\'utilisateur:', error);
      return { user: null, error };
    }
  },

  /**
   * Mettre à jour le profil utilisateur
   */
  async updateProfile(userId, updates) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error);
      return { data: null, error };
    }
  },

  /**
   * Récupérer le profil utilisateur
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
      console.error('Erreur de récupération du profil:', error);
      return { data: null, error };
    }
  },
};

export default authService;
