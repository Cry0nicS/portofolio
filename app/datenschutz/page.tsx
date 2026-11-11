import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Datenschutz",
  alternates: { canonical: "/datenschutz" },
  openGraph: { url: "/datenschutz", title: "Datenschutz" },
  robots: { index: false },
};

export default function Datenschutz() {
  return (
    <article className="wrap legal" lang="de">
      <h1>Datenschutz</h1>
      <p>
        Kurzfassung: Diese Website setzt keine Cookies, nutzt kein Tracking und
        lädt keine Inhalte von Drittanbietern nach.
      </p>

      <h2>Verantwortlicher</h2>
      <p>
        Adrian Popescu, Anschrift siehe <Link href="/impressum">Impressum</Link>
        . E-Mail: <a href="mailto:hi@adrianpopescu.dev">hi@adrianpopescu.dev</a>
      </p>

      <h2>Hosting und Server-Logs</h2>
      <p>
        Die Website wird bei Vercel Inc., 440 N Barranca Ave #4133, Covina, CA
        91723, USA gehostet. Beim Aufruf verarbeitet Vercel technisch notwendige
        Daten wie IP-Adresse, Zeitpunkt, aufgerufene Seite und
        Browser-Informationen, um die Seite auszuliefern und den Betrieb
        abzusichern. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO
        (berechtigtes Interesse an einem sicheren und stabilen Betrieb). Dabei
        können Daten in die USA übermittelt werden; Vercel ist unter dem EU-US
        Data Privacy Framework zertifiziert.
      </p>

      <h2>Cookies, Tracking und lokale Einstellungen</h2>
      <p>
        Es werden keine Cookies gesetzt und keine Analyse- oder Tracking-Dienste
        eingesetzt. Wenn Sie das Farbschema ändern, wird diese Auswahl
        ausschließlich lokal in Ihrem Browser gespeichert (localStorage) und
        nicht an mich oder Dritte übertragen. Sie können sie jederzeit über die
        Browser-Einstellungen löschen.
      </p>

      <h2>Schriftarten</h2>
      <p>
        Die Schriftarten Geist Sans und Geist Mono werden von dieser Domain
        ausgeliefert. Es findet keine Verbindung zu Google Fonts oder anderen
        Schrift-Diensten statt.
      </p>

      <h2>Kontakt per E-Mail</h2>
      <p>
        Wenn Sie mir eine E-Mail schreiben, verarbeite ich Ihre Angaben, um die
        Anfrage zu beantworten (Art. 6 Abs. 1 lit. f DSGVO). Die Nachrichten
        werden gelöscht, sobald sie für diesen Zweck nicht mehr erforderlich
        sind.
      </p>

      <h2>Externe Links</h2>
      <p>
        Links zu LinkedIn, GitHub und den vorgestellten Projekten sind einfache
        Verweise. Daten werden erst übertragen, wenn Sie einen Link anklicken;
        dann gilt die Datenschutzerklärung des jeweiligen Anbieters.
      </p>

      <h2>Ihre Rechte</h2>
      <ul>
        <li>Auskunft, Berichtigung und Löschung (Art. 15 bis 17 DSGVO)</li>
        <li>Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
        <li>Datenübertragbarkeit (Art. 20 DSGVO)</li>
        <li>Widerspruch gegen die Verarbeitung (Art. 21 DSGVO)</li>
        <li>
          Beschwerde bei einer Aufsichtsbehörde, zum Beispiel bei der Berliner
          Beauftragten für Datenschutz und Informationsfreiheit
        </li>
      </ul>
    </article>
  );
}
