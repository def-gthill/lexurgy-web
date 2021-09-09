import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import kotlin from "kotlin";
import lexurgy from "../lib/lexurgy";

const version = "0.15.1"
const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: "",
      changes: "",
      output: "",
      error: false,
    }
    this.updateInput = this.updateInput.bind(this)
    this.updateChanges = this.updateChanges.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
  }

  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>Lexurgy SC</title>
          <meta name="description" content="A high-powered sound change applier"/>
          <link rel="icon" href="/favicon.ico"/>
        </Head>

        <main className={styles.main}>
          <h1 className={styles.title}>
            Lexurgy Sound&nbsp;Changer
          </h1>

          <div className={styles.grid}>
            <Editor
              id="input"
              label="Input Words"
              value={this.state.input}
              handleChange={this.updateInput}
            />
            <Arrow/>
            <Editor
              id="changes"
              label="Sound Changes"
              value={this.state.changes}
              handleChange={this.updateChanges}
            />
            <Arrow/>
            <Editor
              id="output"
              label="Output"
              value={this.state.output}
              editable={false}
              wrap={this.state.error}
            />
          </div>

          <button className={styles.apply} onClick={this.runLexurgy}>Apply</button>

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

  updateInput(event) {
    const newInput = event.target.value
    this.setState({input: newInput})
  }

  updateChanges(event) {
    const newChanges = event.target.value
    this.setState({changes: newChanges})
  }

  runLexurgy() {
    const sc = lexurgy.com.meamoria.lexurgy.sc
    const input = new kotlin.kotlin.collections.ArrayList(this.state.input.split("\n"))
    try {
      const soundChanger = sc.SoundChanger.Companion.fromLsc_61zpoe$(this.state.changes)
      const output = soundChanger.change_i6pp2q$(input).toArray()
      this.setState({output: output.join("\n"), error: false})
    } catch (e) {
      this.setState({output: e.message, error: true})
    }
  }
}
