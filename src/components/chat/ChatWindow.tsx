import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MoreVertical, Menu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useParams } from "react-router-dom";
import ApiClient from "@/lib/api";

export default function ChatWindow({ setIsContactsOpenHandler, unauthorisedHandler }) {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { recipient } = useParams();

  const lastIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Deduplication helper
  const mergeMessages = (prev: any[], incoming: any[]) => {
    const map = new Map<number, any>();
    [...prev, ...incoming].forEach((m) => {
      map.set(m.id, m); // latest one wins if duplicate id
    });
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  };

  // Initial load
  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const url = ApiClient.buildFullUrl(import.meta.env.VITE_CHAT_CONVERSATION, { recipient_username: recipient });
        let { status, data, error } = await ApiClient.get(url);
        if(status < 300) {
          if (data.length > 0) {
            lastIdRef.current = Math.max(...data.map((m: any) => m.id));
          }
          setMessages(data);
        }else{
            if(status === 403){
              unauthorisedHandler()
            }else{
              console.error("Failed to load chats>>:", error);      
            }
        }
      } catch (error) {
        console.error("Failed to load chats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, [recipient]);



  // Polling every 5s
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const url = ApiClient.buildFullUrl(import.meta.env.VITE_CHAT_CONVERSATION, { recipient_username: recipient, lastid: lastIdRef.current });
        const { status, data, error } = await ApiClient.get(url);
        
        if(status >= 300){
          if(status === 403){
              unauthorisedHandler()
            }else{
              console.error("Failed to load chats>>:", error);      
            }
          return
        }

        if (data && data.length > 0) {
          const latestId = Math.max(...data.map((m: any) => m.id));
          setMessages((prev) => mergeMessages(prev, data));
          lastIdRef.current = latestId;
        }
      } catch (error) {
        console.error("Polling failed:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [recipient]);



  // Scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Detect manual scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 50;
    setAutoScroll(isAtBottom);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      setLoading(true);
      const url = ApiClient.buildFullUrl(
        import.meta.env.VITE_CHAT_CONVERSATION,
        { recipient_username: recipient }
      );
      
      let { status, data, error } = await ApiClient.post(url, { message: newMessage });
      if(status === 403){
        unauthorisedHandler()
        return
      }
      setMessages((prev) => mergeMessages(prev, [data]));
      lastIdRef.current = Math.max(lastIdRef.current, data.id);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex flex-col h-full">
      {/* Backdrop Loader */}
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={setIsContactsOpenHandler}
          >
            <Menu className="h-4 w-4" />
          </Button>
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              {recipient ? recipient[0].toUpperCase() : "?"}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground">{recipient}</h3>
            <p className="text-sm text-muted-foreground">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message, index) => (
          <div
            key={`${message.id}-${index}`} // ✅ unique key
            className={cn(
              "flex",
              message.sender === recipient ? "justify-start" : "justify-end"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] p-3 rounded-2xl",
                message.sender === recipient
                  ? "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md"
                  : "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md"
              )}
            >
              <p className="text-sm leading-relaxed">{message.message}</p>
              <p
                className={cn(
                  "text-xs mt-1 opacity-70",
                  message.sender === recipient ? "text-left" : "text-right"
                )}
              >
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex items-center gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" disabled={!newMessage.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
