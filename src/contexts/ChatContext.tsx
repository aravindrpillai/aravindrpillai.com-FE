import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const ChatContext = createContext(undefined);

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [id, setId] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setId(localStorage.getItem("id"));
    setName(localStorage.getItem("name"));
    setToken(localStorage.getItem("token"));
  }, []);

  const setUser = (newId: string, newName: string, newToken: string) => {
    setId(newId);
    setName(newName);
    setToken(newToken);

    localStorage.setItem("id", newId);
    localStorage.setItem("name", newName);
    localStorage.setItem("token", newToken);
  };

  const clearUser = () => {
    setId(null);
    setName(null);
    setToken(null);

    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("token");
  };

  return (
    <ChatContext.Provider value={{ id, name, token, setUser, clearUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used inside ChatProvider");
  }
  return context;
};
