import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";

export default function LandingPage() {
  const { t } = useTranslation(["common", "landing"]);

  return (
    <div className="h-screen">
      <main className="h-5/6 text-center">
        <Paper className="h-full w-full pt-40">
          <Paper className="h-1/3 flex flex-col justify-center">
            <div>
              <Button LinkComponent={Link} href="/kalkulator">
                {t("landing:landing")}
              </Button>
            </div>
          </Paper>
        </Paper>
      </main>

      <footer className="h-1/6">
        <Paper className="h-full p-4 flex flex-col-reverse" elevation={6}>
          <div className="flex flex-row justify-between"></div>
        </Paper>
      </footer>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["common", "landing"])),
    },
  };
}
