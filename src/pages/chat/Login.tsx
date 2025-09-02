import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useParams } from "react-router-dom";
import ApiClient from '@/lib/api';
import { useChatContext } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";


export default function Login(){
  const [penName, setPenName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const { username } = useParams();
  const { setUser } = useChatContext();
  const navigate = useNavigate();


  useEffect(() => {
    setPenName(username || '')
  },[username])

  const handleReset = () => {
    setPenName("");
    setAccessCode("");
  };

  async function handleLogin() {
    try {
      const url = ApiClient.buildFullUrl(import.meta.env.VITE_CHAT_USER_AUTH);
      const requestData = { "name": penName, "code": accessCode }
      const data = await ApiClient.post(url, requestData)
      setUser(data.id, data.name, data.token)
      navigate("/chat/"+data.name+"/with")
    } catch (error) {
      setErrorMsg(error[0])
      console.error('Failed to Authenticate:', error);
    }
  }

  const handleAccessCodeChange = (value: string) => {
    const cleanValue = value.replace(/\D/g, '').slice(0, 4);
    setAccessCode(cleanValue);
  };


  const isLoginEnabled = penName.trim() && accessCode.length === 4;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Privacy Matters!</CardTitle>
          <p className="text-muted-foreground">Please sign in to continue</p>
          {errorMsg && <font color='red'>{errorMsg}</font>}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="penname">Pen Name</Label>
            <Input
              id="penname"
              type="text"
              placeholder="Enter your pen name"
              value={penName}
              onChange={(e) => setPenName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="accesscode">Access Code</Label>
            <div className="space-y-2">
              <Input
                id="accesscode"
                type="text"
                placeholder="Enter 4-digit code"
                value={accessCode}
                onChange={(e) => handleAccessCodeChange(e.target.value)}
                maxLength={4}
              />
              
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="flex-1"
              onClick={handleLogin}
              disabled={!isLoginEnabled}
            >
              Login
            </Button>
          </div>

          <div className="text-center space-y-4">
            <a
              href="http://aravindrpillai.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary hover:underline"
            >
              Visit aravindrpillai.com
            </a>
          </div>
        </CardContent>
      </Card>

    
    </div>
  )
}