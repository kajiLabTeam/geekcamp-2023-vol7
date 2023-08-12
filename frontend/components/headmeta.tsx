import Head from "next/head";

const TITLE = "wisdom Tree";
const DESCRIPTION = "wisdom Tree は知ってる単語から知らない単語を視覚的に見つけられるサービスです";
const SITE_URL = "https://wisdom-tree.vercel.app/";
const IMG_URL = "https://wisdom-tree.vercel.app/images/ogp.png";

export default function HeadMeta () {
  return (
    <Head>
      <title>{TITLE}</title>

      <meta property="og:title" content={TITLE} />
      <meta property="og:description" content={DESCRIPTION} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={SITE_URL} />
      <meta property="og:image" content={IMG_URL} />
      <meta property="og:site_name" content={TITLE} />
      <meta name="twitter:image" content="summary" />
    </Head>
  )
}
