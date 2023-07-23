import Head from "next/head";
import Header from "@/components/common/header";
import Top from "@/components/common/top";

export default function Home() {
  return (
    <>
      <Head>
        <title>NodeNote</title>
        <meta
          name="description"
          content="NodeNote is a dictionary for searching unknown words."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <Top />
      </main>
    </>
  );
}
