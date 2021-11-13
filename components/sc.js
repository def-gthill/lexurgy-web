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
      runResult: {
        input: null,
        stages: null,
        error: null,
        traceOutput: null,
      },
      outputInputs: true,
      outputArrows: true,
      startAt: new CheckdropState(),
      stopBefore: new CheckdropState(),
      trace: new CheckdropState(),
    }
    this.updateEditorWith = this.updateEditorWith.bind(this)
    this.setOutputInputs = this.setOutputInputs.bind(this)
    this.setOutputArrows = this.setOutputArrows.bind(this)
    this.runLexurgy = this.runLexurgy.bind(this)
    this.updateCheckdrop = this.updateCheckdrop.bind(this)
  }

  render() {
    return (
      <div className={styles.main}>
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
            showLineNumbers
          />
          <Arrow/>
          <Editor
            id="output"
            label="Output"
            value={this.output(this.state)}
            updateValue={this.updateEditorWith}
            expectedFileType={this.state.outputArrows ? ".wlm" : ".wli"}
            editable={false}
            wrap={this.state.runResult.error}
            styles={`${styles.stackedEditor} ${styles.outputContainer}`}
          >
            <div className={styles.showStages}>
              <div>Show:</div>
              <input
                id="showInputs"
                type="checkbox"
                checked={this.state.outputInputs}
                onChange={this.setOutputInputs}
              />
              <label htmlFor="showInputs">Inputs</label>
              <input
                id="showStages"
                type="checkbox"
                checked={this.state.outputArrows}
                onChange={this.setOutputArrows}
              />
              <label htmlFor="showStages">Stages</label>
            </div>
          </Editor>
        </div>
        <div className={styles.controls}>
          <div>
            <Checkdrop
              id="startAt"
              label="Start At Rule"
              options={this.ruleNames(this.state)}
              enabled={this.state.startAt.enabled}
              chosen={this.state.startAt.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="stopBefore"
              label="Stop Before Rule"
              options={this.ruleNames(this.state)}
              enabled={this.state.stopBefore.enabled}
              chosen={this.state.stopBefore.chosen}
              onChange={this.updateCheckdrop}
            />
            <Checkdrop
              id="trace"
              label="Trace Evolution"
              options={this.inputWords(this.state)}
              enabled={this.state.trace.enabled}
              chosen={this.state.trace.chosen}
              onChange={this.updateCheckdrop}
            />
          </div>
          <button className="button big-button" onClick={this.runLexurgy}>Apply</button>
        </div>
      </div>
    )
  }

  updateEditorWith(id, newValue) {
    this.setState({[id]: newValue})
    this.setState((state) => this.updateAllCheckdrops(state))
  }

  setOutputInputs(event) {
    this.setState({outputInputs: event.target.checked})
  }

  setOutputArrows(event) {
    this.setState({outputArrows: event.target.checked})
  }

  runLexurgy() {
    this.setState((state) => {
      const inputWords = this.inputWords(state)
      try {
        const soundChanger = lex.SoundChanger.Companion.fromLsc(state.changes)
        const { result, traceOutput } = this.runSoundChanger(state, soundChanger)
        const stages = result.map((result) => result.words)
        return {
          runResult: {
            input: inputWords,
            stages: stages,
            error: null,
            traceOutput: traceOutput
          }
        }
      } catch (e) {
        return {
          runResult: {
            input: inputWords,
            stages: null,
            error: e.message,
            traceOutput: null,
          }
        }
      }
    })
  }

  updateCheckdrop(id, enabled, chosen) {
    this.setState({[id]: new CheckdropState(enabled, chosen)})
  }


  updateAllCheckdrops(state) {
    return {
      startAt: state.startAt.check(this.ruleNames(state)),
      stopBefore: state.stopBefore.check(this.ruleNames(state)),
      trace: state.trace.check(this.inputWords(state)),
    }
  }

  inputWords(state) {
    return state.input.split(/\r?\n/)
  }

  ruleNames(state) {
    const lines = state.changes.split(/\r?\n/).map(
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

  output(state) {
    const runResult = state.runResult
    if (runResult.error) {
      return runResult.error
    } else if (!runResult.stages) {
      return ""
    } else {
      let inputWords = runResult.input
      let stages = runResult.stages
      let traceOutput = []
      if (runResult.traceOutput) {
        const traceWordIndex = inputWords.indexOf(runResult.traceOutput.word)
        inputWords = [inputWords[traceWordIndex]]
        stages = stages.map((stage) => [stage[traceWordIndex]])
        traceOutput = [""].concat(runResult.traceOutput.lines)
      }
      let allStages = stages
      if (!state.outputArrows) {
        allStages = this.removeIntermediates(allStages)
      }
      if (state.outputInputs) {
        allStages = this.addInputs(allStages, inputWords)
      }
      if (state.outputArrows && !state.outputInputs) {
        allStages = this.addLeadingArrows(allStages)
      }
      return lex.scMakeStageComparisons(allStages).concat(traceOutput).join("\n")
    }
  }

  removeIntermediates(stages) {
    return [stages.at(-1)]
  }

  addInputs(stages, inputWords) {
    return [inputWords].concat(stages)
  }

  addLeadingArrows(stages) {
    return [Array(stages[0].length).fill("")].concat(stages)
  }

  runSoundChanger(state, soundChanger) {
    const traceOutput = []
    const result = soundChanger.change(
      this.inputWords(state),
      state.startAt.enabledAndChosen ? state.startAt.chosen : null,
      state.stopBefore.enabledAndChosen ? state.stopBefore.chosen : null,
      state.trace.enabledAndChosen ? [state.trace.chosen] : [],
      true,
      ((traceLine) => traceOutput.push(traceLine))
    )
    return {
      result: result,
      traceOutput: state.trace.enabledAndChosen ? {
        word: state.trace.chosen,
        lines: (traceOutput || "Word didn't change"),
      } : null
    }
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
