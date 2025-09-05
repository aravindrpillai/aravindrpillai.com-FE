import { useState } from "react";
import { Helmet } from "react-helmet";
import "./style.css";
import ApiClient from "@/lib/api";

export default function AnonymousPage() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const resetMessage = () => {
    setMessage("");
    setStatus("");
  };

  const sendMessage = async () => {
    const msg = message.trim();
    if (!msg) {
      setStatus(<span style={{ color: "red" }}>Please enter some message.</span>);
      return;
    }

    setStatus(<span style={{ color: "blue" }}>Sending message. Please wait...</span>);

    try {
      let headers = { "Content-Type": "application/json", token: "1234" };
      let url = ApiClient.buildFullUrl(import.meta.env.VITE_ANONYMOUS)
      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ message: msg }),
      });
      const respData = await response.json();
      
      if (response.ok) {
        setStatus(<span style={{ color: "green" }}>Your message has been sent</span>);
        setMessage("");
      } else {
        setStatus(<span style={{ color: "red" }}>Failed</span>);
      }
    } catch (err) {
      console.error("Request error", err);
      setStatus(<span style={{ color: "red" }}>Error sending message</span>);
    }
  };

  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Aravind R Pillai</title>
        <link
          rel="icon"
          href="https://s3.ap-south-1.amazonaws.com/aravindrpillai.com/arp.jpg"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"
        />
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
      </Helmet>

      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7">
            <div className="card p-3 py-4">
              
              <center>
                <img
                  src="https://s3.ap-south-1.amazonaws.com/aravindrpillai.com/arp2.jpg"
                  width="100"
                  height="100"
                  className="rounded-circle"
                  alt="profile"
                />
              </center>

              <div className="text-center mt-3">
                <h5 className="mt-2 mb-0">Ready to spill the beans?</h5>
                <span>Don't worry! You are completely anonymous</span>
                <br />
                <div>{status}</div>
                <br />
                <div className="px-4 mt-1">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="input-box"
                    placeholder="Type here..."
                  />
                  <br />
                  <div className="buttons">
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={resetMessage}
                    >
                      Reset
                    </button>
                    &nbsp;&nbsp;
                    <button
                      className="btn btn-outline-primary px-4"
                      onClick={sendMessage}
                    >
                      Submit
                    </button>
                  </div>
                </div>
                <br />
                <center>
                  Back to{" "}
                  <a href="http://aravindrpillai.com">aravindrpillai.com</a>
                </center>
                <br />
                <hr />
                <ul className="footer-list">
                  <li>
                    <i className="fa fa-phone"> +1 (416) 854-7092 &nbsp;|&nbsp; </i>
                  </li>
                  <li>
                    <i className="fa fa-phone"> +91-944-702-0535 &nbsp;|&nbsp; </i>
                  </li>
                  <li>
                    <i className="fa fa-at"> hello@aravindrpillai.com</i>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
