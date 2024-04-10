import styles from "../styles/Frame.module.css"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const newUrl = "https://lexurgy-app.vercel.app/sc"

export default function Frame({ children, version }) {
  const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexurgy SC</title>
        <meta name="description" content="A high-powered sound change applier"/>
        <link rel="icon" href="/favicon.png"/>
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <Image src="/logo.png" alt="" width={96} height={96} layout="fixed"/>
        </div>
        {/*<Link href="/">*/}
        {/*  <a>*/}
        {/*    <Image src="/logo.png" alt="Home" width={96} height={96} layout="fixed"/>*/}
        {/*  </a>*/}
        {/*</Link>*/}
        <Link href="/sc">
          <a>
            <h1 className={styles.title}>
              Lexurgy Sound&nbsp;Changer
            </h1>
          </a>
        </Link>
        <div className={styles.spacer}/>
        <div className={styles.menu}>
          <div className={styles.menuButton}>Links</div>
          <ul className={styles.menuList}>
            <li>
              <a
                href="https://www.meamoria.com/lexurgy/html/sc-tutorial.html"
                target="_blank" rel="noreferrer"
              >Docs</a>
            </li>
            <li>
              <a href="/examples/sc" target="_blank">Examples</a>
            </li>
            <li>
              <a
                href="https://github.com/def-gthill/lexurgy"
                target="_blank" rel="noreferrer"
              >GitHub</a>
            </li>
            <li>
              <a
                href="https://ko-fi.com/meamoria"
                target="_blank" rel="noreferrer"
              >Donate</a>
            </li>
          </ul>
        </div>
      </header>

      <main className={styles.main}>{children}</main>

      <footer className={styles.footer}>
        <div>
          Powered by <a href={releaseUrl} target={"_blank"} rel="noreferrer">Lexurgy {version}</a>
        </div>
        <div>
          Try the <a href={newUrl} target={"_blank"} rel="noreferrer">new interface</a>!
        </div>
      </footer>
    </div>
  )
}
