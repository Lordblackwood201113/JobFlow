import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import authService from '../services/authService';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Récupérer la session au chargement
    const initializeAuth = async () => {
      try {
        // Timeout de 5s pour éviter le blocage si localStorage est corrompu
        const timeoutPromise = new Promise((resolve) => 
          setTimeout(() => resolve({ session: null, error: 'Timeout' }), 5000)
        );
        
        const sessionPromise = authService.getSession();
        
        const { session: currentSession } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]);

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Charger le profil utilisateur
          const { data: profileData } = await authService.getProfile(
            currentSession.user.id
          );
          if (mounted) setProfile(profileData);
        }
      } catch (error) {
        console.error('Erreur d\'initialisation de l\'authentification:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!mounted) return;

        // Gérer les événements d'authentification de manière sélective
        switch (event) {
          case 'SIGNED_OUT':
            setSession(null);
            setUser(null);
            setProfile(null);
            setLoading(false);
            break;
            
          case 'SIGNED_IN':
          case 'TOKEN_REFRESHED':
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            if (currentSession?.user) {
               try {
                 const { data: profileData } = await authService.getProfile(currentSession.user.id);
                 if (mounted) setProfile(profileData);
               } catch (error) {
                 console.error('Erreur lors du chargement du profil:', error);
               }
            }
            setLoading(false);
            break;
            
          case 'INITIAL_SESSION':
            // Sécurité : on s'assure que le loading s'arrête
            setLoading(false);
            break;

          default:
            // Pour les autres événements (USER_UPDATED, PASSWORD_RECOVERY, etc.)
            if (currentSession) {
               setSession(currentSession);
               setUser(currentSession.user);
            }
            break;
        }
      }
    );

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Connexion avec email/password
   */
  const signIn = async (email, password) => {
    const { data, error } = await authService.signIn(email, password);
    return { data, error };
  };

  /**
   * Inscription avec email/password
   */
  const signUp = async (email, password, metadata) => {
    const { data, error } = await authService.signUp(email, password, metadata);
    return { data, error };
  };

  /**
   * Déconnexion
   */
  const signOut = async () => {
    const { error } = await authService.signOut();
    if (!error) {
      setUser(null);
      setProfile(null);
      setSession(null);
    }
    return { error };
  };

  /**
   * Connexion OAuth
   */
  const signInWithOAuth = async (provider) => {
    const { data, error } = await authService.signInWithOAuth(provider);
    return { data, error };
  };

  /**
   * Réinitialisation du mot de passe
   */
  const resetPassword = async (email) => {
    const { data, error } = await authService.resetPassword(email);
    return { data, error };
  };

  /**
   * Mise à jour du mot de passe
   */
  const updatePassword = async (newPassword) => {
    const { data, error } = await authService.updatePassword(newPassword);
    return { data, error };
  };

  /**
   * Mise à jour du profil
   */
  const updateProfile = async (updates) => {
    if (!user) return { data: null, error: new Error('Non authentifié') };

    const { data, error } = await authService.updateProfile(user.id, updates);
    if (!error && data) {
      setProfile(data);
    }
    return { data, error };
  };

  /**
   * Rafraîchir le profil
   */
  const refreshProfile = async () => {
    if (!user) return;

    const { data } = await authService.getProfile(user.id);
    if (data) {
      setProfile(data);
    }
  };

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    resetPassword,
    updatePassword,
    updateProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
