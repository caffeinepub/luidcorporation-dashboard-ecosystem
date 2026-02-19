import { useState, useEffect } from 'react';
import { useNetworkMonitoringStatus } from './useQueries';

interface NetworkDataPoint {
  time: string;
  speed: number;
}

export function useNetworkSpeedSimulation() {
  const [data, setData] = useState<NetworkDataPoint[]>([]);
  const [currentSpeed, setCurrentSpeed] = useState(3.5);
  const { data: monitoringStatus } = useNetworkMonitoringStatus();

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      });

      let speed = 0;

      // Check monitoring status
      if (monitoringStatus === 'offline') {
        speed = 0;
      } else {
        // Simulate realistic network oscillation between 2.5 and 4.8 Gbps
        // Using sine wave with some randomness for natural variation
        const baseTime = Date.now() / 1000;
        const sineWave = Math.sin(baseTime / 10) * 0.8; // Oscillates between -0.8 and 0.8
        const randomVariation = (Math.random() - 0.5) * 0.4; // Random variation ±0.2
        const calculatedSpeed = 3.65 + sineWave + randomVariation; // Center around 3.65, range 2.5-4.8
        speed = Math.max(2.5, Math.min(4.8, calculatedSpeed));
      }

      setCurrentSpeed(speed);

      setData((prevData) => {
        const newData = [...prevData, { time: timeString, speed }];
        // Keep only last 20 data points
        return newData.slice(-20);
      });
    }, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, [monitoringStatus]);

  return { data, currentSpeed };
}
