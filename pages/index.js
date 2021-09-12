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

        <div className={styles.grid}>
          <Link href="/sc">
            <a className="button big-button">Sound Changer</a>
          </Link>
        </div>
      </main>
    </div>
  )
}