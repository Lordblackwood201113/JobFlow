import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/ui/Card';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validatingToken, setValidatingToken] = useState(true);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    // Vérifier si nous avons un access_token dans l'URL
    const accessToken = searchParams.get('access_token');
    const type = searchParams.get('type');

    if (!accessToken || type !== 'recovery') {
      setValidToken(false);
      setValidatingToken(false);
      setError('Lien de réinitialisation invalide ou expiré');
    } else {
      setValidToken(true);
      setValidatingToken(false);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.password) {
      setError('Le mot de passe est requis');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      const { error: resetError } = await authService.updatePassword(formData.password);

      if (resetError) {
        setError('Erreur lors de la réinitialisation du mot de passe');
        console.error('Update password error:', resetError);
      } else {
        setSuccess(true);
        // Rediriger vers login après 3 secondes
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Update password exception:', error);
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DBEAFE]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-900 font-medium">Validation du lien...</p>
        </div>
      </div>
    );
  }

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#DBEAFE] p-4">
        <Card className="w-full max-w-md">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Lien invalide
            </h1>
            <p className="text-gray-600 mb-6">
              Ce lien de réinitialisation est invalide ou a expiré.
            </p>
            <Button
              variant="primary"
              onClick={() => navigate('/forgot-password')}
              className="w-full"
            >
              Demander un nouveau lien
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DBEAFE] p-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8B5CF6]/10 mb-4">
            <Lock className="h-8 w-8 text-[#8B5CF6]" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Nouveau mot de passe
          </h1>
          <p className="text-gray-600">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </p>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Nouveau mot de passe"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              helperText="Au moins 6 caractères"
              required
              disabled={loading}
            />

            <Input
              label="Confirmer le mot de passe"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading}
            />

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
            </Button>
          </form>
        ) : (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-50 mb-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Mot de passe réinitialisé !</strong>
                <br />
                Vous allez être redirigé vers la page de connexion...
              </p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
