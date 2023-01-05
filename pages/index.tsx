import Head from "next/head";
import { useState } from "react";
import AppDebtInsightComponent from "../components/app-debt-insight";
import AppUserInputComponent from "../components/app-user-input-component";

export default function Home() {
  const [tab, setTab] = useState(0);

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <div className="min-h-screen">
          <div className="w-full xl:w-1/2 xl:min-h-screen mb-4 xl:mb-0 bg-slate-100 xl:p-1 rounded">
            <AppUserInputComponent />
          </div>
          <div className="w-full xl:w-1/2 static h-96 xl:h-screen xl:fixed xl:top-0 xl:bottom-0 xl:right-0">
            <AppDebtInsightComponent />
          </div>
        </div>
      </main>

      <footer></footer>

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
