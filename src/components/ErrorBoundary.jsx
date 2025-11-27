import { Component } from 'react';
import { Briefcase, RefreshCw } from 'lucide-react';
import Button from './atoms/Button';

/**
 * Error Boundary pour capturer les erreurs React et afficher un fallback UI
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log l'erreur à un service de monitoring (Sentry, etc.) si configuré
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: true,
      });
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#DBEAFE] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white rounded-[24px] shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 rounded-full bg-red-50">
                <Briefcase className="h-12 w-12 text-red-600" />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Oups ! Une erreur est survenue
            </h1>

            <p className="text-gray-600 mb-6">
              Nous sommes désolés, une erreur inattendue s'est produite.
              Nos équipes ont été notifiées et travaillent à résoudre le problème.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left bg-gray-50 rounded-lg p-4">
                <summary className="cursor-pointer font-medium text-gray-900 mb-2">
                  Détails de l'erreur (mode développement)
                </summary>
                <div className="text-sm text-gray-700 space-y-2">
                  <p className="font-mono text-xs text-red-600">
                    {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <pre className="text-xs overflow-auto max-h-40 bg-white p-2 rounded border">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
                className="w-full sm:w-auto"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Retour à l'accueil
              </Button>

              <Button
                variant="outline"
                onClick={() => window.location.reload()}
                className="w-full sm:w-auto"
              >
                Recharger la page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
