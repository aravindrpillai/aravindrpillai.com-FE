import { useEffect, useState } from "react";
import ContactList from "@/components/chat/ContactList";
import ChatWindow from "@/components/chat/ChatWindow";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useChatContext } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import ApiClient from '@/lib/api';

export default function Chat() {
  const navigate = useNavigate();
  
  const [errorMsg, setErrorMsg] = useState("");
  const { sender, recipient } = useParams();
  const [isContactsOpen, setIsContactsOpen] = useState(!recipient);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [username, setUsername] = useState(sender || "");
  const [pincode, setPincode] = useState("");
  const { setUser, token } = useChatContext();

  useEffect(() => {
    if (sender === "undefined" || sender === undefined || sender === null || sender === "" || token === undefined || token === null || token === "" || !token || !sender) {
      if(sender === "undefined"){
        setUsername("")        
      }
      setIsModalOpen(true);
    } else {
      setUsername(sender || "")
      setIsModalOpen(false);
      setIsContactsOpen(!recipient)
    }
  }, [sender, recipient, token]);


    
    async function handleLogin() {
      try {
        const url = ApiClient.buildFullUrl(import.meta.env.VITE_CHAT_USER_AUTH);
        const requestData = { "name": username, "code": pincode }
        let { status, data, error } = await ApiClient.post(url, requestData)
        if(status < 300){
          setUser(data.id, data.name, data.token)
          setIsModalOpen(false)
          navigate("/chat/"+data.name+"/with")
        }else{
          setErrorMsg(error[0])
        }
      } catch (error) {
        setErrorMsg(error)
        console.error('Failed to Authenticate:', error);
      }
    }

  return (
    <div className="h-screen bg-background flex">
      {/* Contact list (Desktop) */}
      <div className="hidden md:block w-80 flex-shrink-0">
        <ContactList setIsContactsOpenHandlerFromCOntactList={setIsContactsOpen} />
      </div>

      {/* Mobile Contact List Sheet */}
      <Sheet open={isContactsOpen} onOpenChange={setIsContactsOpen}>
        <SheetContent side="left" className="w-80 p-0">
          <ContactList setIsContactsOpenHandlerFromCOntactList={setIsContactsOpen} />
        </SheetContent>
      </Sheet>

      {/* Chat Window */}
      <div className="flex-1">
        {recipient ? (
          <ChatWindow setIsContactsOpenHandler={()=>{setIsContactsOpen(!isContactsOpen)}} unauthorisedHandler={()=>{setIsModalOpen(true)}}/>
        ) : (
          <div className="h-full flex items-center justify-center bg-card">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-card-foreground mb-2">
                Welcome to Chat
              </h2>
              <p
                className="text-muted-foreground cursor-pointer"
                onClick={() => {
                  setIsContactsOpen(!isContactsOpen);
                }}
              >
                Select a contact to start messaging
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modal for missing sender */}
      <Dialog open={isModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            {errorMsg && <font color='red'>{errorMsg}</font>}
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="Pincode"
              type="password"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
            />
            <Button className="w-full" onClick={handleLogin}>
              Submit
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
