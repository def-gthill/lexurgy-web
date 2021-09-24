import React from "react";
import styles from "../styles/SC.module.css"
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import kotlin from "kotlin";
import lexurgy from "../lib/lexurgy";

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
      outputArrows: true,
    }
    this.updateEditorWith = this.updateEditorWith.bind(this)
    this.output = this.output.bind(this)
    this.setOutputArrows = this.setOutputArrows.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
  }

  render() {
    return (
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
            value={this.output()}
            updateValue={this.updateEditorWith}
            editable={false}
            wrap={this.state.error}
            styles={`${styles.stackedEditor} ${styles.outputContainer}`}
          >
            <input
              id="showInput"
              type="checkbox"
              checked={this.state.outputArrows}
              onChange={this.setOutputArrows}
            />
            <label htmlFor="showInput">Show Input Words</label>
          </Editor>
        </div>

        <button className="button big-button" onClick={this.runLexurgy}>Apply</button>
      </main>
    )
  }

  updateEditorWith(id, newValue) {
    this.setState({[id]: newValue})
  }

  output() {
    if (this.state.error || this.state.outputArrows) {
      return this.state.output
    } else {
      return "foobar"
    }
  }

  setOutputArrows(event) {
    this.setState({outputArrows: event.target.checked})
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
