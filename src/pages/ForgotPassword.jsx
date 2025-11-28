import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';
import authService from '../services/authService';
import Button from '../components/atoms/Button';
import Input from '../components/atoms/Input';
import Card from '../components/ui/Card';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('L\'email est requis');
      return;
    }

    if (!validateEmail(email)) {
      setError('Email invalide');
      return;
    }

    setLoading(true);

    try {
      const { error: resetError } = await authService.resetPasswordRequest(email);

      if (resetError) {
        setError('Une erreur est survenue. Veuillez réessayer.');
        console.error('Reset password error:', resetError);
      } else {
        setSuccess(true);
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
      console.error('Reset password exception:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DBEAFE] p-4">
      <Card className="w-full max-w-md">
        <div className="mb-6">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la connexion
          </Link>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8B5CF6]/10 mb-4">
              <Mail className="h-8 w-8 text-[#8B5CF6]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-gray-600">
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
            </p>
          </div>
        </div>

        {!success ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={error}
              placeholder="votre@email.com"
              required
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-800">
                <strong>Email envoyé !</strong>
                <br />
                Si un compte existe avec cette adresse email, vous recevrez un lien de réinitialisation dans quelques instants.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Conseil :</strong> Vérifiez également votre dossier spam si vous ne trouvez pas l'email.
              </p>
            </div>

            <Link to="/login">
              <Button variant="outline" className="w-full">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        )}

        {!success && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link
                to="/login"
                className="text-[#8B5CF6] font-medium hover:underline"
              >
                Se connecter
              </Link>
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;
