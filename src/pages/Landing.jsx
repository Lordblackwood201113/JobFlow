import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Target,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle,
  ArrowRight,
  Star,
} from 'lucide-react';
import Button from '../components/atoms/Button';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Briefcase,
      title: 'Centralisez vos candidatures',
      description:
        'Regroupez toutes vos candidatures au même endroit. Fini les fichiers Excel dispersés et les notes perdues.',
    },
    {
      icon: Target,
      title: 'Suivez votre progression',
      description:
        'Visualisez en temps réel où en est chaque candidature : envoyée, entretien, offre ou refus.',
    },
    {
      icon: TrendingUp,
      title: 'Analysez vos résultats',
      description:
        'Obtenez des statistiques détaillées sur vos candidatures et identifiez les meilleures sources d\'opportunités.',
    },
    {
      icon: FileText,
      title: 'Stockez vos documents',
      description:
        'Attachez CV, lettres de motivation et autres documents directement à chaque candidature.',
    },
  ];

  const stats = [
    { value: '500+', label: 'Utilisateurs actifs' },
    { value: '10K+', label: 'Candidatures suivies' },
    { value: '4.8/5', label: 'Note utilisateurs' },
  ];

  return (
    <div className="min-h-screen bg-[#DBEAFE]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#DBEAFE]/95 backdrop-blur-sm border-b border-gray-900/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-gray-900" />
              <span className="text-2xl font-bold text-gray-900">JobFlow</span>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                className="hidden sm:flex"
              >
                Connexion
              </Button>
              <Button variant="primary" onClick={() => navigate('/register')}>
                Commencer gratuitement
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 rounded-full mb-8 backdrop-blur-sm">
            <Star className="h-4 w-4 text-[#8B5CF6]" />
            <span className="text-sm font-medium text-gray-900">
              Gérez vos candidatures comme un pro
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Votre recherche d'emploi,
            <br />
            <span className="text-[#8B5CF6]">enfin organisée</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed">
            Suivez toutes vos candidatures, gérez vos entretiens et analysez vos
            résultats dans une interface simple et intuitive.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/register')}
              className="text-lg px-8 py-4 w-full sm:w-auto"
            >
              Commencer gratuitement
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/login')}
              className="text-lg px-8 py-4 w-full sm:w-auto"
            >
              Se connecter
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mt-20 max-w-2xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Des outils simples et efficaces pour optimiser votre recherche d'emploi
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-[24px] p-8 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#8B5CF6]/10 rounded-2xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-[#8B5CF6]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-white rounded-[32px] p-12 md:p-16 shadow-sm">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pourquoi JobFlow ?
              </h2>
              <div className="space-y-4">
                {[
                  'Interface intuitive et facile à prendre en main',
                  'Synchronisation en temps réel de vos données',
                  'Statistiques avancées pour optimiser votre stratégie',
                  'Gratuit et sans publicité',
                  'Vos données sont sécurisées et privées',
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-6 w-6 text-[#8B5CF6] flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#8B5CF6]/10 to-[#DBEAFE]/20 rounded-[24px] p-8 flex items-center justify-center min-h-[300px]">
              <BarChart3 className="h-48 w-48 text-[#8B5CF6]/30" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] rounded-[32px] p-12 md:p-16 text-center shadow-lg">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Prêt à organiser votre recherche d'emploi ?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Rejoignez des centaines de chercheurs d'emploi qui utilisent JobFlow
            pour trouver leur prochain poste.
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/register')}
            className="text-lg px-8 py-4 bg-white text-[#8B5CF6] hover:bg-white/90"
          >
            Créer mon compte gratuitement
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-gray-900" />
              <span className="text-lg font-semibold text-gray-900">
                JobFlow
              </span>
            </div>

            <p className="text-sm text-gray-600">
              © 2025 JobFlow. Tous droits réservés.
            </p>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
