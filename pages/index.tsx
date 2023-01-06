import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Head from "next/head";
import Link from "next/link.js";

export default function Home() {
  return (
    <div className="h-screen">
      <Head>
        <title>
          Lånekalkulator, budsjetthjelp og tips til refinansiering av kreditt
        </title>
        <meta
          name="description"
          content="Har du lite oversikt over økonomien? Prøv vår lånekalkulator for å se når du kan bli gjeldsfri."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="h-5/6 text-center">
        <Paper className="h-full w-full pt-40">
          <Paper className="h-1/3 flex flex-col justify-center">
            <div>
              <Button LinkComponent={Link} href="calculator">
                Lets get started!
              </Button>
            </div>
          </Paper>
        </Paper>
      </main>

      <footer className="h-1/6">
        <Paper className="h-full p-4 flex flex-col-reverse" elevation={6}>
          <div className="flex flex-row justify-between">
            <a
              href="https://www.flaticon.com/free-icons/debt"
              title="Page icon"
            >
              Page icon created by Freepik - Flaticon
            </a>
          </div>
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
