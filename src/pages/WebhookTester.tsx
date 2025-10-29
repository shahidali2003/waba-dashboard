import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { testWebhook } from '@/lib/api';
import { webhookSchema, type WebhookFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Info, Send, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import CodeBlock from '@/components/CodeBlock';
import ApiHealthBadge from '@/components/ApiHealthBadge';
import { API_BASE_URL } from '@/lib/api';

export default function WebhookTester() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<{ status: number; statusText: string } | null>(null);
  const [codeOpen, setCodeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<WebhookFormData>({
    resolver: zodResolver(webhookSchema),
    defaultValues: {
      From: '',
      To: 'whatsapp:+14155238886',
      Body: '',
    },
  });

  const formValues = watch();

  const onSubmit = async (data: WebhookFormData) => {
    setIsSubmitting(true);
    setResponse(null);
    try {
      const res = await testWebhook(data);
      setResponse({ status: res.status, statusText: res.statusText });
      
      if (res.ok) {
        toast.success('Webhook test successful');
      } else {
        toast.error(`Webhook test failed: ${res.status} ${res.statusText}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to send webhook request');
      setResponse({ status: 0, statusText: 'Network Error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefill = () => {
    setValue('From', 'whatsapp:+917644939132');
    setValue('To', 'whatsapp:+14155238886');
    setValue('Body', 'Test inbound message from webhook tester');
    toast.info('Form prefilled with sample data');
  };

  const curlCommand = `curl -X POST "${API_BASE_URL}/webhook" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  --data "From=${encodeURIComponent(formValues.From || 'whatsapp:+917644939132')}&To=${encodeURIComponent(formValues.To || 'whatsapp:+14155238886')}&Body=${encodeURIComponent(formValues.Body || 'Test inbound')}"`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Webhook Tester</h1>
          <p className="text-muted-foreground mt-1">
            Simulate incoming WhatsApp messages to your webhook
          </p>
        </div>
        <ApiHealthBadge />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>About webhooks:</strong> In production, Twilio automatically sends POST requests
          to your webhook endpoint when users reply to your WhatsApp messages. This tester simulates
          those requests for local development. The backend currently logs webhook data to the console.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Webhook Request Details</CardTitle>
          <CardDescription>
            Simulate an incoming message from Twilio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="From">From (Sender) *</Label>
              <Input
                id="From"
                placeholder="whatsapp:+917644939132"
                {...register('From')}
                className={errors.From ? 'border-destructive' : ''}
              />
              {errors.From && (
                <p className="text-sm text-destructive">{errors.From.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Must include "whatsapp:" prefix (e.g., whatsapp:+917644939132)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="To">To (Your Sandbox Number) *</Label>
              <Input
                id="To"
                placeholder="whatsapp:+14155238886"
                {...register('To')}
                className={errors.To ? 'border-destructive' : ''}
              />
              {errors.To && (
                <p className="text-sm text-destructive">{errors.To.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Usually your Twilio Sandbox number: whatsapp:+14155238886
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Body">Message Body *</Label>
              <Textarea
                id="Body"
                placeholder="Test inbound message"
                rows={4}
                {...register('Body')}
                className={errors.Body ? 'border-destructive' : ''}
              />
              {errors.Body && (
                <p className="text-sm text-destructive">{errors.Body.message}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1"
                size="lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Test Webhook
                  </>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handlePrefill}
                size="lg"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Prefill Sample
              </Button>
            </div>

            {response && (
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Response Status:</span>
                  <Badge
                    variant={response.status >= 200 && response.status < 300 ? 'default' : 'destructive'}
                  >
                    {response.status} {response.statusText}
                  </Badge>
                </div>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card>
        <Collapsible open={codeOpen} onOpenChange={setCodeOpen}>
          <CardHeader>
            <CollapsibleTrigger className="flex items-center justify-between w-full hover:opacity-80 transition-opacity">
              <div className="text-left">
                <CardTitle>cURL Example</CardTitle>
                <CardDescription>API request equivalent of the form above</CardDescription>
              </div>
              <ChevronDown
                className={`h-5 w-5 transition-transform ${codeOpen ? 'rotate-180' : ''}`}
              />
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent>
              <CodeBlock code={curlCommand} />
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </div>
  );
}
