import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Language from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Toolbar from "@mui/material/Toolbar";
import { appWithTranslation, i18n, useTranslation } from "next-i18next";
import type { AppProps } from "next/app";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router.js";
import { useState } from "react";
import { Provider } from "react-redux";
import nextI18NextConfig from "../next-i18next.config";
import { store, wrapper } from "../store/store";
import "../styles/globals.css";

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
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation(["common"]);
  const closeMenu = () => setAnchorEl(null);

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
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={(e) => setAnchorEl(e.currentTarget)}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={closeMenu}
              disableScrollLock={true}
            >
              <MenuItem
                component={Link}
                href={`/`}
                locale={router.locale}
                onClick={closeMenu}
              >
                <ListItemIcon>
                  <img width="20" height="20" src="/debt.png" alt="logo" />
                </ListItemIcon>
                <ListItemText>{t("menu.home")}</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem
                component={Link}
                href={`${router.pathname}`}
                locale="nb-NO"
                onClick={closeMenu}
              >
                <ListItemIcon>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText>Norsk</ListItemText>
              </MenuItem>
              <MenuItem
                component={Link}
                href={`/en-US${router.pathname}`}
                locale="en-US"
                onClick={closeMenu}
              >
                <ListItemIcon>
                  <Language fontSize="small" />
                </ListItemIcon>
                <ListItemText>English</ListItemText>
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp, nextI18NextConfig));
