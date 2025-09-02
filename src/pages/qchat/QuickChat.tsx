import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Trash2Icon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ApiClient from "@/lib/api";
import CryptoJS from "crypto-js";

export default function QuickChat() {
  const { name, sender } = useParams();
  const [code, setCode] = useState("");
  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState("");
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const lastIdRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [startPolling, setStartPolling] = useState(false);

  // Initial setup
  useEffect(() => {
    console.log("Params:", name, sender);

    if (!name) {
      const convName = prompt("Enter Conversation Name");
      setStartPolling(false);
      if (convName) navigate("/qchat/" + convName);
      return;
    }

    if (!sender) {
      const codeName = prompt("Enter Your Name");
      setStartPolling(false);
      if (codeName) navigate("/qchat/" + name + "/" + codeName);
      return;
    }

    if (!code) {
      const cd = prompt("Enter Conversation Code");
      if (cd) {
        setCode(cd);
        setHeaders({
          "Content-Type": "application/json",
          name: name,
          token: cd,
        });
        setStartPolling(true);
      }
    } else {
      console.log("All good:", name, code, sender);
      setHeaders({
        "Content-Type": "application/json",
        name: name,
        token: code,
      });
      loadConversations();
      setStartPolling(true);
    }
  }, [name, sender, code, navigate]);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  // Polling every 5s
  useEffect(() => {
    if (!startPolling) return;

    const interval = setInterval(async () => {
      try {
        let msgs = await getConversations(lastIdRef.current, false);
        console.log("Polling Resp: ", msgs);
        if (msgs && msgs.length > 0) {
          setMessages((prev) => mergeMessages(prev, msgs));
          const maxId = Math.max(...msgs.map((item) => item.id));
          lastIdRef.current = Math.max(lastIdRef.current, maxId);
        }
      } catch (error) {
        console.error("Polling failed:", error);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startPolling]);

  async function loadConversations() {
    let msgs = await getConversations();
    if (msgs && msgs.length > 0) {
      setMessages((prev) => mergeMessages(prev, msgs));
      const maxId = Math.max(...msgs.map((item) => item.id));
      lastIdRef.current = Math.max(lastIdRef.current, maxId);
    }
  }

  async function deleteMsgs() {
    if (confirm("Confirm action.")) {
      try {
        setLoading(true);
        const url = ApiClient.buildFullUrl(
          import.meta.env.VITE_QUICK_CHAT_CONVERSATIONS
        );
        let respAPIData = await fetch(url, { method: "DELETE", headers });
        const respData = await respAPIData.json();
        if (respAPIData.status === 403) {
          setCode("");
          setMessages([]);
          return;
        }
        setMessages([]);
      } catch (error) {
        console.error("Failed to delete message:", error);
      } finally {
        setLoading(false);
      }
    }
  }

  async function getConversations(lastId = 0, showLoading = true) {
    let formattedData: any[] = [];
    try {
      setLoading(showLoading);
      const url = ApiClient.buildFullUrl(
        import.meta.env.VITE_QUICK_CHAT_CONVERSATIONS + "?lastid=" + lastId
      );
      let respAPIData = await fetch(url, { method: "GET", headers });
      const respData = await respAPIData.json();
      if (respAPIData.status === 403) {
        setCode("");
        setMessages([]);
        return [];
      }
      formattedData = respData.data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
    return formattedData;
  }

  // Deduplication + sorting helper
  const mergeMessages = (prev: any[], incoming: any[]) => {
    const map = new Map<number, any>();
    [...prev, ...incoming].forEach((m) => {
      map.set(m.id, m); // latest wins if duplicate id
    });
    return Array.from(map.values()).sort((a, b) => a.id - b.id);
  };

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
      const url = ApiClient.buildFullUrl(
        import.meta.env.VITE_QUICK_CHAT_CONVERSATIONS
      );
      let respAPIData = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify({ sender, message: CryptoJS.AES.encrypt(newMessage, code).toString() }),
      });
      const respData = await respAPIData.json();
      if (respAPIData.status === 403) {
        setCode("");
        setMessages([]);
        return;
      }
      let formattedData = respData.data;
      setMessages((prev) => mergeMessages(prev, [formattedData]));
      lastIdRef.current = Math.max(lastIdRef.current, formattedData.id);
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  function decryptMessage(ciphertext: string): string {
    try {
      const bytes = CryptoJS.AES.decrypt(ciphertext, code);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (e) {
      console.error("Decryption failed:", e);
      return "";
    }
  }

  return (
    <div className="h-screen bg-background flex justify-center">
      {/* Main chat container with border */}
      <div className="w-full md:w-1/2 h-full flex border border-border rounded-lg shadow-sm bg-background">
        <div className="flex-1">
          <div className="relative flex flex-col h-full">
            {loading && (
              <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-white" />
              </div>
            )}

            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    {name ? name[0].toUpperCase() : "?"}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">{name}</h3>
                  <p className="text-sm text-muted-foreground">Subtext</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={deleteMsgs}>
                  <Trash2Icon />
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
                  key={`${message.id}-${index}`}
                  className={cn(
                    "flex",
                    message.sender === sender ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[70%] p-3 rounded-2xl",
                      message.sender === sender
                        ? "bg-chat-bubble-sent text-chat-bubble-sent-foreground rounded-br-md"
                        : "bg-chat-bubble-received text-chat-bubble-received-foreground rounded-bl-md"
                    )}
                  >
                    <p className="text-sm leading-relaxed">{decryptMessage(message.message)}</p>
                    <p
                      className={cn(
                        "text-xs mt-1 opacity-70",
                        message.sender === sender ? "text-right" : "text-left"
                      )}
                    >
                      {message.sender}@{message.time}
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
        </div>
      </div>
    </div>
  );
}
