import { useEffect, useState } from 'react';
import { checkApiHealth } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

export default function ApiHealthBadge() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    setIsChecking(true);
    const healthy = await checkApiHealth();
    setIsHealthy(healthy);
    setIsChecking(false);
  };

  if (isChecking && isHealthy === null) {
    return (
      <Badge variant="secondary" className="gap-1.5">
        <Loader2 className="h-3 w-3 animate-spin" />
        Checking API...
      </Badge>
    );
  }

  if (isHealthy) {
    return (
      <Badge variant="outline" className="border-success text-success gap-1.5">
        <span className="h-2 w-2 rounded-full bg-success" />
        API Connected
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-destructive text-destructive gap-1.5">
      <span className="h-2 w-2 rounded-full bg-destructive" />
      API Offline
    </Badge>
  );
}
