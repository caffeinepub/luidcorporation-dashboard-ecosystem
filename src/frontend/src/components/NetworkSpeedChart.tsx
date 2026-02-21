import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNetworkSpeedSimulation } from '../hooks/useNetworkSpeedSimulation';
import { Activity } from 'lucide-react';

export default function NetworkSpeedChart() {
  const { data, currentSpeed } = useNetworkSpeedSimulation();

  return (
    <Card className="border-neon-green/20 bg-card-dark card-glow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neon-green">
          <Activity className="h-5 w-5" />
          Monitoramento de Rede
        </CardTitle>
        <CardDescription>Região: BR-SOUTH | Latência: 2ms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-3xl font-bold text-neon-green">
            {currentSpeed.toFixed(2)} Gbps
          </div>
          <div className="text-sm text-muted-foreground">Velocidade Atual</div>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(57, 255, 20, 0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
            />
            <YAxis
              domain={[2, 5]}
              stroke="rgba(255, 255, 255, 0.5)"
              tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 12 }}
              label={{ value: 'Gbps', angle: -90, position: 'insideLeft', fill: 'rgba(255, 255, 255, 0.7)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(26, 26, 26, 0.95)',
                border: '1px solid rgba(57, 255, 20, 0.3)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#39FF14' }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#39FF14"
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
