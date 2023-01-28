import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Calculate from "@mui/icons-material/Calculate";
import Chat from "@mui/icons-material/Chat";
import Handshake from "@mui/icons-material/Handshake";
import Home from "@mui/icons-material/Home";
import Language from "@mui/icons-material/Language";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { createTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import ThemeProvider from "@mui/system/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
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

let rootElement = undefined;
if (typeof window === "object") {
  rootElement = document != null ? document.getElementById("__next") : undefined;
}

const theme = createTheme({
  palette: {
    primary: {
      main: "rgb(12 74 110)",
    },
  },
  typography: {
    h1: {
      fontSize: "4rem",
    },
  },
  breakpoints: {
    values: {
      // https://tailwindcss.com/docs/responsive-design
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
  components: {
    MuiPopover: {
      defaultProps: {
        container: rootElement,
      },
    },
    MuiPopper: {
      defaultProps: {
        container: rootElement,
      },
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { t } = useTranslation(["common"]);
  const closeMenu = () => setAnchorEl(null);

  const menuItems = [
    {
      group: t("menu.groups.sites"),
      links: [
        {
          href: `/`,
          locale: router.locale,
          selected: router.pathname === "/",
          text: t("menu.links.home"),
          icon: <Home color="primary" />,
        },
        {
          href: `/kalkulator`,
          locale: router.locale,
          selected: router.pathname === "/kalkulator",
          text: t("menu.links.calculator"),
          icon: <Calculate color="primary" />,
        },
        {
          href: `/takk-til`,
          locale: router.locale,
          selected: router.pathname === "/takk-til",
          text: t("menu.links.contributions"),
          icon: <Handshake color="primary" />,
        },
        {
          href: `/kontakt-oss`,
          locale: router.locale,
          selected: router.pathname === "/kontakt-oss",
          text: t("menu.links.feedback"),
          icon: <Chat color="primary" />,
        },
      ],
    },
    {
      group: t("menu.groups.languages"),
      links: [
        {
          href: router.pathname,
          locale: "nb",
          selected: router.locale === "nb",
          text: "Norsk",
          icon: <Language fontSize="small" />,
        },
        {
          href: router.pathname,
          locale: "en-US",
          selected: router.locale === "en-US",
          text: "English",
          icon: <Language fontSize="small" />,
        },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Lånekalkulator, budsjetthjelp og tips til refinansiering av kreditt</title>
        <meta
          name="description"
          content="Har du lite oversikt over økonomien? Prøv vår lånekalkulator for å se når du kan bli gjeldsfri."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <AppBar color="primary" elevation={0}>
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                className="text-white"
                color="inherit"
                aria-label="open drawer"
                onClick={(e) => setAnchorEl(e.currentTarget)}
              >
                <MenuIcon />
              </IconButton>
              <Menu anchorEl={anchorEl} open={open} onClose={closeMenu} disableScrollLock={true}>
                {menuItems.map(({ group, links }, i) => (
                  <div key={i}>
                    <Divider textAlign="left">
                      <Typography fontSize="small">{group}</Typography>
                    </Divider>
                    {links.map(({ href, locale, icon, text, selected }, j) => (
                      <MenuItem
                        key={j}
                        sx={{
                          backgroundColor: selected ? theme.palette.warning.light : "inherit",
                        }}
                        disabled={selected}
                        component={Link}
                        href={href}
                        locale={locale}
                        onClick={closeMenu}
                      >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText>{text}</ListItemText>
                      </MenuItem>
                    ))}
                  </div>
                ))}
              </Menu>
            </Toolbar>
          </AppBar>
          <div className="min-h-screen flex flex-col justify-between">
            <main className="relative pt-20 flex-grow">
              <Component {...pageProps} />
              <Analytics />
            </main>
            <AppBar
              component="footer"
              color="primary"
              position="static"
              elevation={0}
              className="text-white"
            >
              <Toolbar>
                <div className="text-center w-full">
                  <Button LinkComponent={Link} href="/kontakt-oss" className="text-white">
                    {t("common:footer.feedback")}
                  </Button>
                </div>
              </Toolbar>
            </AppBar>
          </div>
        </Provider>
      </ThemeProvider>
    </>
  );
}

export default wrapper.withRedux(appWithTranslation(MyApp, nextI18NextConfig));
