import React from "react";
import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import styles from "../styles/SC.module.css"
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import kotlin from "kotlin";
import lexurgy from "../lib/lexurgy";

const version = "0.15.1"
const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version

export default class SC extends React.Component {
  static defaultProps = {
    input: "",
    changes: "",
  }

  constructor(props) {
    super(props);
    this.state = {
      input: props.input,
      changes: props.changes,
      output: "",
      error: false,
    }
    this.updateEditorWith = this.updateEditorWith.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Lexurgy SC</title>
          <meta name="description" content="A high-powered sound change applier"/>
          <link rel="icon" href="/favicon.png"/>
        </Head>

        <header className={styles.header}>
          <Link href="/">
            <a>
              <Image src="/logo.png" alt="Home" width={96} height={96} layout="fixed"/>
            </a>
          </Link>
          <h1 className={styles.title}>
            Lexurgy Sound&nbsp;Changer
          </h1>
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

        <main className={styles.main}>
          <div className={styles.grid}>
            <Editor
              id="input"
              label="Input Words"
              value={this.state.input}
              updateValue={this.updateEditorWith}
              expectedFileType=".wli"
              styles={`${styles.stackedEditor} ${styles.inputContainer}`}
            />
            <Arrow/>
            <Editor
              id="changes"
              label="Sound Changes"
              value={this.state.changes}
              updateValue={this.updateEditorWith}
              expectedFileType=".lsc"
              styles={`${styles.stackedEditor} ${styles.changesContainer}`}
            />
            <Arrow/>
            <Editor
              id="output"
              label="Output"
              value={this.state.output}
              updateValue={this.updateEditorWith}
              editable={false}
              wrap={this.state.error}
              styles={`${styles.stackedEditor} ${styles.outputContainer}`}
            />
          </div>

          <button className="button big-button" onClick={this.runLexurgy}>Apply</button>
        </main>

        <footer className={styles.footer}>
          Powered by <a href={releaseUrl}>Lexurgy {version}</a>
        </footer>
      </div>
    )
  }

  updateEditorWith(id, newValue) {
    this.setState({[id]: newValue})
  }

  runLexurgy() {
    // noinspection JSUnresolvedVariable
    const sc = lexurgy.com.meamoria.lexurgy.sc
    const input = new kotlin.kotlin.collections.ArrayList(this.state.input.split(/\r?\n/))
    try {
      const soundChanger = sc.SoundChanger.Companion.fromLsc_61zpoe$(this.state.changes)
      const output = soundChanger.change_i6pp2q$(input).toArray()
      this.setState({output: output.join("\n"), error: false})
    } catch (e) {
      this.setState({output: e.message, error: true})
    }
  }
}
