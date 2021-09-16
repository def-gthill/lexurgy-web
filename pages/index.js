import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.css"

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexurgy</title>
        <link rel="icon" href="/favicon.ico"/>
      </Head>

      <main className="main">
        <h1 className="title">
          Lexurgy
        </h1>

        <p>This site is under construction. Visit the old app below:</p>

        <a className="button big-button" href="https://www.meamoria.com/lexurgy/app/sc">Sound Changer</a>
      </main>
    </div>
  )
}