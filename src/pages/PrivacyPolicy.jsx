import { useTranslation } from "react-i18next";
import "../styles/PrivacyPolicy.css";

function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <main className="privacy-page">

      <section className="privacy-content">

        <h1>{t("privacy.title")}</h1>

        <p className="privacy-updated">
          {t("privacy.updated")}
        </p>

        <section>
          <h2>{t("privacy.responsibleTitle")}</h2>
          <p>{t("privacy.responsibleText")}</p>
        </section>

        <section>
          <h2>{t("privacy.dataTitle")}</h2>
          <p>{t("privacy.dataText")}</p>
        </section>

        <section>
          <h2>{t("privacy.purposeTitle")}</h2>
          <p>{t("privacy.purposeText")}</p>
        </section>

        <section>
          <h2>{t("privacy.legalTitle")}</h2>
          <p>{t("privacy.legalText")}</p>
        </section>

        <section>
          <h2>{t("privacy.providersTitle")}</h2>
          <p>{t("privacy.providersText")}</p>
        </section>

        <section>
          <h2>{t("privacy.retentionTitle")}</h2>
          <p>{t("privacy.retentionText")}</p>
        </section>

        <section>
          <h2>{t("privacy.unsubscribeTitle")}</h2>
          <p>{t("privacy.unsubscribeText")}</p>
        </section>

        <section>
          <h2>{t("privacy.rightsTitle")}</h2>
          <p>{t("privacy.rightsText")}</p>
        </section>

        <section>
          <h2>{t("privacy.securityTitle")}</h2>
          <p>{t("privacy.securityText")}</p>
        </section>

        <section>
          <h2>{t("privacy.changesTitle")}</h2>
          <p>{t("privacy.changesText")}</p>
        </section>

      </section>

    </main>
  );
}

export default PrivacyPolicy;