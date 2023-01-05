import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import type { AppProps } from "next/app";
import Link from "next/link";
import { Provider } from "react-redux";
import { store, wrapper } from "../store/store";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Provider store={store}>
        <AppBar>
          <Toolbar>
            <Link href="/">
              <img width="32" height="32" src="/debt.png" />
            </Link>
          </Toolbar>
        </AppBar>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default wrapper.withRedux(MyApp);
