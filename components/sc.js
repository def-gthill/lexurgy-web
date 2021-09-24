import React from "react";
import styles from "../styles/SC.module.css"
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import lexurgy from "../lib/lexurgy";

// noinspection JSUnresolvedVariable
const lex = lexurgy.com.meamoria.lexurgy

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
      stages: null,
      error: null,
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
              id="showStages"
              type="checkbox"
              checked={this.state.outputArrows}
              onChange={this.setOutputArrows}
            />
            <label htmlFor="showStages">Show Stages</label>
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
    if (this.state.error) {
      return this.state.error
    } else if (!this.state.stages) {
      return ""
    } else if (this.state.outputArrows) {
      const stages = [this.splitInput()].concat(this.state.stages)
      return lex.scMakeStageComparisons(stages).join("\n")
    } else {
      return this.state.stages.at(-1).join("\n")
    }
  }

  setOutputArrows(event) {
    this.setState({outputArrows: event.target.checked})
  }

  runLexurgy() {
    const input = this.splitInput()
    try {
      const soundChanger = lex.SoundChanger.Companion.fromLsc(this.state.changes)
      const stages = soundChanger.change(input).map((result) => result.words)
      this.setState({stages: stages, error: null})
    } catch (e) {
      this.setState({stages: null, error: e.message})
    }
  }

  splitInput() {
    return this.state.input.split(/\r?\n/)
  }
}
