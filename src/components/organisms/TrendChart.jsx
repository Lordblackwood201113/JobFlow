import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import Card from '../ui/Card';

const TrendChart = ({ data }) => {
  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Évolution des candidatures
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
        Évolution des candidatures (6 derniers mois)
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            stroke="#6B7280"
            strokeWidth={2}
            name="Total"
          />
          <Line
            type="monotone"
            dataKey="Envoyé"
            stroke="#3B82F6"
            strokeWidth={2}
            name="Envoyées"
          />
          <Line
            type="monotone"
            dataKey="Entretien"
            stroke="#8B5CF6"
            strokeWidth={2}
            name="Entretiens"
          />
          <Line
            type="monotone"
            dataKey="Offre"
            stroke="#10B981"
            strokeWidth={2}
            name="Offres"
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default TrendChart;
