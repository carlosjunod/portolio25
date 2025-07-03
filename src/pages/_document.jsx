import Document, { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document to augment the application <html> and <body> tags
 */
export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Fonts */}
          <link
            href="https://fonts.googleapis.com/css2?family=Lexend:ital,wght@0,100;0,400;1,400&family=MuseoModerno:wght@900&display=swap"
            rel="stylesheet"
          />
          {/* Font Awesome Free Brands */}
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          />
          <meta name="description" content="Carlos Junod Portfolio" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}