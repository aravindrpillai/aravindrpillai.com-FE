import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Chat from "./pages/chat/Chat";
import Login from "./pages/chat/Login";
import { ChatProvider } from "./contexts/ChatContext";
import Home from "./pages/home/Home";
import QuickChat from "./pages/qchat/QuickChat";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          
          <Route path="qchat/:name?/:sender?" element={<QuickChat />} />
          

          <Route path="/" element={<Home />} />
          
          <Route path="chat/*"
            element={
              <ChatProvider>
                <Routes>
                  <Route path="login" element={<Login />} />
                  <Route path="login/:username" element={<Login />} />
                  <Route path=":sender" element={<Chat />} />
                  <Route path=":sender/with" element={<Chat />} />
                  <Route path=":sender/with/:recipient" element={<Chat />} />
                  <Route path="*" element={<Chat />} />
                </Routes>
              </ChatProvider>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
