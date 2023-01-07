import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { appWithTranslation, useTranslation, i18n } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { Provider } from "react-redux";
import { store, wrapper } from "../store/store";
import "../styles/globals.css";
import nextI18NextConfig from "../next-i18next.config";

if (process.env.NODE_ENV !== "production") {
  if (typeof window !== "undefined") {
    const { applyClientHMR } = require("i18next-hmr/client");
    applyClientHMR(() => i18n);
  } else {
    const { applyServerHMR } = require("i18next-hmr/server");
    applyServerHMR(() => i18n);
  }
}

function MyApp({ Component, pageProps }: AppProps) {
  const { t } = useTranslation(["common"]);

  return (
    <>
      <Head>
        <title>{t("meta.title")}</title>
        <meta name="description" content={t("meta.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Provider store={store}>
        <AppBar>
          <Toolbar>
            <Link href="/">
              <img width="32" height="32" src="/debt.png" alt="logo" />
            </Link>
          </Toolbar>
        </AppBar>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp, nextI18NextConfig));
