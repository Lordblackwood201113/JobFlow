import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Card from '../ui/Card';

const StatusDistributionChart = ({ data }) => {
  const COLORS = {
    Brouillon: '#6B7280',
    Envoyé: '#3B82F6',
    Entretien: '#8B5CF6',
    Offre: '#10B981',
    Refus: '#EF4444',
  };

  const chartData = data.map((item) => ({
    ...item,
    color: COLORS[item.name] || '#6B7280',
  }));

  if (data.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Distribution par statut
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
        Distribution par statut
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
};

export default StatusDistributionChart;
