import { Helmet } from "react-helmet";
import "./home.css";

export default function Home() {
  return (
    <>
      <Helmet>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          rel="icon"
          href="/logo.png"
        />
        <title>Aravind R Pillai</title>
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

      {/* Page content */}
      <div className="container mt-5">
        <div className="row d-flex justify-content-center">
          <div className="col-md-7">
            <div className="card p-3 py-4">
              <center>
                <img
                  src="/logo.png"
                  width="100"
                  height="100"
                  className="rounded-circle"
                  alt="profile"
                />
              </center>
              <div className="text-center mt-3">
                <h5 className="mt-2 mb-0">Aravind Ramachandran Pillai</h5>
                <span>
                  Fullstack Developer | Science Enthusiast | Hobbyist Photographer
                </span>
                <br />
                <br />
                <div className="px-4 mt-1">
                  <p className="fonts">
                    Hello there, I'm a full-stack developer with a love for exploring the world and capturing its beauty through my lens. My obsession with coding is like a never-ending romance that just keeps getting stronger with each new technology I learn.
                    <br /><br />

                    I have an undying passion for photography, constantly seeking out new destinations to explore and capture their beauty through my lens.
                    However, despite my best efforts, my wife often teases me that my <a target="new" href="https://www.instagram.com/clicks.and.chaos.by.arp"><b>photography skills</b></a> are hit or miss - and to be honest,
                    it's usually more miss than hit. But I don't let that stop me from snapping away!
                    <br /><br />


                    As a firm believer in the power of science, I'd rather roll up my sleeves and get into some research and experiments
                    rather than wasting time on prayers.
                    I'm more likely to put my faith in the trusty scientific method than any divine intervention.
                    <br /><br />
                    Originally hailing from the southern part of Kerala-India, I've now planted my roots in Canada after a brief chapter in the UK,
                    but who knows where my wanderlust will lead me next?

                    When I'm not busy coding or globe-trotting, I can be found at home (attempting to win debates with my charming wife)
                    and devising ways to blend my passions.

                    My ultimate goal? It's a work in progress, so stay tuned for updates!
                    Feeling curious?
                    Go ahead and click those icons below to take a closer peek into my world.
                    Don't worry, it's not creepy if I've given you permission, right?

                    <br /><br />
                    And finally, If you've ever felt the urge to share something with me without the fuss of revealing your true identity, look no further.
                    Just click on the link <a href="http://aravindrpillai.com/anonymous"><b>here</b></a> and spill the beans. Also, if you're interested in the stock market,
                    don't forget to check out my prediction analyzer here. <a target="new" href="http://stk.aravindrpillai.com"><b>LongTerm</b></a> | <a target="new" href="http://intraday.aravindrpillai.com"><b>Intraday</b></a>.


                  </p>
                </div>
                <br />

                <center>
                  <table className="social-list">
                    <tbody>
                      <tr>
                        <td>
                          <a
                            target="new"
                            href="https://github.com/aravindrpillai"
                          >
                            <i className="fa fa-github fa-2x"></i>
                          </a>
                        </td>
                        <td style={{ paddingLeft: "15px" }}>
                          <a
                            target="new"
                            href="https://linkedin.com/in/aravindrpillai1992"
                          >
                            <i className="fa fa-linkedin fa-2x"></i>
                          </a>
                        </td>
                        <td style={{ paddingLeft: "15px" }}>
                          <a
                            target="new"
                            href="https://facebook.com/aravind.pillai.948"
                          >
                            <i className="fa fa-facebook fa-2x"></i>
                          </a>
                        </td>
                        <td style={{ paddingLeft: "15px" }}>
                          <a
                            target="new"
                            href="https://instagram.com/aravind.ramachandran.pillai/"
                          >
                            <i className="fa fa-instagram fa-2x"></i>
                          </a>
                        </td>
                        <td style={{ paddingLeft: "15px" }}>
                          <a target="new" href="https://wa.me/+919447020535">
                            <i className="fa fa-whatsapp fa-2x"></i>
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </center>
                <br />
                <hr />
                <ul className="footer-list">
                  <li>
                    <i className="fa fa-phone"> +44-7767991693 &nbsp;|&nbsp; </i>
                  </li>
                  <li>
                    <i className="fa fa-phone"> +91-9447020535 &nbsp;|&nbsp; </i>
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
