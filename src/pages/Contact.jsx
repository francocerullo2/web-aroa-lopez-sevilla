import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/Contact.css";

import instagramIcon from "../assets/images/instagram.svg";
import pinterestIcon from "../assets/images/pinterest.svg";
import tiktokIcon from "../assets/images/tiktok.svg";

function Contact() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [messageSent, setMessageSent] = useState(
    new URLSearchParams(location.search).get("sent") === "true"
  );

  useEffect(() => {
    if (messageSent) {
      const timer = setTimeout(() => {
        setMessageSent(false);
        navigate("/contacto", { replace: true });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [messageSent, navigate]);

  const params = new URLSearchParams(location.search);
  const pieza = params.get("pieza");

  const subject = pieza
    ? t("contact.pieceSubject", { piece: pieza })
    : "";

  const message = pieza
    ? t("contact.pieceMessage", { piece: pieza })
    : "";

  return (
    <main className="contact-page">

      {/* INTRO CONTACTO */}

      <section className="contact-intro">

        <h1>{t("contact.title")}</h1>

        <div className="contact-text">

          <p>
            {t("contact.introStart")}{" "}
            <a href="mailto:aroalopezsevilla@gmail.com">
              aroalopezsevilla@gmail.com
            </a>{" "}
            {t("contact.introEnd")}
          </p>

          <p>
            {t("contact.instagramText")}
          </p>

        </div>

        <div className="contact-socials">

          <p>{t("contact.followUs")}</p>

          <div className="contact-social-icons">

            <a
              href="https://www.instagram.com/aroalopezsevilla?igsi=MWdzaGJleWZta3lscA%3D%3D&utm_source=qr"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <img src={instagramIcon} alt="Instagram" />
            </a>

            <a
              href="https://pin.it/E1l1a9iJR"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
            >
              <img src={pinterestIcon} alt="Pinterest" />
            </a>

            <a
              href="https://www.tiktok.com/@aroalopezsevilla?_r=1&_t=ZS-99N849b0q0I"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
            >
              <img src={tiktokIcon} alt="TikTok" />
            </a>

          </div>

        </div>

      </section>


      {/* FORMULARIO */}

      <section className="contact-form-section">

        {messageSent && (
          <p className="contact-success">
            {t("contact.success")}
          </p>
        )}

        <form
          className="contact-form"
          action="https://formsubmit.co/aroalopezsevilla@gmail.com"
          method="POST"
        >

          <input
            type="hidden"
            name="_next"
            value={`${window.location.origin}/contacto?sent=true`}
          />

          <input
            type="hidden"
            name="_subject"
            value="Nueva consulta desde Aroa López Sevilla"
          />

          <input
            type="hidden"
            name="_template"
            value="table"
          />

          <input
            type="hidden"
            name="_captcha"
            value="false"
          />

          <input
            type="hidden"
            name="_replyto"
            value="email"
          />


          <div className="form-row">

            <div className="form-group">

              <label htmlFor="firstName">
                {t("contact.firstName")}{" "}
                <span>({t("contact.required")})</span>
              </label>

              <input
                type="text"
                id="firstName"
                name="Nombre"
                required
              />

            </div>


            <div className="form-group">

              <label htmlFor="lastName">
                {t("contact.lastName")}{" "}
                <span>({t("contact.required")})</span>
              </label>

              <input
                type="text"
                id="lastName"
                name="Apellidos"
                required
              />

            </div>

          </div>


          <div className="form-group">

            <label htmlFor="email">
              {t("contact.email")}{" "}
              <span>({t("contact.required")})</span>
            </label>

            <input
              type="email"
              id="email"
              name="email"
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="subject">
              {t("contact.subject")}{" "}
              <span>({t("contact.required")})</span>
            </label>

            <input
              type="text"
              id="subject"
              name="Asunto"
              defaultValue={subject}
              required
            />

          </div>


          <div className="form-group">

            <label htmlFor="message">
              {t("contact.message")}{" "}
              <span>({t("contact.required")})</span>
            </label>

            <textarea
              id="message"
              name="Mensaje"
              defaultValue={message}
              required
            ></textarea>

          </div>


          <button type="submit" className="contact-submit">
            {t("contact.send")}
          </button>

        </form>

      </section>


      {/* NEWSLETTER */}

      <section className="newsletter">

        <div className="newsletter-content">

          <div className="newsletter-text">

            <h2>{t("home.newsletter.title")}</h2>

            <p>
              {t("home.newsletter.text")}
            </p>

          </div>


          <div className="newsletter-form-wrapper">

            <form className="newsletter-form">

              <input
                type="email"
                placeholder={t("home.newsletter.placeholder")}
                aria-label={t("contact.email")}
              />

              <button type="submit">
                {t("home.newsletter.button")}
              </button>

            </form>


            <a
              href="/politica-privacidad"
              className="newsletter-privacy"
            >
              {t("home.newsletter.privacy")}
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}

export default Contact;