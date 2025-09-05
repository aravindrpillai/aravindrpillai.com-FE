import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate  } from "react-router-dom";
import ApiClient from "@/lib/api";
import "./style.css";

export default function TextBoxPage() {
  const navigate = useNavigate();
  const { code } = useParams();
  const [status, setStatus] = useState<{ text: string; color: string }>({
    text: "",
    color: "",
  });
  const [loading, setLoading] = useState(false);
  
      
  const textBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!code) {
      const enteredCode = prompt("Enter Text Code");
      if (enteredCode) {
        navigate(`/textbox/${enteredCode}`, { replace: true });
      }
    }
  }, [code, navigate]);

  useEffect(() => {
    if (code) {
      refreshData();
    }
  }, [code]);

  const handlePaste = (event: ClipboardEvent) => {
    const clipboardItems = event.clipboardData?.items;
    if (!clipboardItems) return;

    for (let item of clipboardItems) {
      if (item.type.startsWith("image/")) {
        const blob = item.getAsFile();
        if (!blob) continue;

        const reader = new FileReader();
        reader.onload = (e) => {
          const img = document.createElement("img");
          img.style.maxWidth = "100%";
          img.style.maxHeight = "300px";
          img.style.margin = "10px 0";
          img.src = e.target?.result as string;
          textBoxRef.current?.appendChild(img);
        };
        reader.readAsDataURL(blob);
        event.preventDefault();
      }
    }
  };

  useEffect(() => {
    const el = textBoxRef.current;
    if (el) {
      el.addEventListener("paste", handlePaste as any);
    }
    return () => {
      if (el) el.removeEventListener("paste", handlePaste as any);
    };
  }, []);

  const submitData = async () => {
    if (!code) return;
    setLoading(true);
    setStatus({ text: "", color: "" });
    try {
      const content = textBoxRef.current?.innerHTML || "";
      let url = ApiClient.buildFullUrl(import.meta.env.VITE_TEXTBOX, {"code":code})
      var data = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "content":content }),
      }
      const response = await fetch(url, data);
      if (response.ok) {
        setStatus({ text: "Success", color: "green" });
      } else {
        setStatus({ text: "Failed", color: "red" });
      }
    } catch (err) {
      setStatus({ text: "Failed", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!code) return;
    setLoading(true);
    setStatus({ text: "", color: "" });
    try {
      let url = ApiClient.buildFullUrl(import.meta.env.VITE_TEXTBOX, {"code":code})
      const response = await fetch(`${url}?code=${code}`);
      if (response.ok) {
        const data = await response.json();
        if (textBoxRef.current) {
          textBoxRef.current.innerHTML = data.data || "";
        }
      } else {
        setStatus({ text: "Failed to refresh content", color: "red" });
      }
    } catch (err) {
      setStatus({ text: "Failed to refresh content", color: "red" });
    } finally {
      setLoading(false);
    }
  };

  const resetData = () => {
    if (textBoxRef.current) textBoxRef.current.innerHTML = "";
  };

  return (
    <>
      <Helmet>
        <title>Aravind Text Area</title>
      </Helmet>
      <div className="container">
        <div className="button-container">
          <button id="reset" onClick={resetData}>
            Reset
          </button>
          <button id="refresh" onClick={refreshData}>
            Refresh
          </button>
          <div
            id="status-message"
            className="message"
            style={{ color: status.color }}
          >
            {status.text}
          </div>
          <button id="submit" onClick={submitData}>
            Submit
          </button>
        </div>

        <div
          ref={textBoxRef}
          id="text-box"
          className="textbox"
          contentEditable="true"
          placeholder="Enter your text, paste images, or other content here..."
        />

        {loading && (
          <div id="loading-overlay" className="loading-overlay active">
            <div>Loading...</div>
          </div>
        )}
      </div>

      <footer>
        Credits:{" "}
        <a href="http://aravindrpillai.com" target="_blank" rel="noreferrer">
          Aravind R Pillai
        </a>
      </footer>
    </>
  );
}
