import styles from "../styles/Frame.module.css"
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

const version = "1.0.0-preview"
const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version

export default function Frame(props) {
  return (
    <div className={styles.container}>
      <Head>
        <title>Lexurgy SC</title>
        <meta name="description" content="A high-powered sound change applier"/>
        <link rel="icon" href="/favicon.png"/>
      </Head>

      <header className={styles.header}>
        <Image src="/logo.png" alt="Home" width={96} height={96} layout="fixed"/>
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
                href="https://www.meamoria.com/contact-me/"
                target="_blank" rel="noreferrer"
              >Contact</a>
            </li>
          </ul>
        </div>
      </header>

      {props.children}

      <footer className={styles.footer}>
        Powered by <a href={releaseUrl}>Lexurgy {version}</a>
      </footer>
    </div>
  )
}