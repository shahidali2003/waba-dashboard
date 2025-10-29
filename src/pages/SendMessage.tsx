import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { sendMessage } from '@/lib/api';
import { sendMessageSchema, type SendMessageFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Info, Send, Loader2, ChevronDown, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import CodeBlock from '@/components/CodeBlock';
import ApiHealthBadge from '@/components/ApiHealthBadge';
import { API_BASE_URL } from '@/lib/api';

export default function SendMessage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<SendMessageFormData>({
    resolver: zodResolver(sendMessageSchema),
    defaultValues: {
      to: '',
      message: '',
    },
  });

  const formValues = watch();

  const onSubmit = async (data: SendMessageFormData) => {
    setIsSubmitting(true);
    try {
      const response = await sendMessage(data);
      toast.success(`Message sent successfully! SID: ${response.sid}`, {
        duration: 5000,
      });
      setValue('message', '');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrefill = () => {
    setValue('to', '+917644939132');
    setValue('message', 'Hello from the WhatsApp Messenger demo! This is a test message.');
    toast.info('Form prefilled with sample data');
  };

  const curlCommand = `curl -X POST "${API_BASE_URL}/send-message" \\
  -H "Content-Type: application/json" \\
  -d '{"to":"${formValues.to || '+917644939132'}","message":"${(formValues.message || 'Hello from the demo UI').replace(/\n/g, '\\n').replace(/"/g, '\\"')}"}'`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Send WhatsApp Message</h1>
          <p className="text-muted-foreground mt-1">
            Send messages through Twilio's WhatsApp Sandbox
          </p>
        </div>
        <ApiHealthBadge />
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>How it works:</strong> Recipients must join your Twilio Sandbox by sending the
          join code to <strong>+1 415 523 8886</strong> before they can receive messages. The backend
          automatically adds the "whatsapp:" prefix to phone numbers.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Message Details</CardTitle>
          <CardDescription>
            Enter the recipient's WhatsApp number and your message
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="to">Recipient WhatsApp Number *</Label>
              <Input
                id="to"
                placeholder="+917644939132"
                {...register('to')}
                className={errors.to ? 'border-destructive' : ''}
              />
              {errors.to && (
                <p className="text-sm text-destructive">{errors.to.message}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Include country code (e.g., +91 for India, +1 for US)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Hello! This is a test message from WhatsApp Messenger..."
                rows={6}
                {...register('message')}
                className={errors.message ? 'border-destructive' : ''}
              />
              {errors.message && (
                <p className="text-sm text-destructive">{errors.message.message}</p>
              )}
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Maximum 1000 characters</span>
                <span>{formValues.message?.length || 0} / 1000</span>
              </div>
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
                    Send via WhatsApp
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
