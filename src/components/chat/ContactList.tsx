import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import ApiClient from '@/lib/api';
import { Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function ContactList({setIsContactsOpenHandlerFromCOntactList}) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState([])
  const [errorMsg, setErrorMsg] = useState(null)
  const { sender, recipient } = useParams();

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        setLoading(true);
        const url = ApiClient.buildFullUrl(import.meta.env.VITE_CHAT_RECIPIENTS);
        let { status, data, error } = await ApiClient.get(url);
        if(status < 300){
          setContacts(data)
        }
        else if(status === 403){
          setErrorMsg("unauthorised!!")
        }else {
          setErrorMsg(error[0])
        }
      } catch (error) {
        console.error("Failed to load recipients:", error);
        setErrorMsg(error)
      } finally {
        setLoading(false);
      }
    };
    fetchRecipients();
  }, []);



  return (
    <div className="h-full bg-chat-sidebar border-r border-border">

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}


      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-chat-sidebar-foreground">Messages</h2>
      </div>

      <div className="overflow-y-auto">

    {errorMsg && <div
      key={"errorid"}
      className="flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-chat-sidebar-hover">
      {errorMsg}
    </div>}

        {contacts.map((contact) => (
          <div
            key={contact.id}
            onClick={() => { setIsContactsOpenHandlerFromCOntactList(false); navigate("/chat/" + sender + "/with/" + contact.name) }}
            className={cn(
              "flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-chat-sidebar-hover",
              recipient === contact.name && "bg-chat-sidebar-hover"
            )}
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                {contact.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div
                className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-chat-sidebar",
                  contact.isOnline ? "bg-chat-online" : "bg-chat-offline"
                )}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-chat-sidebar-foreground truncate">
                  {contact.name}
                </h3>

                {/* <span className="text-xs text-muted-foreground">
                  {contact.timestamp}
                </span>
                 */}
              </div>
              <div className="flex items-center justify-between">
                {/* <p className="text-sm text-muted-foreground truncate">
                  Test
                </p> */}
                {contact.unread_msgs && (contact.unread_msgs > 0) &&
                  <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                    {contact.unread_msgs} unread msg(s)
                  </span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}