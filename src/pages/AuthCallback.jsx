import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import showToast from '../lib/toast';

/**
 * Page de callback OAuth pour gérer les redirections après authentification
 */
const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Récupérer le hash de l'URL qui contient les tokens
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error('Erreur callback OAuth:', error);
          showToast.error('Erreur lors de la connexion');
          navigate('/login');
          return;
        }

        if (data.session) {
          showToast.success('Connexion réussie');
          navigate('/dashboard');
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('Exception callback OAuth:', error);
        showToast.error('Erreur lors de la connexion');
        navigate('/login');
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DBEAFE]">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
        <p className="mt-4 text-gray-900 font-medium">Authentification en cours...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
