import { useState, useEffect } from 'react';
import { checkApiHealth, API_BASE_URL } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Status() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    setIsChecking(true);
    try {
      const healthy = await checkApiHealth();
      setIsHealthy(healthy);
      setLastChecked(new Date());
      
      if (healthy) {
        toast.success('API is reachable and responding');
      } else {
        toast.error('API is not responding');
      }
    } catch (error) {
      setIsHealthy(false);
      toast.error('Failed to check API health');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">API Status</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your WhatsApp Messenger backend connection
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Backend Health Check</CardTitle>
          <CardDescription>
            Verify that your backend API is running and accessible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">API Base URL</p>
              <code className="text-sm text-muted-foreground">{API_BASE_URL}</code>
            </div>
            <a
              href={`${API_BASE_URL}/swagger`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline flex items-center gap-1 text-sm"
            >
              Open Swagger
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div className="space-y-1">
              <p className="text-sm font-medium">Connection Status</p>
              {lastChecked && (
                <p className="text-xs text-muted-foreground">
                  Last checked: {lastChecked.toLocaleTimeString()}
                </p>
              )}
            </div>
            {isHealthy === null ? (
              <Badge variant="secondary">Not checked</Badge>
            ) : isHealthy ? (
              <Badge variant="outline" className="border-success text-success gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                Connected
              </Badge>
            ) : (
              <Badge variant="outline" className="border-destructive text-destructive gap-1.5">
                <AlertCircle className="h-3 w-3" />
                Offline
              </Badge>
            )}
          </div>

          <Button
            onClick={checkHealth}
            disabled={isChecking}
            className="w-full"
            size="lg"
          >
            {isChecking ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Status
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {isHealthy === false && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>API is not reachable.</strong> Please verify:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Your backend server is running on the correct port</li>
              <li>The VITE_API_BASE_URL environment variable is set correctly</li>
              <li>There are no firewall or network issues blocking the connection</li>
              <li>CORS is properly configured on your backend</li>
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {isHealthy && (
        <Alert className="border-success">
          <CheckCircle2 className="h-4 w-4 text-success" />
          <AlertDescription>
            <strong className="text-success">API is healthy and responding.</strong> Your backend
            is ready to send WhatsApp messages.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment Configuration</CardTitle>
          <CardDescription>
            Current environment settings for the application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Environment Variable</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">VITE_API_BASE_URL</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Current Value</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Default Value</span>
              <code className="text-sm bg-muted px-2 py-1 rounded">http://localhost:3000</code>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Endpoints</CardTitle>
          <CardDescription>
            REST API endpoints provided by your backend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">POST</Badge>
                <code className="text-sm">/send-message</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Send a WhatsApp message via Twilio Sandbox
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="default">POST</Badge>
                <code className="text-sm">/webhook</code>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive incoming WhatsApp messages from Twilio
              </p>
            </div>
            <div className="p-3 border border-border rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="secondary">GET</Badge>
                <code className="text-sm">/swagger</code>
              </div>
              <p className="text-sm text-muted-foreground">
                OpenAPI documentation and interactive testing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
