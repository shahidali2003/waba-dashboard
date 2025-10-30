import { CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'client';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  sid?: string;
}

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  const formattedTime = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[80%]',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      <div
        className={cn(
          'rounded-lg px-4 py-2 space-y-1',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-card border border-border'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        
        <div className="flex items-center gap-2 justify-end">
          <span
            className={cn(
              'text-xs',
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            )}
          >
            {formattedTime}
          </span>
          
          {isUser && (
            <span className="flex-shrink-0">
              {message.status === 'sending' && (
                <Clock className="h-3 w-3 text-primary-foreground/70" />
              )}
              {message.status === 'sent' && (
                <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
              )}
              {message.status === 'error' && (
                <AlertCircle className="h-3 w-3 text-destructive" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
