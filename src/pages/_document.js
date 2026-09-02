import Document, { Html, Head, Main, NextScript } from 'next/document';
import { SITE_ORGANIZATION } from '../lib/site';
import { themeInitScript } from '../lib/theme';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content={SITE_ORGANIZATION} />
          <meta name="color-scheme" content="light dark" />
          <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
