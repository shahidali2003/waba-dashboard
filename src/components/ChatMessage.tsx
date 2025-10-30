import { useState } from 'react';
import { CheckCheck, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
  onDelete?: (messageId: string) => void;
}

export default function ChatMessage({ message, onDelete }: ChatMessageProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isUser = message.sender === 'user';
  const formattedTime = message.timestamp.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        'flex gap-2 max-w-[80%] group relative',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Delete button */}
      {onDelete && isHovered && (
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-2",
            isUser ? "right-full mr-2" : "left-full ml-2"
          )}
          onClick={() => onDelete(message.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      )}
      
      <div
        className={cn(
          'rounded-2xl px-4 py-2 space-y-1 shadow-sm transition-all',
          isUser
            ? 'bg-primary text-primary-foreground rounded-br-sm'
            : 'bg-card border border-border/50 rounded-bl-sm'
        )}
      >
        <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{message.text}</p>
        
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
