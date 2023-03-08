import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="ja" prefix="og: http://ogp.me/ns#">
            <Head>
                <link rel="icon" href="/favicons/favicon.ico" />
                <meta name="author" content="hamao" />
                <meta
                    name="description"
                    content="英単語をタイピングで練習するアプリです。4つのモードで英単語の暗記とタイピングの練習を同時に行うことができます。単語はTOEFL用のものです"
                ></meta>
                <meta
                    name="og:description"
                    content="英単語をタイピングで練習するアプリです。4つのモードで英単語の暗記とタイピングの練習を同時に行うことができます。単語はTOEFL用のものです"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
