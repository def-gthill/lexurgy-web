import React from "react";
import styles from "../styles/SC.module.css"
import Editor from "../components/editor"
import Arrow from "../components/arrow"
import lexurgy from "../lib/lexurgy";
import Checkdrop from "./checkdrop";

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
      traceOutput: null,
      outputArrows: true,
      startAt: new CheckdropState(),
      stopBefore: new CheckdropState(),
      trace: new CheckdropState(),
    }
    this.updateEditorWith = this.updateEditorWith.bind(this)
    this.setOutputArrows = this.setOutputArrows.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
    this.updateCheckdrop = this.updateCheckdrop.bind(this)
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
        <div className={styles.controls}>
          <div className={styles.runSettings}>
            <Checkdrop
              id="startAt"
              label="Start At Rule"
              options={this.ruleNames()}
              enabled={this.state.startAt.enabled}
              chosen={this.state.startAt.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="stopBefore"
              label="Stop Before Rule"
              options={this.ruleNames()}
              enabled={this.state.stopBefore.enabled}
              chosen={this.state.stopBefore.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="trace"
              label="Trace Evolution"
              options={this.inputWords()}
              enabled={this.state.trace.enabled}
              chosen={this.state.trace.chosen}
              onChange={this.updateCheckdrop}
            />
          </div>
          <button className="button big-button" onClick={this.runLexurgy}>Apply</button>
        </div>
      </main>
    )
  }

  updateEditorWith(id, newValue) {
    this.setState({[id]: newValue})
    this.updateAllCheckdrops()
  }

  output() {
    if (this.state.error) {
      return this.state.error
    } else if (!this.state.stages) {
      return ""
    } else {
      let inputWords = this.inputWords()
      let stages = this.state.stages
      let traceOutput = []
      if (this.state.traceOutput) {
        const traceWordIndex = inputWords.indexOf(this.state.traceOutput.word)
        inputWords = [inputWords[traceWordIndex]]
        stages = stages.map((stage) => [stage[traceWordIndex]])
        traceOutput = [""].concat(this.state.traceOutput.lines)
      }
      if (this.state.outputArrows) {
        const allStages = [inputWords].concat(stages)
        return lex.scMakeStageComparisons(allStages).concat(traceOutput).join("\n")
      } else {
        return stages.at(-1).concat(traceOutput).join("\n")
      }
    }
  }

  setOutputArrows(event) {
    this.setState({outputArrows: event.target.checked})
  }

  runLexurgy() {
    try {
      const soundChanger = lex.SoundChanger.Companion.fromLsc(this.state.changes)
      const stages = this.runSoundChanger(soundChanger).map((result) => result.words)
      this.setState({stages: stages, error: null})
    } catch (e) {
      this.setState({stages: null, error: e.message})
    }
  }

  runSoundChanger(soundChanger) {
    const traceOutput = []
    const result = soundChanger.change(
      this.inputWords(),
      this.state.startAt.enabledAndChosen ? this.state.startAt.chosen : null,
      this.state.stopBefore.enabledAndChosen ? this.state.stopBefore.chosen : null,
      this.state.trace.enabledAndChosen ? [this.state.trace.chosen] : [],
      true,
      ((traceLine) => traceOutput.push(traceLine))
    )
    this.setState({
      traceOutput: this.state.trace.enabledAndChosen ? {
        word: this.state.trace.chosen,
        lines: (traceOutput || "Word didn't change"),
      } : null}
    )
    return result
  }

  inputWords() {
    return this.state.input.split(/\r?\n/)
  }

  ruleNames() {
    const lines = this.state.changes.split(/\r?\n/).map(
      (line) => line.trim()
    )
    const ruleNameLines = lines.filter((line) =>
      line.endsWith(":") &&
      !(startsWithAnyOf(
        line.toLowerCase(),
        ["syllables", "deromanizer", "romanizer", "then", "else"]
      ))
    )
    return ruleNameLines.map((line) => line.slice(0, -1))
  }

  updateCheckdrop(id, enabled, chosen) {
    this.setState({[id]: new CheckdropState(enabled, chosen)})
  }

  updateAllCheckdrops() {
    this.setState({startAt: this.state.startAt.check(this.ruleNames())})
    this.setState({stopBefore: this.state.stopBefore.check(this.ruleNames())})
    this.setState({trace: this.state.trace.check(this.inputWords())})
  }
}

class CheckdropState {
  constructor(enabled = false, chosen = null) {
    this.enabled = enabled
    this.chosen = chosen
    this.enabledAndChosen = enabled && chosen
  }

  check(options) {
    return new CheckdropState(
      this.enabled,
      options.includes(this.chosen) ? this.chosen : null
    )
  }
}

function startsWithAnyOf(string, possibleStarts) {
  return possibleStarts.some((start) => string.startsWith(start))
}
