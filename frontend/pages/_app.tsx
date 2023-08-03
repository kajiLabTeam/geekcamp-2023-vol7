import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Noto_Sans_JP } from "next/font/google";
import { RecoilRoot } from "recoil";

const noto = Noto_Sans_JP({ subsets: ["latin"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={noto.className}>
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </div>
  );
}
