import Head from 'next/head'
import AppChartComponent from '../components/app-chart-component'
import AppLoansComponent from '../components/app-loans-component'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className='m-4'>
        <div className='flex flex-row min-h-screen'>
          <div className="basis-1/2 bg-slate-300 p-1 rounded"><AppLoansComponent /></div>
          <div className="basis-1/2 px-15 py-20 h-screen w-1/2 fixed right-0 top-1/2 -translate-y-1/2"><AppChartComponent /></div>
        </div>
      </main>

      <footer>
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
  )
}