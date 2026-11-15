import { pageMetadata, site } from "../site";

export const metadata = pageMetadata("/impressum");

export default function Impressum() {
  return (
    <article className="wrap legal" lang="de">
      <h1>Impressum</h1>

      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Adrian Popescu
        <br />
        Willdenowstr.
        <br />
        13353 Berlin
        <br />
        Deutschland
      </p>

      <h2>Kontakt</h2>
      <p>
        E-Mail: <a href={`mailto:${site.email}`}>{site.email}</a>
      </p>

      <h2>Verantwortlich für den Inhalt gemäß § 18 Abs. 2 MStV</h2>
      <p>Adrian Popescu, Anschrift wie oben.</p>

      <h2>Haftung für Links</h2>
      <p>
        Diese Website enthält Links zu externen Websites Dritter, auf deren
        Inhalte ich keinen Einfluss habe. Für diese fremden Inhalte ist stets
        der jeweilige Anbieter oder Betreiber verantwortlich.
      </p>
    </article>
  );
}
