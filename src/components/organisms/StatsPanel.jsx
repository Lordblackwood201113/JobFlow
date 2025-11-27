import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Building2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import statsService from '../../services/statsService';
import Card from '../ui/Card';
import StatusDistributionChart from './StatusDistributionChart';
import TrendChart from './TrendChart';
import SourceStatsChart from './SourceStatsChart';

const StatsPanel = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    distribution: [],
    trend: [],
    sources: [],
    responseTime: { averageDays: 0, count: 0 },
    topCompanies: [],
  });

  useEffect(() => {
    if (user) {
      loadStats();
    }
  }, [user]);

  const loadStats = async () => {
    setLoading(true);
    try {
      const [distribution, trend, sources, responseTime, topCompanies] =
        await Promise.all([
          statsService.getStatusDistribution(user.id),
          statsService.getApplicationsTrend(user.id),
          statsService.getSourceStats(user.id),
          statsService.getAverageResponseTime(user.id),
          statsService.getTopCompanies(user.id),
        ]);

      setStats({
        distribution: distribution.data || [],
        trend: trend.data || [],
        sources: sources.data || [],
        responseTime: responseTime.data || { averageDays: 0, count: 0 },
        topCompanies: topCompanies.data || [],
      });
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Délai moyen de réponse */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <Clock className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Délai moyen de réponse
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.responseTime.averageDays}
                <span className="text-base font-normal text-gray-600 ml-2">
                  jours
                </span>
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Sur {stats.responseTime.count} réponses
              </p>
            </div>
          </div>
        </Card>

        {/* Taux de conversion */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Taux de conversion
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.sources.length > 0
                  ? Math.round(
                      stats.sources.reduce((sum, s) => sum + s.successRate, 0) /
                        stats.sources.length
                    )
                  : 0}
                <span className="text-base font-normal text-gray-600 ml-2">%</span>
              </p>
              <p className="text-sm text-gray-500 mt-1">Moyenne globale</p>
            </div>
          </div>
        </Card>

        {/* Top entreprises */}
        <Card>
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">
                Top entreprises
              </p>
              {stats.topCompanies.length > 0 ? (
                <div className="space-y-1">
                  {stats.topCompanies.slice(0, 3).map((company, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700 truncate">
                        {company.name}
                      </span>
                      <span className="font-semibold text-gray-900 ml-2">
                        {company.count}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucune donnée</p>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StatusDistributionChart data={stats.distribution} />
        <TrendChart data={stats.trend} />
      </div>

      {/* Statistiques par source */}
      <SourceStatsChart data={stats.sources} />
    </div>
  );
};

export default StatsPanel;
