import React from "react";
import Head from 'next/head'
import styles from '../styles/SC.module.css'
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import kotlin from "kotlin";
import lexurgy from "../lib/lexurgy";

const version = "0.15.1"
const releaseUrl = "https://github.com/def-gthill/lexurgy/releases/tag/v" + version

export default class SC extends React.Component {
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

          <button className="button big-button" onClick={this.runLexurgy}>Apply</button>
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
