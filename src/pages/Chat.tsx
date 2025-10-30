import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Send, Phone, User, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { sendMessage, fetchMessages, BackendMessage } from '@/lib/api';
import ChatMessage from '@/components/ChatMessage';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'client';
  timestamp: Date;
  status?: 'sending' | 'sent' | 'error';
  sid?: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [recipientNumber, setRecipientNumber] = useState('+917644939132');
  const [sandboxNumber] = useState('+1 415 523 8886');
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Poll messages from backend every 2 seconds
  useEffect(() => {
    const pollMessages = async () => {
      try {
        const backendMessages = await fetchMessages();
        
        // Convert backend messages to UI message format
        const convertedMessages: Message[] = backendMessages.map((msg: BackendMessage, index: number) => ({
          id: `${msg.time}-${index}`,
          text: msg.body,
          sender: msg.direction === 'outbound' ? 'user' : 'client',
          timestamp: new Date(msg.time),
          status: 'sent',
        }));

        setMessages(convertedMessages);
      } catch (error) {
        // Silently fail - don't show error toast on every poll failure
        console.error('Failed to fetch messages:', error);
      }
    };

    // Initial fetch
    pollMessages();

    // Poll every 2 seconds
    const intervalId = setInterval(pollMessages, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim() || isSending) return;

    const messageText = inputValue.trim();
    const tempId = Date.now().toString();

    // Add message to UI immediately with "sending" status
    const newMessage: Message = {
      id: tempId,
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsSending(true);

    try {
      const response = await sendMessage({
        to: recipientNumber,
        message: messageText,
      });

      // Update message status to "sent"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId
            ? { ...msg, status: 'sent', sid: response.sid }
            : msg
        )
      );

      toast.success('Message sent successfully');
    } catch (error: any) {
      // Update message status to "error"
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, status: 'error' } : msg
        )
      );

      toast.error(error.message || 'Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const simulateIncoming = () => {
    const sampleMessages = [
      'Hello! Thanks for reaching out.',
      'Got your message 👍',
      'Let me check that for you.',
      'Everything looks good from here!',
    ];
    
    const randomMessage = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    
    const incomingMessage: Message = {
      id: Date.now().toString(),
      text: randomMessage,
      sender: 'client',
      timestamp: new Date(),
      status: 'sent',
    };

    setMessages((prev) => [...prev, incomingMessage]);
    toast.info('Simulated incoming message');
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    toast.success('Message deleted');
  };

  return (
    <div className="h-[calc(100vh-12rem)] max-w-7xl mx-auto flex gap-4">
      {/* Sidebar */}
      <Card className="w-80 p-6 flex flex-col gap-6 hidden lg:flex bg-card/50 backdrop-blur-sm border-border/50">
        <div>
          <h2 className="text-lg font-semibold mb-4">Connection Info</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Twilio Sandbox</Label>
                <p className="text-sm font-medium">{sandboxNumber}</p>
              </div>
            </div>

            <Separator />

            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-xs text-muted-foreground">Test Recipient</Label>
                {isEditingNumber ? (
                  <div className="space-y-2 mt-1">
                    <Input
                      value={recipientNumber}
                      onChange={(e) => setRecipientNumber(e.target.value)}
                      placeholder="+917644939132"
                      className="h-8 text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditingNumber(false)}
                        className="h-7 text-xs"
                      >
                        Done
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditingNumber(true)}
                    className="text-sm font-medium hover:text-primary transition-colors text-left"
                  >
                    {recipientNumber}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto space-y-3">
          <Separator />
          <div className="bg-muted/50 p-3 rounded-lg text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground">Real-time Chat:</p>
            <ul className="space-y-1 list-disc list-inside">
              <li>Messages auto-sync every 2 seconds</li>
              <li>Send messages via backend API</li>
              <li>Client replies appear automatically</li>
              <li>Recipient must join Twilio Sandbox</li>
            </ul>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={simulateIncoming}
            className="w-full"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Simulate (Testing Only)
          </Button>
        </div>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col bg-gradient-to-b from-card/50 to-card backdrop-blur-sm border-border/50">
        {/* Chat Header */}
        <div className="p-4 border-b border-border/50 flex items-center justify-between bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-full">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">WhatsApp Chat Test</h2>
              <p className="text-xs text-muted-foreground">{recipientNumber}</p>
            </div>
          </div>
          
          {/* Mobile simulate button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={simulateIncoming}
            className="lg:hidden"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-muted/10 to-muted/30"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, hsl(var(--muted) / 0.03) 10px, hsl(var(--muted) / 0.03) 20px)'
          }}
        >
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <p>No messages yet</p>
                <p className="text-xs">Send a message to get started</p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage 
                key={message.id} 
                message={message} 
                onDelete={handleDeleteMessage}
              />
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border/50 bg-card/80 backdrop-blur-sm">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              disabled={isSending}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!inputValue.trim() || isSending}
              size="icon"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Press Enter to send • Shift+Enter for new line
          </p>
        </div>
      </Card>
    </div>
  );
}
