import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import QuickChat from "./pages/qchat/QuickChat";
import Anonymous from "./pages/anonymous/Index";
import ReadAnonymous from "./pages/anonymous/Read";
import TextBoxPage from "./pages/textbox/Index";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          
          <Route path="qchat/:name?/:sender?" element={<QuickChat />} />
          
          <Route path="anonymous" element={<Anonymous />} />
          <Route path="anonymous/read" element={<ReadAnonymous />} />
          
          <Route path="textbox/:code?" element={<TextBoxPage />} />
        
          <Route path="/" element={<Home />} />
        
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>

);

export default App;