import { useEffect, useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import ApiClient from "@/lib/api";

export default function ReadAnonymous() {

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code || code === "" || code === null || code === undefined) {
      let c = prompt("Enter Password")
      setCode(c)
    } else {
      getMessages()
    }
  }, [code])


  async function getMessages() {
    let headers = { "Content-Type": "application/json", token: code };
    let formattedData: any[] = [];
    try {
      setLoading(true);
      const url = ApiClient.buildFullUrl(import.meta.env.VITE_ANONYMOUS);
      let respAPIData = await fetch(url, { method: "GET", headers });
      const respData = await respAPIData.json();
      if (respAPIData.status < 300) {
        setData(respData.data)
      } else {
        setCode("");
        setData([])
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setLoading(false);
    }
    return formattedData;
  }



  const [data, setData] = useState([
    { id: 1, title: "First Note", message: "This is the first message content." },
    { id: 2, title: "Second Note", message: "This is another message." },
    { id: 3, title: "Third Note", message: "Some more details go here." },
  ]);

  async function handleDelete(id: number){
    if (window.confirm("Are you sure you want to delete this item?")) {
      let headers = { "Content-Type": "application/json", token: code };
      const url = ApiClient.buildFullUrl(import.meta.env.VITE_ANONYMOUS+"?id="+id);
      let respAPIData = await fetch(url, { method: "DELETE", headers });
      const respData = await respAPIData.json();
      if (respAPIData.status < 300) {
        setData((prev) => prev.filter((item) => item.id !== id));
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Loader2 className="h-10 w-10 animate-spin text-white" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 rounded-lg">
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="p-4">
                  <div className="flex justify-between items-center">
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p><strong>Time:</strong> {item.time}</p>
                      <p><strong>Location:</strong> {item.location}</p>
                      <p><strong>Coordinates:</strong> {item.cordinates}</p>
                      <p><strong>ISP:</strong> {item.isp}</p>
                    </div>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700" >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <p className="text-blue-600 mt-1">{item.message}</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
