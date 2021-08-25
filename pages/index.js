import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Editor from "../components/editor"
import Arrow from "../components/arrow"

const version = "0.15.1"
const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexurgy SC</title>
        <meta name="description" content="A high-powered sound change applier"/>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Lexurgy Sound Changer
        </h1>

        <div className={styles.grid}>
          <Editor id="input" label="Input Words"/>
          <Arrow/>
          <Editor id="changes" label="Sound Changes"/>
          <Arrow/>
          <Editor id="output" label="Output"/>
        </div>

        {/*<div className={styles.grid}>*/}
        {/*  <a href="https://nextjs.org/docs" className={styles.card}>*/}
        {/*    <h2>Documentation &rarr;</h2>*/}
        {/*    <p>Find in-depth information about Next.js features and API.</p>*/}
        {/*  </a>*/}

        {/*  <a href="https://nextjs.org/learn" className={styles.card}>*/}
        {/*    <h2>Learn &rarr;</h2>*/}
        {/*    <p>Learn about Next.js in an interactive course with quizzes!</p>*/}
        {/*  </a>*/}

        {/*  <a*/}
        {/*    href="https://github.com/vercel/next.js/tree/master/examples"*/}
        {/*    className={styles.card}*/}
        {/*  >*/}
        {/*    <h2>Examples &rarr;</h2>*/}
        {/*    <p>Discover and deploy boilerplate example Next.js projects.</p>*/}
        {/*  </a>*/}

        {/*  <a*/}
        {/*    href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"*/}
        {/*    className={styles.card}*/}
        {/*  >*/}
        {/*    <h2>Deploy &rarr;</h2>*/}
        {/*    <p>*/}
        {/*      Instantly deploy your Next.js site to a public URL with Vercel.*/}
        {/*    </p>*/}
        {/*  </a>*/}
        {/*</div>*/}
      </main>

      <footer className={styles.footer}>
        Powered by <a href={releaseUrl}>Lexurgy {version}</a>
      </footer>
    </div>
  )
}
