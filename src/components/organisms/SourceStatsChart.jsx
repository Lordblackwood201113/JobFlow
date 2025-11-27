import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';

const SourceStatsChart = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Statistiques par source
        </h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Aucune donnée disponible
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Performance par source de candidature
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#3B82F6" name="Total candidatures" />
          <Bar dataKey="interviews" fill="#8B5CF6" name="Entretiens obtenus" />
          <Bar dataKey="offers" fill="#10B981" name="Offres reçues" />
        </BarChart>
      </ResponsiveContainer>

      {/* Tableau récapitulatif */}
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Source
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Taux d'entretien
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                Taux de succès
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((source, index) => (
              <tr key={index}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {source.name}
                </td>
                <td className="px-4 py-3 text-sm text-center text-gray-700">
                  {source.total}
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="text-purple-600 font-medium">
                    {source.interviewRate}%
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className="text-green-600 font-medium">
                    {source.successRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default SourceStatsChart;
